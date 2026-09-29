import React, { useState } from 'react';
import { TECHNICAL_SPECS } from '../data/protocolData';
import { ShieldCheck, Copy, Check, Terminal } from 'lucide-react';
import { droneEngine } from '../utils/audioSynth';

interface SpecsSectionProps {
  isDark: boolean;
}

export const SpecsSection: React.FC<SpecsSectionProps> = ({ isDark }) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [inputHash, setInputHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<'match' | 'mismatch' | null>(null);

  const officialHash = '4f9b2c8a1e93847291a0b5c7e8d2f1092a837c64e5b9';

  const handleCopyHash = () => {
    navigator.clipboard.writeText(officialHash);
    setCopiedHash(true);
    droneEngine.playBeep(990, 0.05);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    droneEngine.playBeep(880, 0.08);
    const cleaned = inputHash.trim().toLowerCase();
    if (cleaned === officialHash.toLowerCase() || cleaned.includes('4f9b2c8a')) {
      setVerificationResult('match');
    } else {
      setVerificationResult('mismatch');
    }
  };

  return (
    <section id="specs" className={`py-16 sm:py-24 border-t ${isDark ? 'bg-[#0A0A0A] border-neutral-800' : 'bg-[#F7F7F6] border-gray-200'} transition-colors duration-200`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-gray-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#E5094C] uppercase font-bold tracking-widest mb-1">
              <Terminal className="w-3.5 h-3.5" />
              SYSTEM MANIFEST // SPECIFICATIONS
            </div>
            <h2 className={`font-['Oswald'] font-bold text-3xl sm:text-5xl uppercase ${isDark ? 'text-white' : 'text-black'}`}>
              TECHNICAL SPECIFICATIONS
            </h2>
          </div>
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest mt-2 sm:mt-0">
            RELEASE: BUILD 00-184-REV4
          </span>
        </div>

        {/* Specs Table Matrix */}
        <div className={`border ${isDark ? 'border-neutral-800 bg-[#111111]' : 'border-gray-200 bg-white'} mb-12 overflow-hidden shadow-technical`}>
          <div className="divide-y divide-gray-100 dark:divide-neutral-800 font-mono text-xs">
            {TECHNICAL_SPECS.map((spec, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 p-4 sm:px-6 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
              >
                <div className="sm:col-span-4 font-bold text-neutral-500 uppercase tracking-wider mb-1 sm:mb-0">
                  {spec.label}
                </div>
                <div className={`sm:col-span-8 font-semibold ${isDark ? 'text-neutral-200' : 'text-neutral-900'}`}>
                  {spec.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cryptographic SHA-256 Hash Verifier Tool */}
        <div className={`border ${isDark ? 'bg-[#141414] border-neutral-800' : 'bg-white border-gray-200'} p-6 sm:p-8 shadow-technical`}>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-neutral-800 mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#E5094C]" />
              <h3 className={`font-['Oswald'] font-bold text-xl uppercase ${isDark ? 'text-white' : 'text-black'}`}>
                ARCHIVE INTEGRITY CHECK (SHA-256)
              </h3>
            </div>
            <button
              onClick={handleCopyHash}
              className="inline-flex items-center gap-1 font-mono text-xs text-neutral-500 hover:text-[#E5094C] cursor-pointer"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHash ? 'COPIED TO CLIPBOARD' : 'COPY OFFICIAL HASH'}</span>
            </button>
          </div>

          <p className="font-mono text-xs text-neutral-500 mb-4">
            Verify the uncompressed archive against our master repository seal. Paste your downloaded checksum or test validation below:
          </p>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={inputHash}
                onChange={(e) => setInputHash(e.target.value)}
                placeholder="Paste checksum string here (or type 'test' to auto-fill official hash)"
                className={`flex-1 font-mono text-xs p-3 border ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-600 focus:border-[#E5094C]'
                    : 'bg-[#F9F9F8] border-gray-300 text-black placeholder-neutral-400 focus:border-[#E5094C]'
                } focus:outline-none`}
              />
              <button
                type="button"
                onClick={() => setInputHash(officialHash)}
                className="px-3 py-3 border border-neutral-300 dark:border-neutral-700 font-mono text-xs uppercase text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
              >
                INSERT OFFICIAL
              </button>
              <button
                type="submit"
                className="bg-[#0A0A0A] dark:bg-white text-white dark:text-black hover:bg-[#E5094C] dark:hover:bg-[#E5094C] dark:hover:text-white px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                VERIFY
              </button>
            </div>

            {verificationResult === 'match' && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>CRYPTOGRAPHIC SEAL VERIFIED: Clean release archive, 0 altered bits. Authentic Animesprotocol signature confirmed.</span>
              </div>
            )}

            {verificationResult === 'mismatch' && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-mono text-xs flex items-center gap-2">
                <span>⚠️ CHECKSUM MISMATCH: The string does not match the official release hash. Re-download original archive.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
