import React, { useState } from 'react';
import { X, Search, Download, BookOpen, FileText, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { droneEngine } from '../utils/audioSynth';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

interface RetrievedOrder {
  orderId: string;
  licenseKey: string;
  email: string;
  edition: string;
  amount: number;
  createdAt: string;
  downloadCounts: {
    pdf: number;
    epub: number;
    plates: number;
    receipt: number;
  };
  downloads: {
    pdf: string;
    epub: string;
    plates: string;
    receipt: string;
  };
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({
  isOpen,
  onClose,
  isDark,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<RetrievedOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setOrders(null);
    droneEngine.playBeep(480, 0.08);

    try {
      const res = await fetch('/api/orders/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'No matching orders found. Please verify your email or order key.');
      }

      const data = await res.json();
      setOrders(data.orders);
      droneEngine.playBeep(880, 0.15);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lookup failed';
      setError(msg);
      droneEngine.playBeep(240, 0.2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        className={`relative w-full max-w-lg border ${
          isDark ? 'bg-[#111111] border-neutral-800 text-white' : 'bg-white border-gray-300 text-black'
        } p-6 sm:p-8 shadow-2xl transition-all my-8`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pb-4 border-b border-gray-200 dark:border-neutral-800 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-emerald-500"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-500">
              VAULT RECOVERY TERMINAL
            </span>
          </div>
          <h3 className="font-['Oswald'] font-bold text-2xl uppercase tracking-tight">
            RETRIEVE PAST PURCHASES
          </h3>
          <p className="font-mono text-xs text-neutral-500 mt-1">
            Already purchased? Enter your email address, Order ID, or License Key to re-download your PDF and EPUB files.
          </p>
        </div>

        <form onSubmit={handleLookup} className="space-y-4 mb-6">
          <div>
            <label className="block font-mono text-[10px] uppercase text-neutral-500 mb-1">
              SEARCH IDENTIFIER (EMAIL, ORDER ID OR LICENSE KEY)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. operator@domain.com or AP-ORD-123456"
                className={`w-full p-3 font-mono text-xs border ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-600 focus:border-[#E5094C]'
                    : 'bg-[#F9F9F8] border-gray-300 text-black placeholder-neutral-400 focus:border-[#E5094C]'
                } focus:outline-none`}
              />
              <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 px-6 font-mono text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            {loading ? 'LOCATING ARCHIVE RECORDS...' : 'RETRIEVE MY DOWNLOADS'}
          </button>
        </form>

        {error && (
          <div className="p-4 border border-red-500/40 bg-red-500/10 font-mono text-xs text-red-400 flex items-start gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-500 font-bold uppercase">
              <CheckCircle className="w-4 h-4" />
              <span>FOUND {orders.length} VERIFIED PURCHASE RECORD(S)</span>
            </div>

            {orders.map((ord) => (
              <div
                key={ord.orderId}
                className="p-4 border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 space-y-3"
              >
                <div className="flex justify-between items-start font-mono text-xs border-b border-neutral-200 dark:border-neutral-800 pb-2">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">ORDER ID</span>
                    <span className="font-bold">{ord.orderId}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-500 uppercase block">STATUS</span>
                    <span className="text-emerald-500 font-bold uppercase">PAID & AUTHORIZED</span>
                  </div>
                </div>

                <div className="font-mono text-xs space-y-1">
                  <div className="text-[10px] text-neutral-500 uppercase">LICENSE KEY</div>
                  <div className="font-bold text-[#E5094C] break-all">{ord.licenseKey}</div>
                </div>

                <div className="space-y-2 pt-1 font-mono text-xs">
                  <div className="text-[10px] text-neutral-500 uppercase font-bold">ACTIVE DOWNLOAD VAULT:</div>
                  
                  <a
                    href={ord.downloads.pdf}
                    download="ANIMESPROTOCOL-THE-IRON-WILL-VOL-01.pdf"
                    className="p-2.5 border border-[#E5094C] bg-white dark:bg-black hover:bg-[#E5094C]/10 flex items-center justify-between text-black dark:text-white"
                  >
                    <span className="font-bold">DOWNLOAD .PDF FIELD MANUAL (184 PAGES)</span>
                    <Download className="w-4 h-4 text-[#E5094C]" />
                  </a>

                  <a
                    href={ord.downloads.epub}
                    download="ANIMESPROTOCOL-THE-IRON-WILL-VOL-01.epub"
                    className="p-2.5 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black hover:border-[#E5094C] flex items-center justify-between text-black dark:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                      <span>DOWNLOAD .EPUB E-READER EDITION</span>
                    </div>
                    <Download className="w-4 h-4 text-neutral-400" />
                  </a>

                  <a
                    href={ord.downloads.plates}
                    download="ANIMESPROTOCOL-4K-ART-PLATES.zip"
                    className="p-2 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-neutral-500 hover:text-black dark:hover:text-white"
                  >
                    <span>12 ARCHIVAL ART PLATES (.ZIP)</span>
                    <Download className="w-3.5 h-3.5 text-neutral-400" />
                  </a>

                  <a
                    href={ord.downloads.receipt}
                    download={`LICENSE-${ord.orderId}.txt`}
                    className="p-2 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-neutral-500 hover:text-black dark:hover:text-white"
                  >
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>OFFICIAL LICENSE RECEIPT (.TXT)</span>
                    </div>
                    <FileText className="w-3.5 h-3.5 text-neutral-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
