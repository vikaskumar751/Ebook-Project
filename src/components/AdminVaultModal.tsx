import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, BookOpen, HardDrive, CheckCircle2, AlertCircle, RefreshCw, Layers, ShieldCheck, Key, Mail, CreditCard } from 'lucide-react';
import { droneEngine } from '../utils/audioSynth';

interface AdminVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

interface FileStatus {
  exists: boolean;
  sizeBytes: number;
  sizeFormatted: string;
  lastModified: string | null;
  filename: string;
}

interface StorageStatus {
  storagePath: string;
  pdf: FileStatus;
  epub: FileStatus;
  plates: FileStatus;
  totalOrders: number;
}

export const AdminVaultModal: React.FC<AdminVaultModalProps> = ({
  isOpen,
  onClose,
  isDark,
}) => {
  const [status, setStatus] = useState<StorageStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingEpub, setUploadingEpub] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/storage-status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (err) {
      console.error('Failed to load storage status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'pdf' | 'epub') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (fileType === 'pdf') setUploadingPdf(true);
    if (fileType === 'epub') setUploadingEpub(true);

    setUploadSuccess(null);
    setUploadError(null);
    droneEngine.playBeep(440, 0.1);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);

    try {
      const res = await fetch(`/api/admin/upload-book?fileType=${fileType}`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to upload asset');
      }

      const data = await res.json();
      setUploadSuccess(`Successfully deployed ${file.name} to vault as "${data.filename}"!`);
      droneEngine.playBeep(880, 0.2);
      await fetchStatus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(msg);
      droneEngine.playBeep(240, 0.2);
    } finally {
      setUploadingPdf(false);
      setUploadingEpub(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className={`relative w-full max-w-2xl border ${
          isDark ? 'bg-[#0E0E0E] border-neutral-800 text-white' : 'bg-white border-gray-300 text-black'
        } p-6 sm:p-8 shadow-2xl transition-all my-8`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pb-4 border-b border-gray-200 dark:border-neutral-800 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#E5094C]"></span>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#E5094C]">
                BACKEND ARCHIVE VAULT & DEPLOYMENT SPECS
              </span>
            </div>
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="font-mono text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>SYNC STATUS</span>
            </button>
          </div>
          <h3 className="font-['Oswald'] font-bold text-2xl uppercase tracking-tight mt-1">
            DIGITAL DELIVERABLE STORAGE & PRODUCTION REQUIREMENTS
          </h3>
          <p className="font-mono text-xs text-neutral-500 mt-1">
            Manage your master PDF and EPUB files. When buyers complete payment, the backend immediately streams these exact files.
          </p>
        </div>

        {uploadSuccess && (
          <div className="mb-5 p-3.5 border border-emerald-500/40 bg-emerald-500/10 font-mono text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {uploadError && (
          <div className="mb-5 p-3.5 border border-red-500/40 bg-red-500/10 font-mono text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Current Vault Files Status */}
        <div className="mb-6 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-neutral-500 text-[10px] uppercase font-bold tracking-wider">
            <span>VAULT REPOSITORY FILES</span>
            <span>SERVER PATH: {status?.storagePath || 'server/storage/books'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* PDF Card */}
            <div className="p-4 border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#E5094C]/20 text-[#E5094C] flex items-center justify-center font-bold text-[10px]">
                    PDF
                  </div>
                  <span className="font-bold">the-iron-will.pdf</span>
                </div>
                <span className="text-[10px] text-emerald-500 font-bold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ACTIVE
                </span>
              </div>

              <div className="text-[11px] text-neutral-500 space-y-1">
                <div>File Size: <span className="text-black dark:text-white font-medium">{status?.pdf.sizeFormatted || '12.4 KB (Default)'}</span></div>
                <div>Last Modified: <span className="text-neutral-400">{status?.pdf.lastModified ? new Date(status.pdf.lastModified).toLocaleString() : 'System Default'}</span></div>
              </div>

              {/* Upload new PDF */}
              <div>
                <label className="block w-full py-2 px-3 border border-dashed border-neutral-400 dark:border-neutral-700 hover:border-[#E5094C] text-center cursor-pointer text-[11px] font-bold text-[#E5094C] transition-colors">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    disabled={uploadingPdf}
                    onChange={(e) => handleFileUpload(e, 'pdf')}
                  />
                  <div className="flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingPdf ? 'UPLOADING...' : 'REPLACE WITH YOUR FINAL .PDF'}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* EPUB Card */}
            <div className="p-4 border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 flex items-center justify-center font-bold text-[10px]">
                    EPUB
                  </div>
                  <span className="font-bold">the-iron-will.epub</span>
                </div>
                <span className="text-[10px] text-emerald-500 font-bold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> ACTIVE
                </span>
              </div>

              <div className="text-[11px] text-neutral-500 space-y-1">
                <div>File Size: <span className="text-black dark:text-white font-medium">{status?.epub.sizeFormatted || '1.2 KB (Default)'}</span></div>
                <div>Last Modified: <span className="text-neutral-400">{status?.epub.lastModified ? new Date(status.epub.lastModified).toLocaleString() : 'System Default'}</span></div>
              </div>

              {/* Upload new EPUB */}
              <div>
                <label className="block w-full py-2 px-3 border border-dashed border-neutral-400 dark:border-neutral-700 hover:border-[#E5094C] text-center cursor-pointer text-[11px] font-bold text-[#E5094C] transition-colors">
                  <input
                    type="file"
                    accept=".epub,application/epub+zip"
                    className="hidden"
                    disabled={uploadingEpub}
                    onChange={(e) => handleFileUpload(e, 'epub')}
                  />
                  <div className="flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingEpub ? 'UPLOADING...' : 'REPLACE WITH YOUR FINAL .EPUB'}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* WHAT ELSE IS NEEDED (Checklist) */}
        <div className="border-t border-gray-200 dark:border-neutral-800 pt-5 space-y-3 font-mono text-xs">
          <div className="font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
            WHAT ELSE IS NEEDED FOR PRODUCTION SALES (CHECKLIST):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-3 border border-neutral-300 dark:border-neutral-800 flex items-start gap-2 bg-neutral-50 dark:bg-black">
              <CreditCard className="w-4 h-4 text-[#E5094C] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-black dark:text-white">1. LIVE PAYMENT GATEWAY</div>
                <div className="text-neutral-500 mt-0.5">
                  Stripe Secret Key + Webhook (or LemonSqueezy) to process real credit cards and auto-confirm orders.
                </div>
              </div>
            </div>

            <div className="p-3 border border-neutral-300 dark:border-neutral-800 flex items-start gap-2 bg-neutral-50 dark:bg-black">
              <Mail className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-black dark:text-white">2. TRANSACTIONAL EMAIL API</div>
                <div className="text-neutral-500 mt-0.5">
                  Resend or SendGrid API key to automatically email the download link and receipt directly to the buyer's inbox.
                </div>
              </div>
            </div>

            <div className="p-3 border border-neutral-300 dark:border-neutral-800 flex items-start gap-2 bg-neutral-50 dark:bg-black">
              <HardDrive className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-black dark:text-white">3. YOUR ACTUAL MASTER FILES</div>
                <div className="text-neutral-500 mt-0.5">
                  Upload your high-res PDF and EPUB files using the upload boxes above or copy them into <code className="text-[#E5094C]">server/storage/books/</code>.
                </div>
              </div>
            </div>

            <div className="p-3 border border-neutral-300 dark:border-neutral-800 flex items-start gap-2 bg-neutral-50 dark:bg-black">
              <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-black dark:text-white">4. CUSTOM DOMAIN & SSL</div>
                <div className="text-neutral-500 mt-0.5">
                  A custom domain (e.g. animesprotocol.com) connected via Cloud Run / Vercel / VPS with automatic HTTPS encryption.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-neutral-800 flex justify-between items-center">
          <div className="font-mono text-[10px] text-neutral-400">
            TOTAL RECORDED ORDERS: <span className="text-white font-bold">{status?.totalOrders || 0}</span>
          </div>
          <button
            onClick={onClose}
            className="bg-[#0A0A0A] dark:bg-white text-white dark:text-black py-2.5 px-6 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
