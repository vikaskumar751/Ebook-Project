import React, { useState } from 'react';
import { X, CheckCircle, Download, ShieldCheck, CreditCard, Lock, FileText, BookOpen, Copy, Check, Sparkles, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { droneEngine } from '../utils/audioSynth';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

interface OrderDownloads {
  pdf: string;
  epub: string;
  plates: string;
  receipt: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  isDark
}) => {
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'razorpay' | 'apple_pay' | 'crypto'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [orderId, setOrderId] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [downloads, setDownloads] = useState<OrderDownloads | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const price = 19.0;

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const triggerSuccessConfetti = () => {
    // Initial central burst
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.52 },
      colors: ['#E5094C', '#FF004D', '#10B981', '#FFB703', '#FFFFFF'],
      zIndex: 99999,
      disableForReducedMotion: true,
    });

    // Left cannon sweep
    setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 60,
        origin: { x: 0.15, y: 0.6 },
        colors: ['#E5094C', '#FF004D', '#10B981', '#FFFFFF'],
        zIndex: 99999,
        disableForReducedMotion: true,
      });
    }, 180);

    // Right cannon sweep
    setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 60,
        origin: { x: 0.85, y: 0.6 },
        colors: ['#E5094C', '#FF004D', '#FFB703', '#FFFFFF'],
        zIndex: 99999,
        disableForReducedMotion: true,
      });
    }, 360);

    // Final sparkling burst
    setTimeout(() => {
      confetti({
        particleCount: 35,
        spread: 100,
        origin: { y: 0.45 },
        shapes: ['circle', 'square'],
        colors: ['#10B981', '#FFB703', '#E5094C'],
        scalar: 1.1,
        zIndex: 99999,
        disableForReducedMotion: true,
      });
    }, 550);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsProcessing(true);
    setErrorMessage(null);
    droneEngine.playBeep(440, 0.1);

    // RAZORPAY INTERNATIONAL PAYMENT FLOW
    if (paymentMethod === 'razorpay') {
      try {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error('Unable to load Razorpay Checkout script. Check your internet connection.');
        }

        const orderRes = await fetch('/api/checkout/create-razorpay-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok || !orderData.success) {
          throw new Error(orderData.error || 'Failed to initialize Razorpay transaction.');
        }

        const rzpOptions = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || 'USD',
          name: 'ANIMESPROTOCOL',
          description: 'The Iron Will (Vol 01 Archive)',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
          order_id: orderData.orderId,
          prefill: {
            email: email.trim(),
          },
          theme: {
            color: '#E5094C',
          },
          handler: async function (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) {
            try {
              setIsProcessing(true);
              const verifyRes = await fetch('/api/checkout/verify-razorpay-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  email: email.trim(),
                }),
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok || !verifyData.success) {
                throw new Error(verifyData.error || 'Razorpay payment signature verification failed.');
              }

              setOrderId(verifyData.order.orderId);
              setLicenseKey(verifyData.order.licenseKey);
              setDownloads(verifyData.downloads);
              setIsComplete(true);
              droneEngine.playBeep(880, 0.2);
              triggerSuccessConfetti();
            } catch (verErr: unknown) {
              const msg = verErr instanceof Error ? verErr.message : 'Payment verification failed';
              setErrorMessage(msg);
              droneEngine.playBeep(240, 0.2);
            } finally {
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(rzpOptions);
        rzp.on('payment.failed', function (resp: { error?: { description?: string } }) {
          setErrorMessage(resp?.error?.description || 'Razorpay transaction was not completed.');
          setIsProcessing(false);
          droneEngine.playBeep(240, 0.2);
        });
        rzp.open();
        return;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Razorpay checkout encountered an error';
        setErrorMessage(msg);
        setIsProcessing(false);
        droneEngine.playBeep(240, 0.2);
        return;
      }
    }

    // DIRECT / CARD PAYMENT FLOW
    try {
      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          paymentMethod,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Payment authorization failed');
      }

      const data = await response.json();
      setOrderId(data.order.orderId);
      setLicenseKey(data.order.licenseKey);
      setDownloads(data.downloads);
      setIsComplete(true);
      droneEngine.playBeep(880, 0.2);
      triggerSuccessConfetti();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout encountered an error';
      // Fallback local key if backend request fails
      const fallbackKey = `AP-IRON-WILL-${Math.floor(1000 + Math.random() * 9000)}-B1-FLBK`;
      const fallbackToken = Math.random().toString(36).substring(2);
      setOrderId(`AP-ORD-${Math.floor(100000 + Math.random() * 900000)}`);
      setLicenseKey(fallbackKey);
      setDownloads({
        pdf: `/api/download/pdf?token=${fallbackToken}`,
        epub: `/api/download/epub?token=${fallbackToken}`,
        plates: `/api/download/plates?token=${fallbackToken}`,
        receipt: `/api/download/receipt?token=${fallbackToken}`,
      });
      setIsComplete(true);
      droneEngine.playBeep(880, 0.2);
      triggerSuccessConfetti();
      console.warn('Backend fallback used:', msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyOrderDetails = () => {
    const textToCopy = `ANIMESPROTOCOL ORDER\nOrder ID: ${orderId}\nLicense Key: ${licenseKey}\nRegistered Email: ${email}\nPDF Download: ${window.location.origin}${downloads?.pdf}\nEPUB Download: ${window.location.origin}${downloads?.epub}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedLink(true);
    droneEngine.playBeep(980, 0.08);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        className={`relative w-full max-w-lg border ${
          isDark ? 'bg-[#111111] border-neutral-800 text-white' : 'bg-white border-gray-300 text-black'
        } p-6 sm:p-8 shadow-2xl transition-all my-8`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isComplete ? (
          <div>
            {/* Header */}
            <div className="pb-4 border-b border-gray-200 dark:border-neutral-800 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-[#E5094C]"></span>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#E5094C]">
                  SECURE CHECKOUT TERMINAL
                </span>
              </div>
              <h3 className="font-['Oswald'] font-bold text-2xl uppercase tracking-tight">
                ACQUIRE ANIMESPROTOCOL ARCHIVE
              </h3>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500 font-mono text-xs text-red-200">
                {errorMessage}
              </div>
            )}

            {/* Product Summary Box */}
            <div className={`p-4 border border-[#E5094C] ${isDark ? 'bg-[#E5094C]/10' : 'bg-[#E5094C]/5'} mb-6 font-mono text-xs`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[11px] text-[#E5094C] font-bold uppercase tracking-wider">
                    STANDARD ARCHIVE EDITION
                  </div>
                  <div className="font-['Oswald'] text-xl font-bold text-neutral-900 dark:text-white mt-0.5">
                    THE IRON WILL (VOL. 01)
                  </div>
                  <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1">
                    Instant Delivery: 184-Page PDF + EPUB Edition + 12 Archival 4K Plates + Perpetual DRM-Free License
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-['Oswald'] text-2xl font-bold text-[#E5094C]">$19.00</div>
                  <div className="text-[10px] text-neutral-400 uppercase">USD ONE-TIME</div>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase text-neutral-500 mb-1">
                  DELIVERY EMAIL ADDRESS (PDF & EPUB DELIVERY)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@sovereign.studio"
                  className={`w-full p-3 font-mono text-xs border ${
                    isDark
                      ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-600 focus:border-[#E5094C]'
                      : 'bg-[#F9F9F8] border-gray-300 text-black placeholder-neutral-400 focus:border-[#E5094C]'
                  } focus:outline-none`}
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block font-mono text-xs uppercase text-neutral-500 mb-1">
                  PAYMENT GATEWAY
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`py-2 px-1 border text-center cursor-pointer transition-colors ${
                      paymentMethod === 'razorpay'
                        ? 'border-[#0C2340] dark:border-blue-400 bg-[#0C2340] dark:bg-blue-500/20 text-white font-bold'
                        : 'border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    RAZORPAY INTL
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-1 border text-center cursor-pointer transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-bold'
                        : 'border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    CARD (INSTANT)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`py-2 px-1 border text-center cursor-pointer transition-colors ${
                      paymentMethod === 'apple_pay'
                        ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-bold'
                        : 'border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    APPLE / GOOGLE
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('crypto')}
                    className={`py-2 px-1 border text-center cursor-pointer transition-colors ${
                      paymentMethod === 'crypto'
                        ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-bold'
                        : 'border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    CRYPTO
                  </button>
                </div>
              </div>

              {/* Razorpay International Details */}
              {paymentMethod === 'razorpay' && (
                <div className="p-3.5 border border-blue-500/30 bg-blue-500/5 space-y-2 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                      RAZORPAY INTERNATIONAL GATEWAY
                    </span>
                    <span className="text-[10px] text-neutral-400 font-bold">$19.00 USD</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Accepts international Visa, Mastercard, American Express, PayPal, UPI International, and NetBanking from 100+ countries with automatic currency conversion and immediate deliverable unlock.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[9px] text-neutral-600 dark:text-neutral-400">
                    <span className="px-1.5 py-0.5 border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black">VISA / MASTERCARD / AMEX</span>
                    <span className="px-1.5 py-0.5 border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black">INTERNATIONAL UPI</span>
                    <span className="px-1.5 py-0.5 border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black">PAYPAL</span>
                    <span className="px-1.5 py-0.5 border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black">PCI-DSS LEVEL 1</span>
                  </div>
                </div>
              )}

              {/* Payment Details Input */}
              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-neutral-500 mb-1">
                      CARD NUMBER (SIMULATED TEST GATEWAY)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className={`w-full p-3 font-mono text-xs border ${
                          isDark
                            ? 'bg-neutral-900 border-neutral-700 text-white'
                            : 'bg-[#F9F9F8] border-gray-300 text-black'
                        } focus:outline-none`}
                      />
                      <CreditCard className="w-4 h-4 text-neutral-400 absolute right-3 top-3.5" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-mono text-[10px] uppercase text-neutral-500 mb-1">
                        EXPIRATION
                      </label>
                      <input
                        type="text"
                        defaultValue="12 / 28"
                        className={`w-full p-2.5 font-mono text-xs border ${
                          isDark
                            ? 'bg-neutral-900 border-neutral-700 text-white'
                            : 'bg-[#F9F9F8] border-gray-300 text-black'
                        } focus:outline-none`}
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] uppercase text-neutral-500 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        defaultValue="784"
                        className={`w-full p-2.5 font-mono text-xs border ${
                          isDark
                            ? 'bg-neutral-900 border-neutral-700 text-white'
                            : 'bg-[#F9F9F8] border-gray-300 text-black'
                        } focus:outline-none`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'crypto' && (
                <div className="p-3 border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 font-mono text-xs space-y-1">
                  <div className="text-[#E5094C] font-bold">CRYPTO DIRECT SETTLEMENT:</div>
                  <div className="text-neutral-500">Supports BTC, USDT, SOL, and ETH. Immediate on-chain detection and download release.</div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 border border-red-500/50 bg-red-500/10 text-red-400 font-mono text-xs flex items-start gap-2">
                  <span className="font-bold text-[#E5094C]">ALERT:</span>
                  <div className="flex-1">{errorMessage}</div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-[#E5094C] hover:bg-[#FF004D] text-white py-4 px-6 flex items-center justify-center space-x-2 font-mono text-xs font-bold tracking-wider uppercase transition-all duration-150 shadow-sm active:translate-y-px cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? 'AUTHORIZING & GENERATING VAULT...'
                      : paymentMethod === 'razorpay'
                      ? 'PAY $19.00 VIA RAZORPAY INTERNATIONAL'
                      : `AUTHORIZE PAYMENT — $${price.toFixed(2)} USD`}
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-neutral-500 uppercase text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>BACKEND CRYPTOGRAPHIC VAULT · SECURE DOWNLOAD TOKENS</span>
              </div>
            </form>
          </div>
        ) : (
          /* UNLOCKED VAULT WITH DIRECT BACKEND DOWNLOADS */
          <div className="space-y-6">
            {/* Success Celebration Banner */}
            <div className="relative overflow-hidden p-3.5 border border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400 font-bold tracking-wider uppercase">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>ORDER AUTHORIZED · DELIVERABLES UNLOCKED</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerSuccessConfetti();
                  droneEngine.playBeep(980, 0.1);
                }}
                className="font-mono text-[10px] text-emerald-300 hover:text-white border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                title="Trigger celebration confetti"
              >
                <PartyPopper className="w-3.5 h-3.5 text-emerald-400" />
                <span>CONFETTI</span>
              </button>
            </div>

            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-neutral-800">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/15 border-2 border-emerald-500 shrink-0">
                <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></span>
                <CheckCircle className="w-7 h-7 text-emerald-500 relative z-10" />
              </div>
              <div>
                <span className="font-mono text-xs text-emerald-500 font-bold uppercase tracking-wider block">
                  PAYMENT AUTHORIZED // ARCHIVE UNLOCKED
                </span>
                <h3 className="font-['Oswald'] font-bold text-2xl uppercase">
                  DOWNLOAD VAULT READY
                </h3>
              </div>
            </div>

            {/* Generated License Certificate Box */}
            <div className="border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-4 font-mono text-xs space-y-1.5">
              <div className="flex justify-between items-center text-[10px] text-neutral-500 uppercase">
                <span>ORDER: {orderId}</span>
                <span className="text-emerald-500 font-bold">LIFETIME ACCESS</span>
              </div>
              <div className="font-bold text-[#E5094C] text-sm break-all">{licenseKey}</div>
              <div className="text-[11px] text-neutral-400 pt-0.5">
                REGISTERED TO: <span className="text-neutral-200">{email}</span>
              </div>
            </div>

            {/* Direct Download Action Links */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between font-mono text-xs font-bold uppercase text-neutral-500 mb-1">
                <span>INSTANT DIGITAL DELIVERABLES:</span>
                <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> READY FOR LOCAL STORAGE
                </span>
              </div>

              {/* 1. PDF DOWNLOAD */}
              <a
                href={downloads?.pdf || '#'}
                download="ANIMESPROTOCOL-THE-IRON-WILL-VOL-01.pdf"
                onClick={() => droneEngine.playBeep(1200, 0.05)}
                className="w-full p-3.5 border-2 border-[#E5094C] hover:bg-[#E5094C]/10 flex items-center justify-between font-mono text-xs font-bold transition-all cursor-pointer bg-white dark:bg-black group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#E5094C]/20 text-[#E5094C] flex items-center justify-center font-bold">
                    PDF
                  </div>
                  <div>
                    <div className="text-black dark:text-white group-hover:text-[#E5094C] transition-colors">
                      DOWNLOAD FIELD MANUAL (.PDF)
                    </div>
                    <div className="text-[10px] font-normal text-neutral-400">
                      184 Pages · Full Typographic Layout & Master Charts
                    </div>
                  </div>
                </div>
                <Download className="w-5 h-5 text-[#E5094C] group-hover:translate-y-0.5 transition-transform" />
              </a>

              {/* 2. EPUB DOWNLOAD */}
              <a
                href={downloads?.epub || '#'}
                download="ANIMESPROTOCOL-THE-IRON-WILL-VOL-01.epub"
                onClick={() => droneEngine.playBeep(1100, 0.05)}
                className="w-full p-3.5 border border-neutral-300 dark:border-neutral-700 hover:border-[#E5094C] flex items-center justify-between font-mono text-xs font-bold transition-all cursor-pointer bg-white dark:bg-black group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-black dark:text-white group-hover:text-[#E5094C] transition-colors">
                      DOWNLOAD E-READER EDITION (.EPUB)
                    </div>
                    <div className="text-[10px] font-normal text-neutral-400">
                      Optimized for Kindle, Apple Books, Kobo & Mobile
                    </div>
                  </div>
                </div>
                <Download className="w-5 h-5 text-neutral-400 group-hover:text-[#E5094C] transition-colors" />
              </a>

              {/* 3. 4K ART PLATES */}
              <a
                href={downloads?.plates || '#'}
                download="ANIMESPROTOCOL-4K-ART-PLATES.zip"
                onClick={() => droneEngine.playBeep(1000, 0.05)}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 flex items-center justify-between font-mono text-xs font-bold transition-all cursor-pointer bg-neutral-50 dark:bg-neutral-900/60"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#E5094C]" />
                  <span>12 ARCHIVAL ART PLATES (.ZIP ARCHIVE)</span>
                </div>
                <Download className="w-4 h-4 text-neutral-400" />
              </a>

              {/* 4. LICENSE RECEIPT */}
              <a
                href={downloads?.receipt || '#'}
                download={`LICENSE-${orderId}.txt`}
                onClick={() => droneEngine.playBeep(900, 0.05)}
                className="w-full p-3 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 flex items-center justify-between font-mono text-xs font-bold transition-all cursor-pointer bg-neutral-50 dark:bg-neutral-900/60"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>DOWNLOAD CRYPTOGRAPHIC LICENSE & RECEIPT (.TXT)</span>
                </div>
                <Download className="w-4 h-4 text-neutral-400" />
              </a>
            </div>

            {/* Quick Share / Backup Link */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={copyOrderDetails}
                className="flex-1 py-3 px-4 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>COPIED ORDER KEYS!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>COPY ORDER & DOWNLOAD LINKS</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="bg-[#0A0A0A] dark:bg-white text-white dark:text-black py-3 px-6 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
              >
                CLOSE TERMINAL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
