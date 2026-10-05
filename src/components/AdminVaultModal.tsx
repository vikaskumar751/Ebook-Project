import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, BookOpen, HardDrive, CheckCircle2, AlertCircle, RefreshCw, Layers, ShieldCheck, Key, Mail, CreditCard, Copy, Check, ExternalLink } from 'lucide-react';
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
  gateways?: {
    stripe: {
      secretKeyConfigured: boolean;
      webhookSecretConfigured: boolean;
      webhookUrl: string;
    };
    lemonSqueezy: {
      apiKeyConfigured: boolean;
      webhookSecretConfigured: boolean;
      webhookUrl: string;
    };
    razorpay: {
      keyIdConfigured: boolean;
      keySecretConfigured: boolean;
      webhookSecretConfigured: boolean;
      webhookUrl: string;
      currency?: string;
    };
  };
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
  const [copiedWebhook, setCopiedWebhook] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWebhook(id);
    droneEngine.playBeep(880, 0.1);
    setTimeout(() => setCopiedWebhook(null), 2500);
  };

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
                ADMIN CONTROL PANEL // INTERNAL MANAGEMENT
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
            FILE VAULT, PAYMENT GATEWAYS & PRODUCTION MANAGEMENT
          </h3>
          <p className="font-mono text-xs text-neutral-500 mt-1">
            Upload final PDF/EPUB deliverables, configure live Stripe/LemonSqueezy webhooks, and inspect recorded customer purchases.
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

        {/* PAYMENT GATEWAY & WEBHOOK CONFIGURATION (.ENV) */}
        <div className="border-t border-gray-200 dark:border-neutral-800 pt-5 space-y-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="font-bold uppercase tracking-wider text-black dark:text-white text-xs flex items-center gap-2">
              <Key className="w-4 h-4 text-[#E5094C]" />
              <span>PAYMENT GATEWAYS & WEBHOOK CONFIGURATION</span>
            </div>
            <div className="text-[10px] text-neutral-400">
              TARGET FILE: <span className="font-bold text-[#E5094C]">/.env</span> (PROJECT ROOT)
            </div>
          </div>

          <div className="p-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400">
            To enable real live credit card processing, add your secrets into the <strong className="text-black dark:text-white">.env</strong> file in your workspace root.
            The server automatically verifies cryptographically signed webhooks and unlocks deliverable tokens upon successful payment.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-[11px]">
            {/* STRIPE CARD */}
            <div className="p-3.5 border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-black space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="font-bold text-black dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#635BFF]"></span>
                  <span>OPTION A: STRIPE</span>
                </div>
                <a
                  href="https://dashboard.stripe.com/apikeys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  DASHBOARD <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between py-1 border-b border-neutral-200 dark:border-neutral-900">
                  <span className="text-neutral-400">STRIPE_SECRET_KEY</span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                    status?.gateways?.stripe.secretKeyConfigured
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {status?.gateways?.stripe.secretKeyConfigured ? 'DETECTED IN .ENV' : 'NOT DETECTED'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-neutral-200 dark:border-neutral-900">
                  <span className="text-neutral-400">STRIPE_WEBHOOK_SECRET</span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                    status?.gateways?.stripe.webhookSecretConfigured
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {status?.gateways?.stripe.webhookSecretConfigured ? 'DETECTED IN .ENV' : 'NOT DETECTED'}
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <div className="text-[10px] text-neutral-400 mb-1">
                  STRIPE WEBHOOK URL (Listen to: <code className="text-[#E5094C]">checkout.session.completed</code>)
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={status?.gateways?.stripe.webhookUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/stripe`}
                    className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 px-2 py-1 text-[10px] text-neutral-300 select-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(
                      status?.gateways?.stripe.webhookUrl || `${window.location.origin}/api/webhooks/stripe`,
                      'stripe'
                    )}
                    className="px-2 py-1 bg-neutral-200 dark:bg-neutral-800 hover:bg-[#E5094C] hover:text-white transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1 shrink-0"
                  >
                    {copiedWebhook === 'stripe' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* LEMON SQUEEZY CARD */}
            <div className="p-3.5 border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-black space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="font-bold text-black dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FFC233]"></span>
                  <span>OPTION B: LEMON SQUEEZY</span>
                </div>
                <a
                  href="https://app.lemonsqueezy.com/settings/api"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  DASHBOARD <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between py-1 border-b border-neutral-200 dark:border-neutral-900">
                  <span className="text-neutral-400">LEMONSQUEEZY_API_KEY</span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                    status?.gateways?.lemonSqueezy.apiKeyConfigured
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {status?.gateways?.lemonSqueezy.apiKeyConfigured ? 'DETECTED IN .ENV' : 'NOT DETECTED'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-neutral-200 dark:border-neutral-900">
                  <span className="text-neutral-400">LEMONSQUEEZY_WEBHOOK_SECRET</span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                    status?.gateways?.lemonSqueezy.webhookSecretConfigured
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {status?.gateways?.lemonSqueezy.webhookSecretConfigured ? 'DETECTED IN .ENV' : 'NOT DETECTED'}
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <div className="text-[10px] text-neutral-400 mb-1">
                  LEMON SQUEEZY WEBHOOK URL (Listen to: <code className="text-[#E5094C]">order_created</code>)
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={status?.gateways?.lemonSqueezy.webhookUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/lemonsqueezy`}
                    className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 px-2 py-1 text-[10px] text-neutral-300 select-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(
                      status?.gateways?.lemonSqueezy.webhookUrl || `${window.location.origin}/api/webhooks/lemonsqueezy`,
                      'lemon'
                    )}
                    className="px-2 py-1 bg-neutral-200 dark:bg-neutral-800 hover:bg-[#E5094C] hover:text-white transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1 shrink-0"
                  >
                    {copiedWebhook === 'lemon' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* RAZORPAY INTERNATIONAL CARD */}
            <div className="p-3.5 border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-black space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="font-bold text-black dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0C2340] border border-[#0C2340] dark:border-blue-400"></span>
                  <span className="text-[#0C2340] dark:text-blue-400">OPTION C: RAZORPAY</span>
                </div>
                <a
                  href="https://dashboard.razorpay.com/app/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  DASHBOARD <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="text-[10px] text-blue-500 font-bold tracking-wider">
                INTERNATIONAL PAYMENTS ENABLED (USD)
              </div>

              <div className="space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between py-1 border-b border-neutral-200 dark:border-neutral-900">
                  <span className="text-neutral-400">RAZORPAY_KEY_ID</span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                    status?.gateways?.razorpay?.keyIdConfigured
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {status?.gateways?.razorpay?.keyIdConfigured ? 'DETECTED IN .ENV' : 'NOT DETECTED'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-neutral-200 dark:border-neutral-900">
                  <span className="text-neutral-400">RAZORPAY_KEY_SECRET</span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                    status?.gateways?.razorpay?.keySecretConfigured
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {status?.gateways?.razorpay?.keySecretConfigured ? 'DETECTED IN .ENV' : 'NOT DETECTED'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-neutral-200 dark:border-neutral-900">
                  <span className="text-neutral-400">RAZORPAY_WEBHOOK_SECRET</span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                    status?.gateways?.razorpay?.webhookSecretConfigured
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {status?.gateways?.razorpay?.webhookSecretConfigured ? 'DETECTED IN .ENV' : 'NOT DETECTED'}
                  </span>
                </div>
              </div>

              <div className="pt-1">
                <div className="text-[10px] text-neutral-400 mb-1">
                  RAZORPAY WEBHOOK URL (Listen to: <code className="text-[#E5094C]">order.paid, payment.captured</code>)
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={status?.gateways?.razorpay?.webhookUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/razorpay`}
                    className="flex-1 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 px-2 py-1 text-[10px] text-neutral-300 select-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(
                      status?.gateways?.razorpay?.webhookUrl || `${window.location.origin}/api/webhooks/razorpay`,
                      'razorpay'
                    )}
                    className="px-2 py-1 bg-neutral-200 dark:bg-neutral-800 hover:bg-[#E5094C] hover:text-white transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1 shrink-0"
                  >
                    {copiedWebhook === 'razorpay' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
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
