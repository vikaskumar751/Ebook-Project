import React, { useState } from 'react';
import { Eye, ShieldCheck, Download, Check } from 'lucide-react';

interface ArchiveSectionProps {
  isDark: boolean;
  onOpenCheckout?: () => void;
}

export const ArchiveSection: React.FC<ArchiveSectionProps> = ({
  isDark,
  onOpenCheckout
}) => {
  const [activeArtModal, setActiveArtModal] = useState<string | null>(null);

  const artPlates = [
    {
      id: 'plate-1',
      title: 'PLATE 01: THE RONIN MIND',
      resolution: '7680 × 4320 px (8K)',
      src: '/src/assets/images/tactical_art_plate_1790215931738.jpg',
      caption: 'High-contrast ink rendering of cognitive discipline and martial isolation.'
    },
    {
      id: 'plate-2',
      title: 'PLATE 02: THE MONOLITH TEMPLE',
      resolution: '7680 × 4320 px (8K)',
      src: '/src/assets/images/monolith_temple_art_1790215943671.jpg',
      caption: 'Brutalist concrete architecture of the sovereign training facility.'
    },
    {
      id: 'plate-3',
      title: 'PLATE 03: CODEX COVER ART',
      resolution: '8192 × 5464 px (Vector / CMYK)',
      src: '/src/assets/images/codex_cover_art_1790215916343.jpg',
      caption: 'Original exhibition cover layout with Swiss typographic grid.'
    }
  ];

  return (
    <section id="archive" className={`py-16 sm:py-24 border-t ${isDark ? 'bg-[#0D0D0D] border-neutral-800' : 'bg-white border-gray-200'} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-200 dark:border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#E5094C] uppercase tracking-widest font-semibold">
              <span className="w-2 h-2 bg-[#E5094C]"></span>
              ARCHIVE COMPONENT BREAKDOWN
            </div>
            <h2 className={`font-['Oswald'] font-bold text-3xl sm:text-5xl uppercase tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
              WHAT YOU ACQUIRE INSIDE VOL. 01
            </h2>
          </div>
          <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest mt-2 md:mt-0">
            TOTAL FILE SIZE: 720 MB // 100% UNRESTRICTED
          </p>
        </div>

        {/* Component 01: The Codex Manual (Full Showcase) */}
        <div className={`mb-16 border ${isDark ? 'bg-[#141414] border-neutral-800' : 'bg-[#F9F9F8] border-gray-200'} p-6 sm:p-10 shadow-technical`}>
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-neutral-800 mb-8 font-mono text-xs">
            <span className="text-[#E5094C] font-bold">COMPONENT 01</span>
            <span className="text-neutral-500 uppercase">184-PAGE MASTER CODEX (PDF/X-4)</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Book Cover Visual with Inspection Trigger */}
            <div className="lg:col-span-4 shrink-0 relative group overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-neutral-900 max-w-sm mx-auto lg:mx-0 w-full aspect-[3/4]">
              <img
                src="/src/assets/images/codex_cover_art_1790215916343.jpg"
                alt="The Iron Will Codex Cover"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => setActiveArtModal('/src/assets/images/codex_cover_art_1790215916343.jpg')}
                  className="bg-white text-black font-mono text-xs px-3.5 py-2 uppercase font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Inspect Full Cover
                </button>
              </div>
            </div>

            {/* Core Blueprint & Modules */}
            <div className="lg:col-span-8 space-y-5">
              <div>
                <h3 className={`font-['Oswald'] font-bold text-2xl sm:text-3xl uppercase ${isDark ? 'text-white' : 'text-black'}`}>
                  THE IRON WILL: COMPLETE TACTICAL MANUAL
                </h3>
                <p className="font-mono text-xs text-neutral-500 uppercase mt-1">
                  EDITION 00-184-PDF // AUTHORIZED FIELD PROTOCOL
                </p>
              </div>

              <p className={`font-['Space_Grotesk'] text-sm sm:text-base ${isDark ? 'text-neutral-300' : 'text-neutral-700'} leading-relaxed`}>
                Written with surgical economy and zero motivational fluff. Contains seven comprehensive operational modules covering voluntary cold-adaptation, uninterrupted creation rituals, hormonal baseline optimization, and psychological resilience under duress.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                <div className={`p-3 border ${isDark ? 'border-neutral-800 bg-neutral-900/50' : 'border-gray-200 bg-white'}`}>
                  <div className="text-[#E5094C] font-bold mb-1">MODULE I – III</div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    Voluntary Adversity, Dopamine Fasting, Tactical Silence & Social Invisibility.
                  </div>
                </div>

                <div className={`p-3 border ${isDark ? 'border-neutral-800 bg-neutral-900/50' : 'border-gray-200 bg-white'}`}>
                  <div className="text-[#E5094C] font-bold mb-1">MODULE IV – VII</div>
                  <div className="text-neutral-600 dark:text-neutral-400">
                    Bodily Subjugation, The Dual-Blade (Creator/Destroyer), Sovereign Worldview & Memento Mori.
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                <div className="font-mono text-xs text-neutral-500">
                  <span>FORMAT: VECTOR PDF & E-PUB · DRM-FREE LOCAL STORAGE</span>
                </div>
                <button
                  onClick={() => onOpenCheckout?.()}
                  className="bg-[#E5094C] hover:bg-[#FF004D] text-white py-2.5 px-5 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Acquire Full Codex ($19) →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Component 02: Tactical Art Plates Gallery (formerly Component 03) */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200 dark:border-neutral-800">
            <div>
              <span className="font-mono text-xs text-[#E5094C] uppercase font-bold tracking-widest block mb-1">
                COMPONENT 02 // 12 HIGH RESOLUTION PLATES
              </span>
              <h3 className={`font-['Oswald'] font-bold text-2xl uppercase ${isDark ? 'text-white' : 'text-black'}`}>
                ARCHIVAL ART PLATES (8K RESOLUTION)
              </h3>
            </div>
            <span className="font-mono text-xs text-neutral-500 hidden sm:inline-block">
              INCLUDED IN ARCHIVE .ZIP
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {artPlates.map((plate) => (
              <div
                key={plate.id}
                className={`border ${isDark ? 'bg-[#141414] border-neutral-800' : 'bg-white border-gray-200'} p-4 flex flex-col justify-between group`}
              >
                <div className="relative overflow-hidden mb-4 bg-neutral-950 aspect-[4/3]">
                  <img
                    src={plate.src}
                    alt={plate.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => setActiveArtModal(plate.src)}
                      className="bg-white text-black font-mono text-xs px-3 py-1.5 uppercase font-bold flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Enlarge Plate
                    </button>
                  </div>
                </div>

                <div>
                  <div className="font-mono text-[11px] text-neutral-500 uppercase">{plate.resolution}</div>
                  <div className={`font-['Oswald'] font-bold text-base uppercase mt-1 ${isDark ? 'text-white' : 'text-black'}`}>
                    {plate.title}
                  </div>
                  <p className="font-['Space_Grotesk'] text-xs text-neutral-500 mt-1">
                    {plate.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeArtModal && (
        <div
          onClick={() => setActiveArtModal(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={activeArtModal}
              alt="Archival Plate Inspection"
              className="max-h-[85vh] max-w-full object-contain border border-neutral-700"
            />
            <p className="text-center font-mono text-xs text-neutral-400 mt-2 uppercase">
              Click anywhere to close inspection
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
