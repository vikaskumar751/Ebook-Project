import React, { useState, useEffect } from 'react';
import { Clock, Flame, ShieldAlert } from 'lucide-react';

interface LimitedDropBannerProps {
  isDark: boolean;
  onOpenCheckout: () => void;
}

export const LimitedDropBanner: React.FC<LimitedDropBannerProps> = ({ isDark, onOpenCheckout }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 38,
    seconds: 52
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="drop" className={`py-16 border-t ${isDark ? 'bg-[#121212] border-neutral-800' : 'bg-white border-gray-200'} transition-colors duration-200`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className={`border-2 border-[#E5094C] p-6 sm:p-10 ${isDark ? 'bg-black/60' : 'bg-[#FAFAF9]'} relative overflow-hidden`}>
          {/* Top banner tag */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#FF004D] inline-block animate-ping"></span>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#E5094C]">
                BATCH 01 // STRICTLY CAPPED DIGITAL ROTATION
              </span>
            </div>
            <div className="font-mono text-xs text-neutral-500 uppercase">
              ONLY 47 KEYS REMAINING AT $19
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
            <div className="lg:col-span-8 space-y-3">
              <h3 className={`font-['Oswald'] font-extrabold text-2xl sm:text-4xl uppercase tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                VOL. 01 PROTOCOL ARCHIVE DEPLOYMENT
              </h3>
              <p className="font-['Space_Grotesk'] text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                When batch 01 reaches capacity (2,500 units deployed), the inaugural $19 deployment allocation will be sealed. Each acquisition grants perpetual unencrypted access to the complete 184-page codex and 12 tactical 4K art plates with a unique cryptographic signature.
              </p>
            </div>

            {/* Countdown Box */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-center">
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-neutral-500 uppercase mb-2">
                <Clock className="w-3.5 h-3.5 text-[#E5094C]" />
                CURRENT WINDOW CLOSES IN
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#E5094C] tracking-wider">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <span className="font-mono text-[10px] text-neutral-400 uppercase mt-1">
                HOURS · MINUTES · SECONDS
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-gray-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-xs text-neutral-500">
              <ShieldAlert className="w-4 h-4 text-emerald-500" />
              <span>INSTANT DIGITAL DELIVERABLE · PERPETUAL UNENCRYPTED ACCESS</span>
            </div>

            <button
              onClick={onOpenCheckout}
              className="w-full sm:w-auto bg-[#E5094C] hover:bg-[#FF004D] text-white px-8 py-3.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors active:translate-y-px cursor-pointer"
            >
              LOCK IN VOL. 01 ACCESS — $19
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
