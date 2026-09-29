import React, { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

interface NavigationProps {
  onOpenCheckout: () => void;
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenCheckout,
  onOpenLookup,
  onOpenAdmin,
  isDark,
  onToggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'ARCHIVE', href: '#archive' },
    { label: 'TENETS', href: '#tenets' },
    { label: 'REPORTS', href: '#feedback' },
    { label: 'SPECS', href: '#specs' },
    { label: 'EXCERPT', href: '#excerpt' },
    { label: 'VOL. 01 [LIMITED DROP]', href: '#drop' }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`w-full ${isDark ? 'bg-[#0A0A0A]/95 border-neutral-800' : 'bg-white/95 border-gray-200'} backdrop-blur border-b sticky top-0 z-50 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo / Wordmark */}
        <a href="#" className="flex items-center space-x-2.5 group">
          <span className="w-2.5 h-2.5 bg-[#FF004D] inline-block transform group-hover:scale-110 transition-transform duration-150"></span>
          <span className={`font-['Oswald'] font-bold text-xl sm:text-2xl tracking-tighter ${isDark ? 'text-white' : 'text-black'} uppercase`}>
            ANIMESPROTOCOL
          </span>
        </a>

        {/* Central Navigation Links */}
        <nav className={`hidden md:flex items-center space-x-7 text-xs font-mono tracking-wider font-semibold uppercase ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
          {navLinks.map((link, idx) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`${
                idx === 0 ? 'text-[#FF004D]' : ''
              } hover:text-[#FF004D] ${isDark ? 'hover:text-white' : 'hover:text-black'} transition-colors duration-150`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Button & Theme Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenLookup}
            className={`hidden sm:inline-flex items-center text-[11px] font-mono font-semibold uppercase tracking-wider py-2 px-2.5 border ${
              isDark ? 'border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700' : 'border-gray-300 text-neutral-600 hover:text-black hover:border-gray-400'
            } transition-colors cursor-pointer`}
            title="Retrieve already purchased downloads"
          >
            RETRIEVE FILES
          </button>

          <button
            onClick={onOpenAdmin}
            className={`hidden lg:inline-flex items-center text-[10px] font-mono uppercase tracking-wider py-1.5 px-2 text-[#E5094C] bg-[#E5094C]/10 border border-[#E5094C]/30 hover:bg-[#E5094C]/20 transition-colors cursor-pointer`}
            title="Manage master PDF and EPUB files"
          >
            VAULT ASSETS
          </button>

          <button
            onClick={onToggleTheme}
            title={isDark ? 'Switch to Technical Light Canvas' : 'Switch to Tactical OLED Dark'}
            className={`p-2 rounded-none border ${isDark ? 'border-neutral-800 text-neutral-300 hover:border-neutral-700' : 'border-gray-200 text-neutral-700 hover:border-gray-300'} transition-colors`}
            aria-label="Toggle visual mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenCheckout}
            className="inline-flex items-center gap-1.5 bg-[#E5094C] hover:bg-[#FF004D] text-white text-xs font-mono font-bold uppercase tracking-wider py-2.5 px-4 rounded-none transition-colors duration-150 shadow-sm active:translate-y-px cursor-pointer"
          >
            <span>ACQUIRE — $19</span>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 16 16">
              <path
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                fillRule="evenodd"
              />
            </svg>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 border ${isDark ? 'border-neutral-800 text-white' : 'border-gray-200 text-black'}`}
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b ${isDark ? 'bg-[#0A0A0A] border-neutral-800' : 'bg-white border-gray-200'} px-4 pt-3 pb-6 space-y-3 font-mono text-xs uppercase tracking-wider`}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block py-2 text-neutral-600 hover:text-[#FF004D] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLookup();
              }}
              className="w-full border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 py-2.5 font-bold uppercase tracking-wider text-center"
            >
              RETRIEVE PAST PURCHASES
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full border border-[#E5094C]/40 text-[#E5094C] py-2 font-bold uppercase tracking-wider text-center"
            >
              VAULT ASSETS / STORAGE
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCheckout();
              }}
              className="w-full bg-[#E5094C] text-white py-3 font-bold uppercase tracking-wider text-center"
            >
              ACQUIRE ARCHIVE NOW — $19
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
