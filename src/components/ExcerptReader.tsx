import React, { useState, useEffect } from 'react';
import { EXCERPT_PAGES } from '../data/protocolData';
import { ChevronLeft, ChevronRight, Copy, Check, BookOpen, ListFilter } from 'lucide-react';
import { droneEngine } from '../utils/audioSynth';

interface ExcerptReaderProps {
  isDark: boolean;
  onOpenCheckout: () => void;
}

export const ExcerptReader: React.FC<ExcerptReaderProps> = ({ isDark, onOpenCheckout }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const page = EXCERPT_PAGES[currentPageIndex] || EXCERPT_PAGES[0];

  const handleNext = () => {
    droneEngine.playBeep(1100, 0.04);
    if (currentPageIndex < EXCERPT_PAGES.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePrev = () => {
    droneEngine.playBeep(880, 0.04);
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleSelectChapter = (index: number) => {
    droneEngine.playBeep(980, 0.04);
    setCurrentPageIndex(index);
  };

  const handleCopyQuote = () => {
    if (page.callout) {
      navigator.clipboard.writeText(page.callout);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Optional keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only navigate if not typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowRight' && currentPageIndex < EXCERPT_PAGES.length - 1) {
        setCurrentPageIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentPageIndex > 0) {
        setCurrentPageIndex((prev) => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex]);

  return (
    <section id="excerpt" className={`py-16 sm:py-24 border-t ${isDark ? 'bg-[#0D0D0D] border-neutral-800' : 'bg-white border-gray-200'} transition-colors duration-200`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-gray-200 dark:border-neutral-800 gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#E5094C] uppercase font-bold tracking-widest mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              CODEX PREVIEW // 3-CHAPTER EXCERPTS
            </div>
            <h2 className={`font-['Oswald'] font-bold text-3xl sm:text-4xl uppercase ${isDark ? 'text-white' : 'text-black'}`}>
              SAMPLE OF SOME CHAPTERS
            </h2>
          </div>

          {/* Jump-to-Chapter Select Dropdown */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <ListFilter className="w-3.5 h-3.5 text-[#E5094C] shrink-0" />
            <select
              value={currentPageIndex}
              onChange={(e) => handleSelectChapter(Number(e.target.value))}
              aria-label="Jump to chapter"
              className={`border ${
                isDark ? 'bg-[#141414] border-neutral-700 text-white' : 'bg-white border-gray-300 text-black'
              } p-2 font-mono text-xs cursor-pointer focus:outline-none focus:border-[#E5094C] max-w-[240px] truncate`}
            >
              {EXCERPT_PAGES.map((p, idx) => (
                <option key={idx} value={idx}>
                  {p.chapterNumber}: {p.chapterTitle}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reader Document Container */}
        <div className={`border ${isDark ? 'bg-[#141414] border-neutral-800' : 'bg-[#FAFAF9] border-gray-300'} p-6 sm:p-12 shadow-technical relative`}>
          {/* Top Bar of Document */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200 dark:border-neutral-800 font-mono text-[11px] text-neutral-500 uppercase tracking-widest">
            <span className="text-[#E5094C] font-bold">ANIMESPROTOCOL // CODEX VOL. 01</span>
            <span>
              CHAPTER {String(page.pageNumber).padStart(2, '0')} OF {EXCERPT_PAGES.length}
            </span>
          </div>

          {/* Reading Progress Line */}
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 mb-8 overflow-hidden">
            <div
              className="bg-[#E5094C] h-1 transition-all duration-200"
              style={{ width: `${((currentPageIndex + 1) / EXCERPT_PAGES.length) * 100}%` }}
            ></div>
          </div>

          {/* Chapter Meta */}
          <div className="mb-8">
            <span className="font-mono text-xs text-[#E5094C] font-bold tracking-widest uppercase block mb-1">
              {page.chapterNumber}
            </span>
            <h3 className={`font-['Oswald'] font-extrabold text-2xl sm:text-4xl uppercase tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
              {page.chapterTitle}
            </h3>
            <p className="font-mono text-xs text-neutral-500 uppercase tracking-wider mt-1">
              {page.subtitle}
            </p>
          </div>

          {/* Main Body Paragraphs */}
          <div className="space-y-4 mb-8">
            {page.content.map((paragraph, idx) => (
              <p
                key={idx}
                className={`font-['Space_Grotesk'] text-sm sm:text-base leading-relaxed ${
                  isDark ? 'text-neutral-200' : 'text-neutral-950 font-normal'
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Callout Box */}
          {page.callout && (
            <div className={`border-l-3 border-[#E5094C] p-4 my-6 ${isDark ? 'bg-neutral-900/60' : 'bg-white shadow-xs'} flex items-start justify-between gap-4`}>
              <div className="font-['Space_Grotesk'] text-base font-semibold text-[#E5094C] italic">
                {page.callout}
              </div>
              <button
                onClick={handleCopyQuote}
                className="shrink-0 text-neutral-400 hover:text-black dark:hover:text-white p-1 cursor-pointer"
                title="Copy axiom to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}

          {/* Action Rule */}
          {page.ruleOfAction && (
            <div className="pt-4 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-between font-mono text-xs">
              <span className={`${isDark ? 'text-neutral-300' : 'text-neutral-950'} font-bold uppercase`}>
                {page.ruleOfAction}
              </span>
            </div>
          )}

          {/* Reader Pagination Controls & Horizontal Chapter Strip */}
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-neutral-800 space-y-4">
            {/* Quick-Jump Chapter Number Strip (Scrollable) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
              {EXCERPT_PAGES.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectChapter(i)}
                  className={`shrink-0 px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase transition-all cursor-pointer border ${
                    i === currentPageIndex
                      ? 'bg-[#E5094C] text-white border-[#E5094C]'
                      : isDark
                      ? 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-600'
                      : 'bg-white text-neutral-900 border-gray-300 hover:text-black hover:border-gray-400 font-semibold'
                  }`}
                  title={p.chapterTitle}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center justify-between pt-3 gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPageIndex === 0}
                className={`flex items-center gap-1 font-mono text-[11px] sm:text-xs uppercase font-bold px-3 sm:px-4 py-2 sm:py-2.5 border transition-colors ${
                  currentPageIndex === 0
                    ? 'opacity-30 cursor-not-allowed border-transparent text-neutral-400'
                    : isDark
                    ? 'border-neutral-700 text-white bg-black hover:border-[#E5094C] hover:text-[#E5094C] cursor-pointer'
                    : 'border-neutral-400 text-neutral-950 bg-white hover:border-[#E5094C] hover:text-[#E5094C] cursor-pointer shadow-xs'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                <span>PREV CHAPTER</span>
              </button>

              <span className={`font-mono text-xs font-bold ${isDark ? 'text-neutral-300' : 'text-neutral-900'} shrink-0`}>
                {currentPageIndex + 1} / {EXCERPT_PAGES.length}
              </span>

              <button
                onClick={handleNext}
                disabled={currentPageIndex === EXCERPT_PAGES.length - 1}
                className={`flex items-center gap-1 font-mono text-[11px] sm:text-xs uppercase font-bold px-3 sm:px-4 py-2 sm:py-2.5 border transition-colors ${
                  currentPageIndex === EXCERPT_PAGES.length - 1
                    ? 'opacity-30 cursor-not-allowed border-transparent text-neutral-400'
                    : isDark
                    ? 'border-neutral-700 text-white bg-black hover:border-[#E5094C] hover:text-[#E5094C] cursor-pointer'
                    : 'border-neutral-400 text-neutral-950 bg-white hover:border-[#E5094C] hover:text-[#E5094C] cursor-pointer shadow-xs'
                }`}
              >
                <span>NEXT CHAPTER</span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Read More Trigger Banner */}
        <div className={`mt-8 text-left ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-300 shadow-xs'} border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
          <div>
            <div className={`font-['Oswald'] font-bold text-lg sm:text-xl uppercase ${isDark ? 'text-white' : 'text-neutral-950'}`}>
              UNLOCK ALL 184 PAGES OF THE DEPLOYMENT CODEX
            </div>
            <p className={`font-mono text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-800 font-medium'} mt-1`}>
              Immediate PDF/X-4 download, DRM-free local storage, full high-res vector plates.
            </p>
          </div>

          <button
            onClick={onOpenCheckout}
            className="w-full sm:w-auto shrink-0 bg-[#E5094C] hover:bg-[#FF004D] text-white px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer text-center"
          >
            DOWNLOAD FULL CODEX ($19)
          </button>
        </div>
      </div>
    </section>
  );
};

