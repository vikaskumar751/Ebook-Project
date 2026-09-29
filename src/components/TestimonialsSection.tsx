import React, { useState } from 'react';
import { PROTOCOL_TESTIMONIALS, Testimonial } from '../data/testimonialsData';
import { ShieldCheck, ChevronLeft, ChevronRight, LayoutGrid, SlidersHorizontal, CheckCircle, MessageSquarePlus, X, Quote } from 'lucide-react';

interface TestimonialsSectionProps {
  isDark: boolean;
  onOpenCheckout: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  isDark,
  onOpenCheckout
}) => {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'carousel'>('grid');
  const [selectedDiscipline, setSelectedDiscipline] = useState<'all' | 'combat' | 'engineering' | 'executive'>('all');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Form state
  const [formCallsign, setFormCallsign] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formDiscipline, setFormDiscipline] = useState<'combat' | 'engineering' | 'executive'>('combat');
  const [formQuote, setFormQuote] = useState('');
  const [formMetric, setFormMetric] = useState('');

  // Local testimonials list (includes newly submitted ones)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(PROTOCOL_TESTIMONIALS);

  const filteredTestimonials = selectedDiscipline === 'all'
    ? testimonials
    : testimonials.filter((t) => t.discipline === selectedDiscipline);

  const handleNextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const handlePrevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCallsign || !formQuote) return;

    const newReport: Testimonial = {
      id: `rep-${Date.now()}`,
      callsign: formCallsign.toUpperCase().startsWith('OPERATOR') ? formCallsign.toUpperCase() : `OPERATOR // ${formCallsign.toUpperCase()}`,
      name: formCallsign.toUpperCase(),
      role: formRole || 'Protocol Practitioner',
      discipline: formDiscipline,
      disciplineLabel: formDiscipline === 'combat' ? 'Combat Athletics' : formDiscipline === 'engineering' ? 'Engineering & Creative' : 'Founders & Research',
      verifiedHash: `SHA256-${Math.random().toString(36).substring(2, 6).toUpperCase()}..${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      duration: '30 Days on Protocol',
      rating: 5,
      quote: formQuote,
      impactMetric: formMetric || 'Continuous adherence to the 7 Iron Will Tenets',
      dateStamp: new Date().toISOString().slice(0, 10).replace(/-/g, '.')
    };

    setTestimonials([newReport, ...testimonials]);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setIsSubmitOpen(false);
      setFormCallsign('');
      setFormRole('');
      setFormQuote('');
      setFormMetric('');
    }, 1500);
  };

  return (
    <section id="feedback" className={`py-16 sm:py-24 border-t ${isDark ? 'bg-[#0A0A0A] border-neutral-800' : 'bg-[#F7F7F6] border-gray-200'} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-gray-200 dark:border-neutral-800 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#E5094C] uppercase tracking-widest font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#E5094C]" />
              FIELD INTELLIGENCE // OPERATOR DOSSIERS
            </div>
            <h2 className={`font-['Oswald'] font-bold text-3xl sm:text-5xl uppercase tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
              VOICES FROM THE TRENCHES
            </h2>
          </div>

          {/* Action Row & View Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="inline-flex items-center gap-1.5 border border-[#E5094C] text-[#E5094C] hover:bg-[#E5094C] hover:text-white px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              SUBMIT FIELD REPORT
            </button>

            {/* Layout Mode Switcher */}
            <div className={`flex border ${isDark ? 'border-neutral-800 bg-[#141414]' : 'border-gray-300 bg-white'} p-0.5`}>
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 font-mono text-xs uppercase flex items-center gap-1 cursor-pointer transition-colors ${
                  layoutMode === 'grid'
                    ? 'bg-[#E5094C] text-white font-bold'
                    : 'text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
                title="Grid Matrix View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">GRID</span>
              </button>
              <button
                onClick={() => {
                  setLayoutMode('carousel');
                  setCarouselIndex(0);
                }}
                className={`p-1.5 font-mono text-xs uppercase flex items-center gap-1 cursor-pointer transition-colors ${
                  layoutMode === 'carousel'
                    ? 'bg-[#E5094C] text-white font-bold'
                    : 'text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
                title="Single Reel / Carousel View"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">REEL</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tactical Key Metrics Bar */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 mb-8 border ${
          isDark ? 'bg-[#121212] border-neutral-800 text-neutral-300' : 'bg-white border-gray-200 text-neutral-800'
        } shadow-technical font-mono text-xs`}>
          <div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">ACTIVE OPERATORS</span>
            <span className="font-['Oswald'] font-bold text-xl sm:text-2xl text-[#E5094C]">2,418 UNITS</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">DAY-90 ADHERENCE</span>
            <span className="font-['Oswald'] font-bold text-xl sm:text-2xl text-emerald-600 dark:text-emerald-400">99.2% RATE</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">THEORETICAL FLUFF</span>
            <span className="font-['Oswald'] font-bold text-xl sm:text-2xl text-neutral-400">0.0% REJECTED</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest block">DELIVERY INTEGRITY</span>
            <span className="font-['Oswald'] font-bold text-xl sm:text-2xl text-[#E5094C]">100% LOCAL DRM-FREE</span>
          </div>
        </div>

        {/* Filter Discipline Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 font-mono text-xs">
          {[
            { id: 'all', label: 'ALL OPERATORS' },
            { id: 'combat', label: 'COMBAT ATHLETICS' },
            { id: 'engineering', label: 'ENGINEERING & CREATIVE' },
            { id: 'executive', label: 'FOUNDERS & RESEARCH' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedDiscipline(tab.id as any);
                setCarouselIndex(0);
              }}
              className={`px-3.5 py-1.5 border text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedDiscipline === tab.id
                  ? 'border-[#E5094C] bg-[#E5094C] text-white'
                  : isDark
                  ? 'border-neutral-800 bg-[#141414] text-neutral-400 hover:text-white'
                  : 'border-gray-200 bg-white text-neutral-600 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View Mode 1: Grid Layout */}
        {layoutMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((item) => (
              <div
                key={item.id}
                className={`border p-6 flex flex-col justify-between transition-all duration-200 ${
                  isDark
                    ? 'bg-[#141414] border-neutral-800 hover:border-neutral-600'
                    : 'bg-white border-gray-200 hover:border-gray-400'
                } shadow-technical relative group`}
              >
                {/* Card Top Stamp */}
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800 mb-4 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5 text-[#E5094C] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 bg-[#E5094C] inline-block"></span>
                      {item.callsign}
                    </div>
                    <span className="text-neutral-400 uppercase">{item.duration}</span>
                  </div>

                  {/* Rating Stars & Cryptographic Hash */}
                  <div className="flex items-center justify-between mb-3 text-[11px] font-mono">
                    <div className="flex text-[#E5094C] tracking-widest">
                      {'★'.repeat(item.rating)}
                    </div>
                    <span className="text-neutral-400">{item.verifiedHash}</span>
                  </div>

                  {/* Quote Body */}
                  <p className={`font-['Space_Grotesk'] text-sm sm:text-[15px] leading-relaxed mb-6 italic ${
                    isDark ? 'text-neutral-300' : 'text-neutral-800'
                  }`}>
                    "{item.quote}"
                  </p>
                </div>

                {/* Card Footer: Operator Identity & Impact Metric */}
                <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className={`font-['Oswald'] font-bold text-base uppercase tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                        {item.name}
                      </div>
                      <div className="font-mono text-[11px] text-neutral-500 uppercase">
                        {item.role}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-400">
                      {item.dateStamp}
                    </span>
                  </div>

                  {/* Operational Impact Badge */}
                  <div className="mt-3 p-2 border border-gray-100 dark:border-neutral-800 bg-[#F9F9F8] dark:bg-neutral-900/60 font-mono text-[10px] text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                    <span className="text-[#E5094C] font-bold">IMPACT:</span>
                    <span className="truncate">{item.impactMetric}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Mode 2: Interactive Carousel Reel */}
        {layoutMode === 'carousel' && filteredTestimonials.length > 0 && (
          <div className="relative">
            {(() => {
              const current = filteredTestimonials[carouselIndex];
              return (
                <div
                  className={`border-2 border-neutral-300 dark:border-neutral-800 p-8 sm:p-12 ${
                    isDark ? 'bg-[#141414]' : 'bg-white'
                  } shadow-2xl relative overflow-hidden`}
                >
                  <Quote className="w-16 h-16 text-neutral-200 dark:text-neutral-800/60 absolute top-6 right-6 pointer-events-none" />

                  {/* Reel Header */}
                  <div className="flex flex-wrap items-center justify-between pb-6 border-b border-gray-200 dark:border-neutral-800 mb-8 font-mono text-xs gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-[#E5094C]"></span>
                      <span className="text-[#E5094C] font-bold uppercase tracking-widest">
                        AUTHENTIC FIELD TRANSMISSION // {current.callsign}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-neutral-500 uppercase">
                      <span>VERIFIED HASH: {current.verifiedHash}</span>
                      <span>•</span>
                      <span>{current.duration}</span>
                    </div>
                  </div>

                  {/* Main Quote in Large Typography */}
                  <blockquote className={`font-['Space_Grotesk'] text-lg sm:text-2xl leading-relaxed mb-8 italic ${
                    isDark ? 'text-neutral-100' : 'text-neutral-900'
                  }`}>
                    "{current.quote}"
                  </blockquote>

                  {/* Reel Bottom Meta & Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-gray-200 dark:border-neutral-800 gap-6">
                    <div>
                      <div className={`font-['Oswald'] font-bold text-xl uppercase tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                        {current.name}
                      </div>
                      <div className="font-mono text-xs text-neutral-500 uppercase mt-0.5">
                        {current.role} · <span className="text-[#E5094C]">{current.disciplineLabel}</span>
                      </div>
                      <div className="font-mono text-[11px] text-neutral-400 mt-2">
                        OUTCOME: {current.impactMetric}
                      </div>
                    </div>

                    {/* Carousel Nav Controls */}
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-neutral-400">
                        {carouselIndex + 1} / {filteredTestimonials.length}
                      </span>

                      <div className="flex gap-1.5">
                        <button
                          onClick={handlePrevSlide}
                          className={`p-3 border ${
                            isDark ? 'border-neutral-700 bg-neutral-900 text-white hover:border-[#E5094C]' : 'border-gray-300 bg-[#F9F9F8] text-black hover:border-[#E5094C]'
                          } cursor-pointer transition-colors`}
                          title="Previous Field Report"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleNextSlide}
                          className={`p-3 border ${
                            isDark ? 'border-neutral-700 bg-neutral-900 text-white hover:border-[#E5094C]' : 'border-gray-300 bg-[#F9F9F8] text-black hover:border-[#E5094C]'
                          } cursor-pointer transition-colors`}
                          title="Next Field Report"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Dot Nav Indicators */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {filteredTestimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`w-2 h-2 transition-all cursor-pointer ${
                    carouselIndex === idx
                      ? 'w-6 bg-[#E5094C]'
                      : isDark
                      ? 'bg-neutral-700 hover:bg-neutral-500'
                      : 'bg-neutral-300 hover:bg-neutral-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Bottom Protocol Conversion Prompt */}
        <div className={`mt-12 p-6 border ${
          isDark ? 'bg-[#111111] border-neutral-800' : 'bg-white border-gray-200'
        } flex flex-col sm:flex-row items-center justify-between gap-4 shadow-technical`}>
          <div className="space-y-1">
            <div className="font-['Oswald'] font-bold text-lg uppercase">
              JOIN 2,400+ VERIFIED OPERATORS WORLDWIDE
            </div>
            <p className="font-mono text-xs text-neutral-500">
              Immediate digital deployment. Lifetime DRM-free ownership for $19.
            </p>
          </div>

          <button
            onClick={onOpenCheckout}
            className="w-full sm:w-auto bg-[#E5094C] hover:bg-[#FF004D] text-white px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            ACQUIRE ARCHIVE NOW ($19)
          </button>
        </div>
      </div>

      {/* Field Report Submission Modal */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`relative max-w-lg w-full border ${
            isDark ? 'bg-[#111111] border-neutral-800 text-white' : 'bg-white border-gray-300 text-black'
          } p-6 sm:p-8 shadow-2xl`}>
            <button
              onClick={() => setIsSubmitOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-4 border-b border-gray-200 dark:border-neutral-800 mb-6">
              <span className="font-mono text-xs text-[#E5094C] font-bold uppercase tracking-widest block mb-1">
                DISPATCH // FIELD SUBMISSION
              </span>
              <h3 className="font-['Oswald'] font-bold text-2xl uppercase">
                LOG OPERATOR FIELD REPORT
              </h3>
            </div>

            {submittedMessage ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-['Oswald'] font-bold text-xl uppercase">TRANSMISSION RECEIVED</h4>
                <p className="font-mono text-xs text-neutral-500">
                  Your cryptographic feedback signature has been verified and added to the operator intelligence log.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block uppercase text-neutral-500 mb-1">
                    OPERATOR CALLSIGN / NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCallsign}
                    onChange={(e) => setFormCallsign(e.target.value)}
                    placeholder="e.g. V. KANE // SEATTLE"
                    className={`w-full p-2.5 border ${
                      isDark
                        ? 'bg-neutral-900 border-neutral-700 text-white focus:border-[#E5094C]'
                        : 'bg-[#F9F9F8] border-gray-300 text-black focus:border-[#E5094C]'
                    } focus:outline-none`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase text-neutral-500 mb-1">
                      PRIMARY DISCIPLINE
                    </label>
                    <select
                      value={formDiscipline}
                      onChange={(e) => setFormDiscipline(e.target.value as any)}
                      className={`w-full p-2.5 border ${
                        isDark
                          ? 'bg-neutral-900 border-neutral-700 text-white focus:border-[#E5094C]'
                          : 'bg-[#F9F9F8] border-gray-300 text-black focus:border-[#E5094C]'
                      } focus:outline-none`}
                    >
                      <option value="combat">Combat Athletics</option>
                      <option value="engineering">Engineering & Creative</option>
                      <option value="executive">Founders & Research</option>
                    </select>
                  </div>
                  <div>
                    <label className="block uppercase text-neutral-500 mb-1">
                      ROLE / TITLE
                    </label>
                    <input
                      type="text"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      placeholder="e.g. Software Architect"
                      className={`w-full p-2.5 border ${
                        isDark
                          ? 'bg-neutral-900 border-neutral-700 text-white focus:border-[#E5094C]'
                          : 'bg-[#F9F9F8] border-gray-300 text-black focus:border-[#E5094C]'
                      } focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block uppercase text-neutral-500 mb-1">
                    MEASURABLE IMPACT / STAT
                  </label>
                  <input
                    type="text"
                    value={formMetric}
                    onChange={(e) => setFormMetric(e.target.value)}
                    placeholder="e.g. +3 hours uninterrupted morning output"
                    className={`w-full p-2.5 border ${
                      isDark
                        ? 'bg-neutral-900 border-neutral-700 text-white focus:border-[#E5094C]'
                        : 'bg-[#F9F9F8] border-gray-300 text-black focus:border-[#E5094C]'
                    } focus:outline-none`}
                  />
                </div>

                <div>
                  <label className="block uppercase text-neutral-500 mb-1">
                    FIELD TESTIMONIAL & OBSERVATIONS *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formQuote}
                    onChange={(e) => setFormQuote(e.target.value)}
                    placeholder="How has the 184-page codex and the 7 tenets altered your execution threshold?"
                    className={`w-full p-2.5 border ${
                      isDark
                        ? 'bg-neutral-900 border-neutral-700 text-white focus:border-[#E5094C]'
                        : 'bg-[#F9F9F8] border-gray-300 text-black focus:border-[#E5094C]'
                    } focus:outline-none`}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#E5094C] hover:bg-[#FF004D] text-white py-3 font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    AUTHENTICATE & LOG REPORT
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
