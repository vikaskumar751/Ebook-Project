import React, { useState } from 'react';
import { TENETS } from '../data/protocolData';
import { droneEngine } from '../utils/audioSynth';
import { ChevronDown, ChevronUp, Zap, Target } from 'lucide-react';

interface TenetsSectionProps {
  isDark: boolean;
  onOpenCheckout: () => void;
}

export const TenetsSection: React.FC<TenetsSectionProps> = ({ isDark, onOpenCheckout }) => {
  const [expandedId, setExpandedId] = useState<string>('tenet-1');

  const toggleTenet = (id: string) => {
    droneEngine.playBeep(920, 0.04);
    setExpandedId(expandedId === id ? '' : id);
  };

  return (
    <section id="tenets" className={`py-16 sm:py-24 border-t ${isDark ? 'bg-[#0A0A0A] border-neutral-800' : 'bg-[#F7F7F6] border-gray-200'} transition-colors duration-200`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 border border-gray-300 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900 px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 bg-[#FF004D]"></span>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
              PHILOSOPHICAL OPERATING SYSTEM
            </span>
          </div>

          <h2 className={`font-['Oswald'] font-extrabold text-3xl sm:text-5xl uppercase tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
            THE 7 IRON WILL TENETS
          </h2>
          <p className="font-['Space_Grotesk'] text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto mt-3">
            Not passive affirmations. Actionable mental constraints designed to eradicate hesitation, eliminate dopamine addiction, and enforce sovereign mastery.
          </p>
        </div>

        {/* Tenet Cards List */}
        <div className="space-y-4">
          {TENETS.map((tenet) => {
            const isExpanded = expandedId === tenet.id;
            return (
              <div
                key={tenet.id}
                className={`border transition-all duration-200 ${
                  isExpanded
                    ? 'border-[#E5094C] shadow-sm'
                    : isDark
                    ? 'border-neutral-800 hover:border-neutral-700'
                    : 'border-gray-200 hover:border-gray-300'
                } ${isDark ? 'bg-[#111111]' : 'bg-white'}`}
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleTenet(tenet.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#E5094C] shrink-0">
                      {tenet.number}
                    </span>
                    <div>
                      <h3 className={`font-['Oswald'] font-bold text-lg sm:text-xl uppercase tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                        {tenet.title}
                      </h3>
                      <p className="font-mono text-xs text-neutral-500 uppercase tracking-wider mt-0.5">
                        {tenet.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 p-1 border border-neutral-300 dark:border-neutral-700 text-neutral-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-6 sm:px-6 sm:pb-6 pt-2 border-t border-gray-100 dark:border-neutral-800 space-y-4">
                    {/* Core Rule Banner */}
                    <div className="bg-[#E5094C]/10 border-l-2 border-[#E5094C] p-3.5">
                      <div className="font-mono text-[10px] sm:text-[11px] uppercase font-bold text-[#E5094C] mb-1 tracking-wider">
                        AXIOMATIC RULE
                      </div>
                      <div className={`font-['Space_Grotesk'] text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-neutral-950'}`}>
                        "{tenet.coreRule}"
                      </div>
                    </div>

                    <p className={`font-['Space_Grotesk'] text-sm leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-800 font-medium'}`}>
                      {tenet.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
                      {/* Daily Operational Drill Box */}
                      <div className={`border p-3.5 ${
                        isDark ? 'border-neutral-800 bg-neutral-900/70 text-white' : 'border-gray-300 bg-white text-neutral-950 shadow-xs'
                      }`}>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs font-bold text-[#E5094C] uppercase mb-1.5 tracking-wider">
                          <Target className="w-3.5 h-3.5 text-[#E5094C] shrink-0" />
                          <span>DAILY OPERATIONAL DRILL</span>
                        </div>
                        <p className={`font-mono text-xs leading-relaxed font-semibold ${isDark ? 'text-neutral-200' : 'text-neutral-900'}`}>
                          {tenet.dailyDrill}
                        </p>
                      </div>

                      {/* Mental Catalyst Box */}
                      <div className={`border p-3.5 ${
                        isDark ? 'border-neutral-800 bg-neutral-900/70 text-white' : 'border-gray-300 bg-white text-neutral-950 shadow-xs'
                      }`}>
                        <div className={`flex items-center gap-1.5 font-mono text-[11px] sm:text-xs font-bold uppercase mb-1.5 tracking-wider ${
                          isDark ? 'text-amber-400' : 'text-neutral-900'
                        }`}>
                          <Zap className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-amber-400' : 'text-[#E5094C]'}`} />
                          <span>MENTAL CATALYST</span>
                        </div>
                        <p className={`font-mono text-xs italic leading-relaxed font-semibold ${isDark ? 'text-neutral-200' : 'text-neutral-900'}`}>
                          "{tenet.quote}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA within Tenets */}
        <div className="text-center mt-12">
          <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-4">
            THE REMAINING DEEP PROTOCOLS & IMPLEMENTATION SCRIPTS ARE IN THE CODEX
          </p>
          <button
            onClick={onOpenCheckout}
            className="inline-flex items-center gap-2 bg-[#0A0A0A] dark:bg-white text-white dark:text-black hover:bg-[#E5094C] dark:hover:bg-[#E5094C] dark:hover:text-white px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>ACQUIRE FULL PROTOCOL ARCHIVE — $19</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};
