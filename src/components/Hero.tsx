import React from 'react';

interface HeroProps {
  onOpenCheckout: () => void;
  isDark: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onOpenCheckout, isDark }) => {
  return (
    <main className={`flex-grow ${isDark ? 'bg-tech-grid-dark' : 'bg-tech-grid'} relative sm:pb-28 pt-10 sm:pt-16 pb-8 transition-colors duration-200 w-full max-w-full overflow-x-hidden`}>
      <div className="max-w-4xl mx-auto px-3 sm:px-6 text-center">
        {/* Eyebrow Pill Badge */}
        <div className={`inline-flex items-center space-x-2 ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white/90 border-gray-200'} border px-3 py-1.5 mb-6 sm:mb-8 shadow-sm max-w-full overflow-hidden`}>
          <span className="w-1.5 h-1.5 bg-[#E5094C] inline-block animate-pulse shrink-0"></span>
          <span className={`font-mono text-[10px] sm:text-xs uppercase tracking-widest font-semibold truncate ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
            INSTANT DIGITAL DEPLOYMENT // VOL. 01 ACTIVE
          </span>
        </div>

        {/* Main Headline */}
        <h1 className={`font-['Oswald'] font-extrabold text-3xl sm:text-6xl md:text-[68px] leading-[0.98] uppercase letter-compressed break-words ${isDark ? 'text-white' : 'text-black'} mb-6`}>
          <div>YOUR WEAKNESS IS NOT AN IDENTITY.</div>
          <div className="text-[#E5094C] mt-1 tracking-tight">IT IS A CHOICE.</div>
        </h1>

        {/* Subheadline */}
        <p className={`font-['Space_Grotesk'] text-sm sm:text-lg ${isDark ? 'text-neutral-400' : 'text-neutral-600'} max-w-2xl mx-auto font-medium leading-relaxed mb-8 sm:mb-12 px-2`}>
          Join 2,400+ builders, martial artists, and creators weaponizing the Iron Will protocol today.
        </p>

        {/* BEGIN: PricingCard */}
        <section
          className={`${
            isDark ? 'bg-[#111111] border-neutral-800 text-white' : 'bg-white border-gray-200 text-black'
          } border shadow-technical p-4 sm:p-9 text-left max-w-2xl mx-auto relative transition-colors duration-200 overflow-hidden`}
          data-purpose="pricing-module"
        >
          {/* Card Top Bar: Product Name & Price Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-100 dark:border-neutral-800 gap-4 sm:gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#E5094C] shrink-0"></span>
                <h2 className="font-['Oswald'] font-bold text-xl sm:text-2xl tracking-tight uppercase">
                  ANIMES PROTOCOL <span className="text-neutral-400 font-light">//</span> THE IRON WILL
                </h2>
              </div>
              <p className="font-mono text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest mt-1">
                COMPLETE STANDARD ARCHIVE: CODEX + 12 ART PLATES
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="block font-['Oswald'] font-bold text-3xl sm:text-4xl text-[#E5094C] tracking-tight leading-none">
                $19.00
              </span>
              <span className="font-mono text-[10px] text-neutral-400 font-semibold tracking-wider uppercase block mt-1">
                USD [ONE-TIME]
              </span>
            </div>
          </div>

          {/* Key Included Highlights */}
          <div className="py-5 space-y-2.5 font-mono text-xs text-neutral-600 dark:text-neutral-400">
            <div className="flex items-start gap-2">
              <span className="text-[#E5094C] font-bold shrink-0">✓</span>
              <span>184-Page High-Density PDF Field Manual (Typography & Combat Philosophy)</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-[#E5094C] font-bold shrink-0">✓</span>
              <span>12 Archival Tactical Art Plates (Standard 4K Screen sRGB)</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-[#E5094C] font-bold shrink-0">✓</span>
              <span>Perpetual DRM-Free Offline Storage & Cryptographic Checksum</span>
            </div>

            <div className="flex items-start gap-2">
              <span className="text-[#E5094C] font-bold shrink-0">✓</span>
              <span>Instant Vault Key Generation & Direct Local Backup Downloads</span>
            </div>
          </div>

          {/* Card Main CTA Button */}
          <div className="mt-2 mb-6 sm:mb-7">
            <button
              onClick={onOpenCheckout}
              className="w-full bg-[#E5094C] hover:bg-[#FF004D] text-white py-3.5 sm:py-4 px-4 sm:px-6 flex items-center justify-center space-x-2 font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-150 shadow-sm active:translate-y-px cursor-pointer"
            >
              <svg className="w-4 h-4 text-white fill-current animate-pulse shrink-0" viewBox="0 0 20 20">
                <path d="M11.3 1.05a1 1 0 0 0-1.6 0l-7 10a1 1 0 0 0 .8 1.55H9l-1.3 6.4a1 1 0 0 0 1.7.9l7-10a1 1 0 0 0-.8-1.55H11l1.3-6.4a1 1 0 0 0-1-1.35z"></path>
              </svg>
              <span className="truncate">DOWNLOAD ANIMESPROTOCOL ARCHIVE — $19</span>
            </button>
          </div>

          {/* Trust Badges Footer inside card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 pt-2 text-center border-t border-gray-100 dark:border-neutral-800 gap-2 sm:gap-4 font-mono text-[9px] sm:text-[10px] uppercase text-neutral-600 dark:text-neutral-400 font-semibold">
            {/* Item 1: Security */}
            <div className="flex items-center justify-center gap-1.5 py-1">
              <svg className="w-3.5 h-3.5 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect height="10" rx="2" strokeWidth="2" width="14" x="5" y="11"></rect>
                <path d="M8 11V7a4 4 0 018 0v4" strokeWidth="2"></path>
              </svg>
              <span className="tracking-tight">256-BIT ENCRYPTION</span>
            </div>
            {/* Item 2: Speed */}
            <div className="flex items-center justify-center gap-1.5 py-1">
              <svg className="w-3.5 h-3.5 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <span className="tracking-tight">IMMEDIATE DELIVERY</span>
            </div>
            {/* Item 3: Ownership */}
            <div className="flex items-center justify-center gap-1.5 py-1">
              <svg className="w-3.5 h-3.5 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <span className="tracking-tight">DRM-FREE OWNERSHIP</span>
            </div>
          </div>
        </section>
        {/* END: PricingCard */}
      </div>
    </main>
  );
};
