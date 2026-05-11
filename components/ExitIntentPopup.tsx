
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Gift, Timer, Info } from 'lucide-react';
import { useAppStore } from '../store';

const ExitIntentPopup: React.FC = () => {
  const { settings, path, notify } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const isCheckoutPage = path.includes('/checkout') || path.includes('/cart');
    
    if (!settings.exitIntentPopupEnabled || hasShown || !isCheckoutPage) return;

    // Desktop: Mouse leave detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    // Mobile/Universal: Back button detection (popstate)
    // Only push state after a short delay to ensure page is fully loaded and user is engaged
    const timer = setTimeout(() => {
      if (!hasShown && isCheckoutPage) {
        // Only push if we haven't already
        if (window.history.state?.type !== 'exit_intent_trap') {
          window.history.pushState({ type: 'exit_intent_trap' }, '');
        }
      }
    }, 2000);
    
    const handlePopState = (e: PopStateEvent) => {
      // Catch the back button event
      if (!hasShown && isCheckoutPage) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('popstate', handlePopState);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [settings.exitIntentPopupEnabled, hasShown, path]);

  const handleCopy = () => {
    navigator.clipboard.writeText(settings.exitIntentCouponCode);
    setCopied(true);
    notify('Coupon code copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-[340px] sm:max-w-md overflow-hidden bg-white rounded-3xl shadow-2xl mx-auto"
        >
          {/* Header Gradient - Changed to Emerald Theme */}
          <div className="relative h-40 sm:h-48 bg-gradient-to-br from-[#065f46] via-[#059669] to-[#047857] flex flex-col items-center justify-center text-white px-6 text-center">
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="mb-2 sm:mb-4 p-2 sm:p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Gift size={24} className="text-white sm:w-8 sm:h-8" />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold mb-1 leading-tight px-4">Wait! A Special Gift for You.</h2>
            
            {/* Tag overlapping header and body */}
            <div className="absolute -bottom-5 sm:-bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg border-2 border-[#065f46] flex items-center gap-2 whitespace-nowrap">
               <span className="text-[#065f46] font-bold text-lg sm:text-xl">৳{settings.exitIntentDiscount} Flat Discount</span>
            </div>
          </div>

          <div className="px-5 sm:px-6 pt-8 sm:pt-10 pb-6 sm:pb-8 space-y-4 sm:space-y-5">
             <div className="space-y-2 pt-2">
                <p className="text-xs sm:text-sm font-semibold text-gray-600 flex items-center gap-2">
                   <Gift size={16} className="text-[#065f46]" /> Exclusive Coupon Code
                </p>
                <div className="flex items-center gap-2 p-1 border-2 border-dashed border-emerald-100 rounded-xl bg-emerald-50/20">
                   <div className="flex-grow px-3 sm:px-4 py-2 sm:py-3 font-mono text-lg sm:text-xl font-bold tracking-widest text-[#065f46]">
                      {settings.exitIntentCouponCode}
                   </div>
                   <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#10b981] to-[#065f46] text-white px-3 sm:px-5 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-bold hover:opacity-95 active:scale-95 transition-all shadow-md"
                   >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied' : 'Copy'}
                   </button>
                </div>
             </div>

             <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 flex gap-2 sm:gap-3 items-start">
                <Info size={16} className="text-sky-600 mt-0.5 shrink-0" />
                <p className="text-[10px] sm:text-xs text-sky-800 leading-relaxed font-medium">
                   Use this code on the application page to enjoy an instant ৳{settings.exitIntentDiscount} discount on your order.
                </p>
             </div>

             <div className="flex items-center justify-center gap-2 py-2 sm:py-3 px-4 bg-emerald-50/50 rounded-full border border-emerald-100">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Timer size={14} className="text-emerald-500" />
                <p className="text-[10px] sm:text-xs font-semibold text-emerald-800">Limited time offer — use it now!</p>
             </div>

             <button 
              onClick={() => setIsVisible(false)}
              className="w-full py-1 text-xs text-gray-400 hover:text-gray-600 transition-colors text-center"
             >
                No, I want to leave →
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
