import React from 'react';

interface DeploymentCodexCoverProps {
  className?: string;
  onClick?: () => void;
  showScanlines?: boolean;
}

export const DeploymentCodexCover: React.FC<DeploymentCodexCoverProps> = ({
  className = '',
  onClick,
  showScanlines = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative w-full aspect-[2/3] bg-[#0C0D11] text-white flex flex-col justify-between p-6 sm:p-8 select-none overflow-hidden font-mono shadow-2xl border border-neutral-800 ${className}`}
      style={{
        backgroundImage: showScanlines
          ? 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255, 255, 255, 0.025) 3px, rgba(255, 255, 255, 0.025) 4px)'
          : undefined,
      }}
    >
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* TOP HEADER */}
      <div className="relative z-10">
        <div className="flex items-center justify-between text-[9px] sm:text-[11px] tracking-[0.2em] font-bold">
          <span className="text-[#FF0055]">ANIMESPROTOCOL // DEPLOYMENT CODEX</span>
          <span className="text-neutral-400">EDITION 1.0</span>
        </div>
        <div className="w-full h-px bg-neutral-800/90 mt-2.5" />
      </div>

      {/* CENTER TITLES */}
      <div className="relative z-10 my-auto py-4">
        <div className="font-['Oswald'] text-2xl sm:text-4xl text-[#7E8492] font-bold tracking-tight uppercase leading-none">
          THE
        </div>
        <div className="font-['Oswald'] text-4xl sm:text-6xl text-[#F5F2EB] font-black tracking-tight uppercase leading-[0.92] mt-0.5">
          DEPLOYMENT
        </div>
        <div className="font-['Oswald'] text-4xl sm:text-6xl text-[#FF0055] font-black tracking-tight uppercase leading-[0.92]">
          CODEX
        </div>

        {/* RED ACCENT BAR */}
        <div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-[#FF0055] mt-5 sm:mt-6 mb-4 sm:mb-5" />

        {/* SUBTITLE */}
        <div className="text-[10px] sm:text-xs font-bold text-[#F5F2EB] tracking-[0.16em] uppercase leading-relaxed max-w-sm">
          A FIELD MANUAL FOR THE DISCIPLINED CREATOR
        </div>

        {/* RULES */}
        <div className="text-[8px] sm:text-[10px] text-[#7E8492] tracking-[0.18em] uppercase mt-4 sm:mt-5 space-y-1">
          <div>TWELVE CHAPTERS. TWELVE RULES.</div>
          <div>ONE CAMPAIGN.</div>
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="relative z-10">
        <div className="w-full h-px bg-neutral-800/90 mb-3" />
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] tracking-[0.18em]">
          <span className="text-white font-bold">ANIMESPROTOCOL</span>
          <span className="text-[#7E8492]">RESTRICTED // FIELD EDITION</span>
        </div>
        {/* CENTER RED DOT */}
        <div className="flex justify-center mt-3 sm:mt-4">
          <span className="w-2 h-2 bg-[#FF0055]" />
        </div>
      </div>
    </div>
  );
};

// Also export a clean SVG Data URL version that can be used directly as an <img src="..." />
export const DEPLOYMENT_CODEX_SVG_DATA_URL = '/deployment_codex_cover.svg';
