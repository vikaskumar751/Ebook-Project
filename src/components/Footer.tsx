import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FooterProps {
  isDark: boolean;
  onOpenLookup?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ isDark, onOpenLookup, onOpenAdmin }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const modalContent: Record<string, { title: string; content: string[] }> = {
    manifesto: {
      title: 'THE ANIMESPROTOCOL MANIFESTO',
      content: [
        'We reject the passive consumerism that characterizes contemporary digital life.',
        'The screen is either a weapon of your sovereign creation or an IV drip of cognitive pacification. There is no middle ground.',
        'Through disciplined physical subjugation, cold exposure, uncompromised attention, and daily creative output, the sovereign operator builds an untouchable fortress of autonomy.',
        'The Iron Will is not a personality trait. It is a daily, voluntary ritual.'
      ]
    },
    terms: {
      title: 'TERMS OF ENGAGEMENT & ACQUISITION',
      content: [
        '1. PERPETUAL OWNERSHIP: You acquire unconditional, offline rights to the complete volume archive.',
        '2. NO TRACKING: We employ zero telemetry, behavioral trackers, or recurring subscription entrapment.',
        '3. RESPONSIBILITY: The physical conditioning protocols demand intense biological effort. Consult a physician before performing high-exertion isometric or cold-exposure drills.'
      ]
    },
    protocol: {
      title: 'DIRECT DOWNLOAD PROTOCOL',
      content: [
        'Upon successful authorization, the server immediately constructs a local direct archive package.',
        'Your unique cryptographic signature is embedded in the SHA-256 manifest.',
        'Store your files across cold offline storage drives. The archive will remain accessible on local hardware forever.'
      ]
    },
    security: {
      title: 'SECURITY HASH & VERIFICATION',
      content: [
        'OFFICIAL MASTER HASH: 4f9b2c8a1e93847291a0b5c7e8d2f1092a837c64e5b9',
        'ALGORITHM: SHA-256 (FIPS 180-4 standard)',
        'DIGITAL FINGERPRINT: 00-184-PDF-STAMP-V1',
        'All downloads must match this cryptographic checksum to guarantee zero manipulation or injected artifacts.'
      ]
    }
  };

  return (
    <>
      <footer className={`w-full ${isDark ? 'bg-[#080808] border-neutral-800' : 'bg-[#f2f2f0] border-gray-200'} border-t text-neutral-700 py-8 mb-16 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 text-xs font-mono">
            {/* Left: Branding & Rights */}
            <div className="space-y-1.5">
              <div className={`font-['Oswald'] font-extrabold text-2xl tracking-tighter ${isDark ? 'text-white' : 'text-black'} uppercase`}>
                ANIMESPROTOCOL
              </div>
              <p className="text-[11px] text-neutral-500 uppercase tracking-wider">
                © 2026 ANIMESPROTOCOL ARCHIVE. ALL RIGHTS RESERVED. CODE 00-184-PDF.
              </p>
            </div>

            {/* Center: Protocols & Terms */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-[11px] font-semibold tracking-wider uppercase text-neutral-600 dark:text-neutral-400">
              <button
                onClick={() => setActiveModal('manifesto')}
                className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                MANIFESTO
              </button>
              <span className="text-neutral-400">•</span>
              <button
                onClick={() => setActiveModal('terms')}
                className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                TERMS OF ENGAGEMENT
              </button>
              <span className="text-neutral-400">•</span>
              <button
                onClick={() => setActiveModal('protocol')}
                className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                DIRECT DOWNLOAD PROTOCOL
              </button>
              <span className="text-neutral-400">•</span>
              <button
                onClick={() => setActiveModal('security')}
                className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                SECURITY HASH
              </button>
              {onOpenLookup && (
                <>
                  <span className="text-neutral-400">•</span>
                  <button
                    onClick={onOpenLookup}
                    className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors cursor-pointer"
                  >
                    RETRIEVE DOWNLOADS
                  </button>
                </>
              )}
              {onOpenAdmin && (
                <>
                  <span className="text-neutral-400">•</span>
                  <button
                    onClick={onOpenAdmin}
                    className="text-[#E5094C] hover:text-[#FF004D] font-bold transition-colors cursor-pointer uppercase underline underline-offset-4 decoration-[#E5094C]/40 hover:decoration-[#E5094C]"
                  >
                    ADMIN CONTROL PANEL
                  </button>
                </>
              )}
            </div>

            {/* Right: Social Links */}
            <div className="flex items-center space-x-3 text-[11px] font-bold tracking-widest uppercase text-neutral-700 dark:text-neutral-400">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#E5094C] transition-colors"
              >
                X.COM
              </a>
              <span className="text-neutral-400">/</span>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#E5094C] transition-colors"
              >
                DISCORD
              </a>
              <span className="text-neutral-400">/</span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#E5094C] transition-colors"
              >
                GITHUB
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Info Dialog Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className={`relative max-w-lg w-full border ${
              isDark ? 'bg-[#111111] border-neutral-800 text-white' : 'bg-white border-gray-300 text-black'
            } p-6 sm:p-8 shadow-2xl`}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#E5094C] font-bold uppercase tracking-wider">
              <span className="w-2 h-2 bg-[#E5094C]"></span>
              ARCHIVE DISCLOSURE
            </div>

            <h3 className="font-['Oswald'] font-bold text-2xl uppercase mb-4">
              {modalContent[activeModal].title}
            </h3>

            <div className="space-y-3 font-['Space_Grotesk'] text-sm text-neutral-600 dark:text-neutral-300 mb-6">
              {modalContent[activeModal].content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full bg-[#0A0A0A] dark:bg-white text-white dark:text-black py-3 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              ACKNOWLEDGE & CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
};
