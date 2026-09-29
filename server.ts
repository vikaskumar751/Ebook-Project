import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage directory setup
const STORAGE_DIR = path.resolve(__dirname, 'server', 'storage');
const BOOKS_DIR = path.resolve(STORAGE_DIR, 'books');
const ORDERS_FILE = path.resolve(STORAGE_DIR, 'orders.json');

// Ensure directories exist
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}
if (!fs.existsSync(BOOKS_DIR)) {
  fs.mkdirSync(BOOKS_DIR, { recursive: true });
}

// Multer config for file uploads (PDF & EPUB)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, BOOKS_DIR);
  },
  filename: (req, file, cb) => {
    const fileType = req.body?.fileType || req.query?.fileType;
    if (fileType === 'pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, 'the-iron-will.pdf');
    } else if (fileType === 'epub' || file.originalname.toLowerCase().endsWith('.epub')) {
      cb(null, 'the-iron-will.epub');
    } else if (fileType === 'plates' || file.originalname.toLowerCase().endsWith('.zip')) {
      cb(null, 'art-plates-4k.zip');
    } else {
      cb(null, file.originalname);
    }
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 150 * 1024 * 1024 }, // 150MB max file size
});

// Minimal valid PDF binary generator as starter placeholder until user uploads real file
function ensureStarterFiles() {
  const pdfPath = path.resolve(BOOKS_DIR, 'the-iron-will.pdf');
  if (!fs.existsSync(pdfPath)) {
    const starterPdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj
4 0 obj
<< /Length 580 >>
stream
BT
/F1 22 Tf
50 720 Td
(ANIMESPROTOCOL // THE IRON WILL - VOL. 01) Tj
/F2 13 Tf
0 -36 Td
(STANDARD ARCHIVE EDITION - 184-PAGE CODEX FIELD MANUAL) Tj
/F2 11 Tf
0 -26 Td
(Authorized Digital Deliverable | Official Cryptographic Distribution) Tj
0 -40 Td
(1. THE SANCTITY OF VOLUNTARY ADVERSITY) Tj
0 -20 Td
(2. ELIMINATION OF HEDONIC LEAKS) Tj
0 -20 Td
(3. TACTICAL SILENCE & STRATEGIC INVISIBILITY) Tj
0 -20 Td
(4. ABSOLUTE BODILY SUBJUGATION) Tj
0 -20 Td
(5. THE DUAL-BLADE PHILOSOPHY) Tj
0 -20 Td
(6. SOVEREIGN COGNITIVE ARCHITECTURE) Tj
0 -20 Td
(7. DEATH CONTEMPLATION AS TEMPORAL FUEL) Tj
0 -40 Td
(Note: Upload your custom the-iron-will.pdf to replace this placeholder.) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000252 00000 n 
0000000885 00000 n 
0000000958 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
1026
%%EOF
`;
    fs.writeFileSync(pdfPath, starterPdf, 'utf-8');
  }

  const epubPath = path.resolve(BOOKS_DIR, 'the-iron-will.epub');
  if (!fs.existsSync(epubPath)) {
    // Write starter text manifest/sample container for EPUB
    const starterEpubNote = `ANIMESPROTOCOL // THE IRON WILL (VOL. 01) - EPUB PACKAGE
================================================================================
This is the default protocol EPUB container.
You can replace this with your final compiled .epub file by:
1. Dropping "the-iron-will.epub" into: server/storage/books/the-iron-will.epub
2. Or using the built-in Admin File Manager upload button in the storefront.
`;
    fs.writeFileSync(epubPath, starterEpubNote, 'utf-8');
  }

  const platesPath = path.resolve(BOOKS_DIR, 'art-plates-4k.zip');
  if (!fs.existsSync(platesPath)) {
    fs.writeFileSync(platesPath, 'ANIMESPROTOCOL // 12 ARCHIVAL 4K ART PLATES REPOSITORY', 'utf-8');
  }
}

ensureStarterFiles();

// Orders database interface
interface OrderRecord {
  orderId: string;
  licenseKey: string;
  downloadToken: string;
  email: string;
  edition: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending';
  paymentMethod: string;
  createdAt: string;
  downloadCounts: {
    pdf: number;
    epub: number;
    plates: number;
    receipt: number;
  };
}

function loadOrders(): OrderRecord[] {
  if (!fs.existsSync(ORDERS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveOrders(orders: OrderRecord[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save orders file:', err);
  }
}

// In-memory cache for fast lookup
let ordersCache: OrderRecord[] = loadOrders();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // API ROUTE: Create Order / Checkout
  app.post('/api/checkout/create-order', (req: Request, res: Response) => {
    const { email, paymentMethod = 'card' } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid delivery email address is required.' });
    }

    const orderId = `AP-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const licenseKey = `AP-IRON-WILL-${Math.floor(1000 + Math.random() * 9000)}-B1-${randomSuffix}`;
    const downloadToken = crypto.randomBytes(24).toString('hex');

    const newOrder: OrderRecord = {
      orderId,
      licenseKey,
      downloadToken,
      email: email.trim().toLowerCase(),
      edition: 'Standard Archive',
      amount: 19.0,
      currency: 'USD',
      status: 'paid',
      paymentMethod,
      createdAt: new Date().toISOString(),
      downloadCounts: {
        pdf: 0,
        epub: 0,
        plates: 0,
        receipt: 0,
      },
    };

    ordersCache.unshift(newOrder);
    saveOrders(ordersCache);

    return res.json({
      success: true,
      order: {
        orderId: newOrder.orderId,
        licenseKey: newOrder.licenseKey,
        downloadToken: newOrder.downloadToken,
        email: newOrder.email,
        amount: newOrder.amount,
        currency: newOrder.currency,
        createdAt: newOrder.createdAt,
      },
      downloads: {
        pdf: `/api/download/pdf?token=${downloadToken}`,
        epub: `/api/download/epub?token=${downloadToken}`,
        plates: `/api/download/plates?token=${downloadToken}`,
        receipt: `/api/download/receipt?token=${downloadToken}`,
      },
    });
  });

  // API ROUTE: Download Handler with token verification
  app.get('/api/download/:format', (req: Request, res: Response) => {
    const { format } = req.params;
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(401).json({ error: 'Missing authorization download token.' });
    }

    const order = ordersCache.find((o) => o.downloadToken === token);
    if (!order) {
      return res.status(403).json({ error: 'Invalid or expired download token. Please verify your order.' });
    }

    if (format === 'pdf') {
      const pdfPath = path.resolve(BOOKS_DIR, 'the-iron-will.pdf');
      if (!fs.existsSync(pdfPath)) {
        return res.status(404).json({ error: 'PDF file not available in vault storage.' });
      }
      order.downloadCounts.pdf += 1;
      saveOrders(ordersCache);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="ANIMESPROTOCOL-THE-IRON-WILL-VOL-01.pdf"');
      return fs.createReadStream(pdfPath).pipe(res);
    }

    if (format === 'epub') {
      const epubPath = path.resolve(BOOKS_DIR, 'the-iron-will.epub');
      if (!fs.existsSync(epubPath)) {
        return res.status(404).json({ error: 'EPUB file not available in vault storage.' });
      }
      order.downloadCounts.epub += 1;
      saveOrders(ordersCache);

      res.setHeader('Content-Type', 'application/epub+zip');
      res.setHeader('Content-Disposition', 'attachment; filename="ANIMESPROTOCOL-THE-IRON-WILL-VOL-01.epub"');
      return fs.createReadStream(epubPath).pipe(res);
    }

    if (format === 'plates') {
      const platesPath = path.resolve(BOOKS_DIR, 'art-plates-4k.zip');
      order.downloadCounts.plates += 1;
      saveOrders(ordersCache);

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="ANIMESPROTOCOL-4K-ART-PLATES.zip"');
      return fs.createReadStream(platesPath).pipe(res);
    }

    if (format === 'receipt') {
      order.downloadCounts.receipt += 1;
      saveOrders(ordersCache);

      const receipt = `================================================================================
ANIMESPROTOCOL // OFFICIAL PERPETUAL LICENSE CERTIFICATE
================================================================================
PRODUCT: ANIMESPROTOCOL // THE IRON WILL (VOL. 01)
EDITION: Standard Archive ($19.00 USD)
STATUS: AUTHORIZED & PAID IN FULL
ORDER ID: ${order.orderId}
LICENSE KEY: ${order.licenseKey}
PURCHASER: ${order.email}
DATE: ${new Date(order.createdAt).toUTCString()}
DOWNLOAD TOKEN: ${order.downloadToken}
SIGNATURE HASH: SHA256-${crypto.createHash('sha256').update(order.licenseKey + order.email).digest('hex')}
DELIVERABLES INCLUDED:
- 184-Page PDF Field Manual (the-iron-will.pdf)
- EPUB Mobile / E-Reader Edition (the-iron-will.epub)
- 12 Archival 4K Art Plates Package
- Perpetual Local DRM-Free License
================================================================================
All rights reserved. ANIMESPROTOCOL 2026.
`;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="LICENSE-${order.orderId}.txt"`);
      return res.send(receipt);
    }

    return res.status(400).json({ error: `Unsupported download format: ${format}` });
  });

  // API ROUTE: Order Lookup / Recovery for Buyers
  app.post('/api/orders/lookup', (req: Request, res: Response) => {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required (Email, Order ID, or License Key).' });
    }

    const cleanQuery = query.trim().toLowerCase();
    const matched = ordersCache.filter(
      (o) =>
        o.email.toLowerCase() === cleanQuery ||
        o.orderId.toLowerCase() === cleanQuery ||
        o.licenseKey.toLowerCase() === cleanQuery
    );

    if (matched.length === 0) {
      return res.status(404).json({ error: 'No order found matching your inquiry.' });
    }

    const orders = matched.map((order) => ({
      orderId: order.orderId,
      licenseKey: order.licenseKey,
      email: order.email,
      edition: order.edition,
      amount: order.amount,
      createdAt: order.createdAt,
      downloadCounts: order.downloadCounts,
      downloads: {
        pdf: `/api/download/pdf?token=${order.downloadToken}`,
        epub: `/api/download/epub?token=${order.downloadToken}`,
        plates: `/api/download/plates?token=${order.downloadToken}`,
        receipt: `/api/download/receipt?token=${order.downloadToken}`,
      },
    }));

    return res.json({ success: true, orders });
  });

  // API ROUTE: Storage Status (shows if PDF/EPUB are uploaded, sizes, paths)
  app.get('/api/admin/storage-status', (_req: Request, res: Response) => {
    const getFileInfo = (filename: string) => {
      const filePath = path.resolve(BOOKS_DIR, filename);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        return {
          exists: true,
          sizeBytes: stats.size,
          sizeFormatted: `${(stats.size / 1024).toFixed(1)} KB`,
          lastModified: stats.mtime.toISOString(),
          filename,
        };
      }
      return {
        exists: false,
        sizeBytes: 0,
        sizeFormatted: '0 KB',
        lastModified: null,
        filename,
      };
    };

    return res.json({
      storagePath: BOOKS_DIR,
      pdf: getFileInfo('the-iron-will.pdf'),
      epub: getFileInfo('the-iron-will.epub'),
      plates: getFileInfo('art-plates-4k.zip'),
      totalOrders: ordersCache.length,
    });
  });

  // API ROUTE: Admin Upload Book / Asset
  app.post('/api/admin/upload-book', upload.single('file'), (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file received.' });
    }

    return res.json({
      success: true,
      message: `File "${req.file.originalname}" successfully saved as "${req.file.filename}".`,
      filename: req.file.filename,
      sizeBytes: req.file.size,
    });
  });

  // API Health Check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'operational',
      timestamp: new Date().toISOString(),
      storageInitialized: fs.existsSync(BOOKS_DIR),
      ordersStored: ordersCache.length,
    });
  });

  // Mount Vite or serve static assets
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server ready on http://0.0.0.0:${PORT}`);
  });
}

startServer();
