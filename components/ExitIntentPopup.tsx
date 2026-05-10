
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
    // Only target specific pages if needed, or site-wide
    // The requirement says "Checkout page but changed decision"
    // We can show it on checkout page exit specifically
    const isCheckoutPage = path === '/checkout' || path === '/cart';
    
    if (!settings.exitIntentPopupEnabled || hasShown || !isCheckoutPage) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md overflow-hidden bg-white rounded-3xl shadow-2xl"
        >
          {/* Header Gradient */}
          <div className="relative h-48 bg-gradient-to-br from-[#ff4d4d] via-[#f91d5a] to-[#db0a5b] flex flex-col items-center justify-center text-white px-6 text-center">
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="mb-4 p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Gift size={32} className="text-white" />
            </div>
            
            <h2 className="text-2xl font-bold mb-1 leading-tight">যাওয়ার আগে একটু দেখুন!</h2>
            <p className="text-sm opacity-90">এই অফার শুরু এখন পাবেন — পরে আর নাও পেতে পারেন</p>
            
            {/* Tag overlapping header and body */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-full shadow-lg border-2 border-[#f91d5a] flex items-center gap-2">
               <span className="text-[#f91d5a] font-bold text-xl">৳{settings.exitIntentDiscount} ছাড়</span>
            </div>
          </div>

          <div className="px-6 pt-10 pb-8 space-y-5">
             <div className="space-y-2 pt-2">
                <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                   <Gift size={16} className="text-[#f91d5a]" /> কুপন কোড
                </p>
                <div className="flex items-center gap-2 p-1 border-2 border-dashed border-orange-200 rounded-xl bg-orange-50/30">
                   <div className="flex-grow px-4 py-3 font-mono text-xl font-bold tracking-widest text-[#f91d5a]">
                      {settings.exitIntentCouponCode}
                   </div>
                   <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-[#f91d5a] text-white px-5 py-3 rounded-lg font-medium hover:opacity-90 active:scale-95 transition-all shadow-md"
                   >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                      {copied ? 'কপি হয়েছে' : 'কপি করুন'}
                   </button>
                </div>
             </div>

             <div className="p-3 rounded-xl bg-teal-50 border border-teal-100 flex gap-3 items-start">
                <Info size={18} className="text-teal-600 mt-0.5 shrink-0" />
                <p className="text-xs text-teal-800 leading-relaxed">
                   এই কুপন কোডটি বসান — {settings.exitIntentDiscount} টাকা ডিসকাউন্ট পেয়ে যাবেন
                </p>
             </div>

             <div className="flex items-center justify-center gap-2 py-3 px-4 bg-red-50/50 rounded-full border border-red-100">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <Timer size={16} className="text-red-500" />
                <p className="text-xs font-semibold text-red-600">সীমিত সময়ের অফার — এখনই ব্যবহার করুন!</p>
             </div>

             <button 
              onClick={() => setIsVisible(false)}
              className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors text-center"
             >
                না, আমি চলে যেতে চাই →
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExitIntentPopup;
