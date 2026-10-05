import 'dotenv/config';
import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import multer from 'multer';
import Stripe from 'stripe';
import Razorpay from 'razorpay';

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

function registerNewOrder(email: string, paymentMethod = 'card', amount = 19.0): OrderRecord {
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
    amount,
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
  return newOrder;
}

// Extend Request type for rawBody
interface RawBodyRequest extends Request {
  rawBody?: Buffer;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Enable rawBody preservation for cryptographic webhook signature verification
  app.use(
    express.json({
      verify: (req: RawBodyRequest, _res, buf) => {
        req.rawBody = buf;
      },
    })
  );

  // API ROUTE: Create Order / Direct Checkout
  app.post('/api/checkout/create-order', (req: Request, res: Response) => {
    const { email, paymentMethod = 'card' } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid delivery email address is required.' });
    }

    const newOrder = registerNewOrder(email, paymentMethod, 19.0);

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
        pdf: `/api/download/pdf?token=${newOrder.downloadToken}`,
        epub: `/api/download/epub?token=${newOrder.downloadToken}`,
        plates: `/api/download/plates?token=${newOrder.downloadToken}`,
        receipt: `/api/download/receipt?token=${newOrder.downloadToken}`,
      },
    });
  });

  // API ROUTE: Create Stripe Hosted Checkout Session
  app.post('/api/checkout/create-stripe-session', async (req: Request, res: Response) => {
    const { email } = req.body;
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeKey) {
      return res.status(400).json({
        error: 'STRIPE_SECRET_KEY is not configured in .env yet.',
        configured: false,
      });
    }

    try {
      const stripe = new Stripe(stripeKey);
      const origin = req.headers.origin || process.env.APP_URL || `http://localhost:${PORT}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: email && typeof email === 'string' && email.includes('@') ? email : undefined,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'ANIMESPROTOCOL: The Iron Will (Vol 01 Archive)',
                description: 'Complete 184-Page PDF Field Manual + EPUB + 12 Archival 4K Art Plates',
                images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'],
              },
              unit_amount: 1900, // $19.00 USD
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${origin}/?checkout_success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/?checkout_canceled=true`,
        metadata: {
          product: 'the-iron-will-vol-01',
          source: 'animesprotocol-web',
        },
      });

      return res.json({
        success: true,
        url: session.url,
        sessionId: session.id,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create Stripe checkout session';
      console.error('Stripe session creation error:', err);
      return res.status(500).json({ error: msg });
    }
  });

  // API ROUTE: Stripe Webhook
  // Webhook endpoint to configure in Stripe Dashboard: https://dashboard.stripe.com/webhooks
  // URL: https://<YOUR_APP_URL>/api/webhooks/stripe
  // Events to listen for: checkout.session.completed
  app.post('/api/webhooks/stripe', async (req: RawBodyRequest, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (!webhookSecret || !stripeKey) {
      console.warn('Stripe webhook received but STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY is missing.');
      return res.status(400).send('Webhook secret or API key not configured');
    }

    if (!sig || !req.rawBody) {
      return res.status(400).send('Missing signature or payload');
    }

    let event: Stripe.Event;

    try {
      const stripe = new Stripe(stripeKey);
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid signature';
      console.error(`⚠️ Webhook signature verification failed: ${msg}`);
      return res.status(400).send(`Webhook Error: ${msg}`);
    }

    // Handle checkout session completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email || session.customer_email;

      if (customerEmail) {
        console.log(`[Stripe Webhook] Verified payment for ${customerEmail}. Unlocking deliverables...`);
        const amountTotal = session.amount_total ? session.amount_total / 100 : 19.0;
        const newOrder = registerNewOrder(customerEmail, 'stripe', amountTotal);
        console.log(`[Stripe Webhook] Order registered: ${newOrder.orderId} (License: ${newOrder.licenseKey})`);
      }
    }

    return res.json({ received: true });
  });

  // API ROUTE: Lemon Squeezy Webhook
  // Webhook endpoint to configure in Lemon Squeezy Dashboard: https://app.lemonsqueezy.com/settings/webhooks
  // URL: https://<YOUR_APP_URL>/api/webhooks/lemonsqueezy
  // Events to listen for: order_created
  app.post('/api/webhooks/lemonsqueezy', (req: RawBodyRequest, res: Response) => {
    const signature = req.headers['x-signature'] as string;
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (!secret) {
      console.warn('Lemon Squeezy webhook received but LEMONSQUEEZY_WEBHOOK_SECRET is not configured.');
      return res.status(400).send('Webhook secret not configured');
    }

    if (!signature || !req.rawBody) {
      return res.status(400).send('Missing signature or raw body');
    }

    // Verify HMAC-SHA256 signature
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(req.rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
      console.error('⚠️ Lemon Squeezy signature verification failed.');
      return res.status(400).send('Invalid signature');
    }

    const payload = req.body;
    const eventName = payload?.meta?.event_name;

    if (eventName === 'order_created') {
      const customerEmail = payload?.data?.attributes?.user_email;
      const totalFormatted = payload?.data?.attributes?.total_formatted;
      const amount = payload?.data?.attributes?.total ? payload.data.attributes.total / 100 : 19.0;

      if (customerEmail) {
        console.log(`[Lemon Squeezy Webhook] Order created for ${customerEmail} (${totalFormatted})`);
        const newOrder = registerNewOrder(customerEmail, 'lemonsqueezy', amount);
        console.log(`[Lemon Squeezy Webhook] Order registered: ${newOrder.orderId} (License: ${newOrder.licenseKey})`);
      }
    }

    return res.json({ received: true });
  });

  // API ROUTE: Create Razorpay International Order
  app.post('/api/checkout/create-razorpay-order', async (req: Request, res: Response) => {
    const { email } = req.body;
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(400).json({
        error: 'Razorpay keys (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are not configured in .env yet.',
        configured: false,
      });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid delivery email address is required.' });
    }

    try {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      // International payment in USD (1900 cents = $19.00 USD)
      const options = {
        amount: 1900,
        currency: 'USD',
        receipt: `AP_RCPT_${Date.now()}`,
        notes: {
          product: 'the-iron-will-vol-01',
          customer_email: email.trim().toLowerCase(),
        },
      };

      const order = await razorpay.orders.create(options);
      return res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create Razorpay order';
      console.error('Razorpay order creation error:', err);
      return res.status(500).json({ error: msg });
    }
  });

  // API ROUTE: Verify Razorpay Payment Signature
  app.post('/api/checkout/verify-razorpay-payment', (req: Request, res: Response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = req.body;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return res.status(400).json({ error: 'RAZORPAY_KEY_SECRET is not configured in .env.' });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing Razorpay verification parameters.' });
    }

    // Cryptographic signature check: HMAC_SHA256(order_id + "|" + payment_id, secret)
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('⚠️ Razorpay payment signature verification failed.');
      return res.status(400).json({ error: 'Invalid Razorpay payment signature.' });
    }

    const customerEmail = email && typeof email === 'string' && email.includes('@')
      ? email.trim().toLowerCase()
      : 'customer@razorpay.international';

    const newOrder = registerNewOrder(customerEmail, 'razorpay', 19.0);
    console.log(`[Razorpay Payment Verified] Order registered: ${newOrder.orderId} (License: ${newOrder.licenseKey})`);

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
        pdf: `/api/download/pdf?token=${newOrder.downloadToken}`,
        epub: `/api/download/epub?token=${newOrder.downloadToken}`,
        plates: `/api/download/plates?token=${newOrder.downloadToken}`,
        receipt: `/api/download/receipt?token=${newOrder.downloadToken}`,
      },
    });
  });

  // API ROUTE: Razorpay Webhook
  // Webhook endpoint to configure in Razorpay Dashboard: https://dashboard.razorpay.com/app/webhooks
  // URL: https://<YOUR_APP_URL>/api/webhooks/razorpay
  // Events to listen for: order.paid, payment.captured
  app.post('/api/webhooks/razorpay', (req: RawBodyRequest, res: Response) => {
    const signature = req.headers['x-razorpay-signature'] as string;
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.warn('Razorpay webhook received but RAZORPAY_WEBHOOK_SECRET is not configured.');
      return res.status(400).send('Webhook secret not configured');
    }

    if (!signature || !req.rawBody) {
      return res.status(400).send('Missing signature or raw body');
    }

    // Verify HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('⚠️ Razorpay webhook signature verification failed.');
      return res.status(400).send('Invalid signature');
    }

    const event = req.body?.event;
    const payload = req.body?.payload;

    if (event === 'order.paid' || event === 'payment.captured') {
      const email =
        payload?.payment?.entity?.email ||
        payload?.order?.entity?.notes?.customer_email;
      const amount = payload?.payment?.entity?.amount
        ? payload.payment.entity.amount / 100
        : 19.0;

      if (email) {
        console.log(`[Razorpay Webhook] Verified payment for ${email} (${amount} USD). Unlocking deliverables...`);
        const newOrder = registerNewOrder(email, 'razorpay', amount);
        console.log(`[Razorpay Webhook] Order registered: ${newOrder.orderId} (License: ${newOrder.licenseKey})`);
      }
    }

    return res.json({ status: 'ok' });
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
  app.get('/api/admin/storage-status', (req: Request, res: Response) => {
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

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    return res.json({
      storagePath: BOOKS_DIR,
      pdf: getFileInfo('the-iron-will.pdf'),
      epub: getFileInfo('the-iron-will.epub'),
      plates: getFileInfo('art-plates-4k.zip'),
      totalOrders: ordersCache.length,
      gateways: {
        stripe: {
          secretKeyConfigured: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.length > 5),
          webhookSecretConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_WEBHOOK_SECRET.length > 5),
          webhookUrl: `${baseUrl}/api/webhooks/stripe`,
        },
        lemonSqueezy: {
          apiKeyConfigured: Boolean(process.env.LEMONSQUEEZY_API_KEY && process.env.LEMONSQUEEZY_API_KEY.length > 5),
          webhookSecretConfigured: Boolean(process.env.LEMONSQUEEZY_WEBHOOK_SECRET && process.env.LEMONSQUEEZY_WEBHOOK_SECRET.length > 5),
          webhookUrl: `${baseUrl}/api/webhooks/lemonsqueezy`,
        },
        razorpay: {
          keyIdConfigured: Boolean(
            (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID.length > 5) ||
            (process.env.VITE_RAZORPAY_KEY_ID && process.env.VITE_RAZORPAY_KEY_ID.length > 5)
          ),
          keySecretConfigured: Boolean(process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET.length > 5),
          webhookSecretConfigured: Boolean(process.env.RAZORPAY_WEBHOOK_SECRET && process.env.RAZORPAY_WEBHOOK_SECRET.length > 5),
          webhookUrl: `${baseUrl}/api/webhooks/razorpay`,
          currency: 'USD (International)',
        },
      },
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
