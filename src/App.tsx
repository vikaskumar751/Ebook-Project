/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { ArchiveSection } from './components/ArchiveSection';
import { TenetsSection } from './components/TenetsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ExcerptReader } from './components/ExcerptReader';
import { SpecsSection } from './components/SpecsSection';
import { LimitedDropBanner } from './components/LimitedDropBanner';
import { Footer } from './components/Footer';
import { StickyDock } from './components/StickyDock';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderLookupModal } from './components/OrderLookupModal';
import { AdminVaultModal } from './components/AdminVaultModal';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);
  const [orderLookupOpen, setOrderLookupOpen] = useState<boolean>(false);
  const [adminVaultOpen, setAdminVaultOpen] = useState<boolean>(false);

  // Sync document root class for dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle URL query parameters (?admin=true, #admin, ?checkout_success=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true' || window.location.hash === '#admin') {
      setAdminVaultOpen(true);
    }
    if (params.get('checkout_success') === 'true') {
      setCheckoutOpen(true);
    }

    // Keyboard shortcut: Shift + A toggles Admin Panel
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (e.target as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA'].includes(activeTag)) return;
      if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        setAdminVaultOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenCheckout = () => {
    setCheckoutOpen(true);
  };

  return (
    <div
      className={`min-h-screen w-full max-w-full overflow-x-hidden flex flex-col font-sans antialiased selection:bg-[#FF004D] selection:text-white transition-colors duration-200 ${
        isDark ? 'bg-[#0A0A0A] text-white' : 'bg-[#F7F7F6] text-[#0A0A0A]'
      }`}
    >
      {/* Navigation */}
      <Navigation
        onOpenCheckout={handleOpenCheckout}
        onOpenLookup={() => setOrderLookupOpen(true)}
        onOpenAdmin={() => setAdminVaultOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Main Content */}
      <div className="flex-grow w-full max-w-full overflow-x-hidden">
        {/* Hero with Pricing Card */}
        <Hero onOpenCheckout={handleOpenCheckout} isDark={isDark} />

        {/* The Archive Breakdown (Codex, 8K Art Plates) */}
        <ArchiveSection
          isDark={isDark}
          onOpenCheckout={handleOpenCheckout}
        />

        {/* The 7 Iron Will Tenets */}
        <TenetsSection isDark={isDark} onOpenCheckout={handleOpenCheckout} />

        {/* Member Feedback & Field Reports (Grid / Carousel) */}
        <TestimonialsSection isDark={isDark} onOpenCheckout={handleOpenCheckout} />

        {/* Interactive Codex Excerpt Reader */}
        <ExcerptReader isDark={isDark} onOpenCheckout={handleOpenCheckout} />

        {/* Technical Specifications & SHA-256 Integrity Verifier */}
        <SpecsSection isDark={isDark} />

        {/* Vol 01 Limited Drop Countdown Banner */}
        <LimitedDropBanner isDark={isDark} onOpenCheckout={handleOpenCheckout} />
      </div>

      {/* Main Footer */}
      <Footer
        isDark={isDark}
        onOpenLookup={() => setOrderLookupOpen(true)}
        onOpenAdmin={() => setAdminVaultOpen(true)}
      />

      {/* Floating Bottom Sticky Dock */}
      <StickyDock
        isDark={isDark}
        onOpenCheckout={handleOpenCheckout}
        onOpenAdmin={() => setAdminVaultOpen(true)}
      />

      {/* Checkout & Instant Digital Delivery Vault Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        isDark={isDark}
      />

      {/* Order Lookup / File Retrieval Modal */}
      <OrderLookupModal
        isOpen={orderLookupOpen}
        onClose={() => setOrderLookupOpen(false)}
        isDark={isDark}
      />

      {/* Admin Vault Storage & Specs Guide Modal */}
      <AdminVaultModal
        isOpen={adminVaultOpen}
        onClose={() => setAdminVaultOpen(false)}
        isDark={isDark}
      />
    </div>
  );
}
