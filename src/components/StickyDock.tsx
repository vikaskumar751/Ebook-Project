import React from 'react';

interface StickyDockProps {
  isDark: boolean;
  onOpenCheckout: () => void;
  onOpenAdmin?: () => void;
}

export const StickyDock: React.FC<StickyDockProps> = ({
  isDark,
  onOpenCheckout,
  onOpenAdmin
}) => {
  return (
    <aside
      className={`fixed bottom-0 left-0 right-0 z-40 ${
        isDark ? 'bg-[#0A0A0A]/95 border-neutral-800' : 'bg-white/95 border-gray-200'
      } backdrop-blur border-t shadow-md transition-colors duration-200`}
      data-purpose="floating-bottom-dock"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 overflow-hidden">
        {/* Dock Left Info */}
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 mr-1 sm:mr-2">
          <div className="min-w-0">
            <h3 className={`font-['Oswald'] font-bold text-xs sm:text-base uppercase tracking-tight truncate ${isDark ? 'text-white' : 'text-black'}`}>
              <span className="sm:hidden">CODEX VOL. 01</span>
              <span className="hidden sm:inline">ANIMESPROTOCOL: THE DEPLOYMENT CODEX</span>
            </h3>
            <p className="font-mono text-[9px] sm:text-xs text-neutral-500 uppercase tracking-wider truncate">
              $19.00 USD <span className="hidden sm:inline">// LIFETIME ACCESS</span>
            </p>
          </div>

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="hidden sm:inline-block text-[9px] sm:text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-1 text-[#E5094C] bg-[#E5094C]/10 border border-[#E5094C]/30 hover:bg-[#E5094C]/25 transition-colors cursor-pointer"
              title="Open Admin Panel"
            >
              ADMIN
            </button>
          )}

          {/* Dock Tech Icons */}
          <div className="hidden md:flex items-center space-x-2 text-neutral-400 pl-2 border-l border-gray-200 dark:border-neutral-800">
            <svg className="w-3.5 h-3.5 hover:text-black dark:hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect height="10" rx="2" strokeWidth="2" width="14" x="5" y="11"></rect>
              <path d="M8 11V7a4 4 0 018 0v4" strokeWidth="2"></path>
            </svg>

            <svg className="w-3.5 h-3.5 hover:text-black dark:hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>

            <svg className="w-3.5 h-3.5 hover:text-[#E5094C] transition-colors" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11.3 1.05a1 1 0 0 0-1.6 0l-7 10a1 1 0 0 0 .8 1.55H9l-1.3 6.4a1 1 0 0 0 1.7.9l7-10a1 1 0 0 0-.8-1.55H11l1.3-6.4a1 1 0 0 0-1-1.35z"></path>
            </svg>
          </div>
        </div>

        {/* Dock Right CTA Button */}
        <div className="shrink-0">
          <button
            onClick={onOpenCheckout}
            className="inline-flex items-center gap-1.5 bg-[#E5094C] hover:bg-[#FF004D] text-white text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider py-2 px-3 sm:py-2.5 sm:px-6 transition-all duration-150 shadow-sm active:translate-y-px cursor-pointer"
          >
            <span>ORDER NOW</span>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
              <path
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};
