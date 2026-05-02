
import React, { useState, useEffect, memo } from 'react';
import { ShoppingCart, Menu, X, ChevronRight, ShoppingBag, Home, Grid, Phone, Sparkles, Cpu, Lamp, Search } from 'lucide-react';
import { useAppStore } from '../store';

import { motion, AnimatePresence } from 'motion/react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { navigate, path, cart } = useAppStore(state => ({
    navigate: state.navigate,
    path: state.path,
    cart: state.cart
  }));
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Check if we are on a product details page
  const isProductPage = path.startsWith('/product/');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMenuOpen]);

  const handleNavClick = (navPath: string) => {
    setIsMenuOpen(false);
    navigate(navPath);
  };
  
  const menuItems = [
      { label: 'Home', path: '/', icon: Home },
      { label: 'Gadgets', path: '/gadgets', icon: Cpu },
      { label: 'Decoration', path: '/decoration', icon: Lamp },
      { label: 'Shop All', path: '/shop', icon: Grid },
      { label: 'Contact Us', path: '/contact', icon: Phone },
  ];

  return (
    <>
      <header 
        className={`
          left-0 w-full z-[100] transition-all duration-500 ease-in-out
          ${isProductPage ? 'relative bg-white py-4' : 'fixed top-0'}
          ${!isProductPage && isScrolled 
            ? 'py-3 bg-white/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] border-b border-white/20' 
            : !isProductPage ? 'py-5 bg-white' : ''}
        `}
      >
        <div className="w-full px-4 lg:px-0 flex justify-between items-center">
          
          {/* Logo Section */}
          <div 
            onClick={() => handleNavClick('/')} 
            className="flex items-center cursor-pointer select-none lg:pl-6"
          >
            <h1 className="unique-corner-logo text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter unique-corner-logo-gradient">
              Unique Corner
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center bg-stone-50/50 backdrop-blur-sm rounded-full px-2 py-1 border border-stone-100">
            {menuItems.map(item => (
                <button 
                    key={item.path}
                    onClick={() => handleNavClick(item.path)} 
                    className={`
                      transition-all font-bold text-[11px] lg:text-[12px] uppercase tracking-[0.2em] relative py-2.5 px-6 lg:px-8 rounded-full
                      ${path === item.path ? 'bg-emerald-800 text-white shadow-lg' : 'text-stone-500 hover:text-emerald-800 hover:bg-white'}
                    `}
                >
                    {item.label}
                </button>
            ))}
          </nav>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-3 sm:space-x-5 lg:pr-6">
            <button 
              onClick={() => handleNavClick('/cart')} 
              className="relative p-2.5 rounded-full text-stone-800 hover:bg-emerald-50 transition-all duration-300 active:scale-90 group"
            >
              <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:-rotate-12" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-emerald-800 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-scaleIn">
                  {cartItemCount}
                </span>
              )}
            </button>
            
            <button 
                onClick={() => setIsMenuOpen(true)} 
                className="md:hidden flex flex-col justify-center items-end space-y-2 w-9 h-9 p-1 group cursor-pointer"
                aria-label="Menu"
            >
                <span className="w-full h-[3px] bg-stone-900 rounded-full transition-all duration-300 group-hover:bg-emerald-800 origin-right"></span>
                <span className="w-[70%] h-[3px] bg-stone-900 rounded-full transition-all duration-300 group-hover:w-full group-hover:bg-emerald-800 origin-right"></span>
                <span className="w-full h-[3px] bg-stone-900 rounded-full transition-all duration-300 group-hover:bg-emerald-800 origin-right"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      <div 
          className={`fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[110] transition-opacity duration-500 md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsMenuOpen(false)}
      />

      <div 
          className={`
            fixed top-0 right-0 h-full w-[85%] max-w-[340px] bg-white z-[120] transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) md:hidden shadow-[-10px_0_40px_rgba(0,0,0,0.1)] flex flex-col
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
      >
          {/* Header of Drawer */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-stone-100">
              <h2 className="unique-corner-logo text-xl font-black tracking-tighter unique-corner-logo-gradient" onClick={() => handleNavClick('/')}>Unique Corner</h2>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="p-2 text-stone-400 hover:text-emerald-800 transition-all rounded-full bg-stone-50 active:scale-90"
              >
                  <X className="w-6 h-6" />
              </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col px-4 py-6 space-y-2 overflow-y-auto">
              {menuItems.map((item, idx) => {
                  const isActive = path === item.path;
                  const Icon = item.icon;
                  return (
                      <button 
                          key={item.path}
                          onClick={() => handleNavClick(item.path)} 
                          className={`
                            group flex items-center justify-between w-full p-4 rounded-2xl transition-all duration-300
                            ${isActive 
                              ? 'bg-emerald-800 text-white shadow-lg translate-x-1' 
                              : 'text-stone-600 hover:bg-stone-50 hover:translate-x-1'}
                          `}
                      >
                          <div className="flex items-center space-x-4">
                              <div className={`p-2.5 rounded-xl transition-colors ${isActive ? 'bg-white/20' : 'bg-stone-100'}`}>
                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-stone-500 group-hover:text-emerald-800'}`} />
                              </div>
                              <span className="font-bold text-[11px] uppercase tracking-widest">{item.label}</span>
                          </div>
                          <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-white/60 rotate-90' : 'text-stone-300'}`} />
                      </button>
                  )
              })}
          </nav>

          {/* Bottom Action Area */}
          <div className="p-6 border-t border-stone-100 bg-white">
               <button 
                  onClick={() => handleNavClick('/shop')}
                  className="w-full bg-stone-900 text-white font-black py-4 rounded-2xl hover:bg-emerald-800 transition-all active:scale-95 shadow-xl flex items-center justify-center space-x-3 text-[10px] uppercase tracking-[0.2em]"
               >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explore Collection</span>
               </button>
               <p className="text-center text-[10px] text-stone-300 font-bold uppercase tracking-widest mt-6">
                 Unique Corner Luxury © 2026
               </p>
          </div>
      </div>
    </>
  );
};

export default memo(Header);
