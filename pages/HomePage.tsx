
import React from 'react';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import { useAppStore } from '../store';
import { Product } from '../types';
import { ShieldCheck, Truck, Sparkles, ArrowRight, CreditCard, Zap, Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';

const SectionTitle: React.FC<{ title: string; subtitle?: string; align?: 'center' | 'left' }> = ({ title, subtitle, align = 'center' }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={`flex flex-col ${align === 'center' ? 'items-center text-center' : 'items-start text-left'} mb-10 sm:mb-16`}
  >
    <p className="text-emerald-800 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-3">{subtitle}</p>
    <h2 className="text-3xl sm:text-6xl font-extrabold text-stone-900 tracking-tight leading-none font-serif">
        {title}
    </h2>
  </motion.div>
);

const TrustFactor: React.FC<{ icon: React.ElementType; title: string; desc: string; className?: string }> = ({ icon: Icon, title, desc, className = "" }) => (
    <div className={`flex flex-col items-center text-center p-3 sm:p-6 group ${className}`}>
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white shadow-lg sm:shadow-xl flex items-center justify-center text-emerald-800 mb-4 sm:mb-5 group-hover:scale-110 transition-transform duration-500 border border-stone-50">
            <Icon className="w-5 h-5 sm:w-7 sm:h-7" strokeWidth={1.5} />
        </div>
        <h4 className="font-bold text-stone-900 text-[10px] sm:text-sm uppercase tracking-widest mb-1 leading-tight">{title}</h4>
        <p className="text-stone-500 text-xs leading-relaxed hidden sm:block">{desc}</p>
    </div>
);

const BannerSkeleton = () => (
    <div className="relative aspect-[4/5] sm:aspect-[16/10] rounded-[1.7rem] sm:rounded-[2rem] mx-6 sm:mx-0 overflow-hidden bg-stone-100 animate-shimmer shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-100 via-stone-50 to-stone-100" style={{ backgroundSize: '200% 100%' }}></div>
    </div>
);

const HomePage: React.FC = () => {
  const { products, navigate, settings, loading } = useAppStore(state => ({
    products: state.products,
    navigate: state.navigate,
    settings: state.settings,
    loading: state.loading
  }));
  const { homepageNewArrivalsCount, homepageTrendingCount } = settings;

  const getSortedProducts = (items: Product[], key: 'newArrivalDisplayOrder' | 'trendingDisplayOrder') => {
      const pinned = items.filter(p => p[key] && p[key]! < 1000).sort((a, b) => (a[key] || 0) - (b[key] || 0));
      const others = items.filter(p => !p[key] || p[key]! >= 1000).sort((a, b) => b.id.localeCompare(a.id));
      return [...pinned, ...others];
  };

  const allNewArrivals = getSortedProducts(products.filter(p => p.isNewArrival), 'newArrivalDisplayOrder');
  const allTrendingProducts = getSortedProducts(products.filter(p => p.isTrending), 'trendingDisplayOrder');
  
  const newArrivalsDisplay = allNewArrivals.slice(0, homepageNewArrivalsCount || 4);
  const trendingProductsDisplay = allTrendingProducts.slice(0, homepageTrendingCount || 4);

  const isGadgetBannerReady = settings.signatureFashionDesktopImage && settings.signatureFashionDesktopImage !== '';
  const isDecorBannerReady = settings.signatureCosmeticsDesktopImage && settings.signatureCosmeticsDesktopImage !== '';

  return (
    <div className="overflow-x-hidden bg-[#fbfbf9] relative">
      {/* Floating Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute top-[40%] right-[5%] w-96 h-96 bg-stone-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-[10%] left-[10%] w-72 h-72 bg-emerald-50/30 rounded-full blur-3xl opacity-50"></div>
      </div>

      <HeroSlider />

      {/* --- SECTION 1: TRUST BAR --- */}
      <section className="relative z-10 -mt-8 sm:-mt-12 mb-16 px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl border border-stone-100 p-6 sm:p-10">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-4">
                  <TrustFactor 
                    icon={ShieldCheck} 
                    title="Premium Quality" 
                    desc="Premium innovative gadgets & artistic home decor." 
                  />
                  <TrustFactor 
                    icon={Truck} 
                    title="Express Delivery" 
                    desc="Swift delivery across Bangladesh." 
                  />
                  <TrustFactor 
                    icon={CreditCard} 
                    title="Secure Payment" 
                    desc="Safe and encrypted payment options." 
                  />
                  <TrustFactor 
                    icon={Sparkles} 
                    title="Unique Items" 
                    desc="Limited edition products for you." 
                  />
              </div>
          </div>
      </section>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- SECTION 3: TRENDING (STAGGERED) --- */}
        <section className="mb-24 sm:mb-40">
          <SectionTitle title="Trending Now" subtitle="Most Loved Pieces" align="center" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {trendingProductsDisplay.map((p, i) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                >
                    <ProductCard product={p} />
                </motion.div>
            ))}
          </div>
        </section>

        {/* --- SECTION 4: WHY CHOOSE US (UNIQUE DESIGN) --- */}
        <section className="mb-24 sm:mb-40 bg-emerald-950 rounded-[2.5rem] sm:rounded-[3rem] px-6 py-16 sm:p-24 text-white relative overflow-hidden shadow-2xl mx-2 sm:mx-0">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full -mr-64 -mt-64 blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-400/5 rounded-full -ml-32 -mb-32 blur-[100px]"></div>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-left"
                >
                    <span className="text-emerald-400 font-bold uppercase tracking-[0.5em] text-[9px] sm:text-xs mb-4 sm:mb-6 block">The Unique Edge</span>
                    <h2 className="text-3xl sm:text-7xl font-black mb-6 sm:mb-8 leading-[1.1] font-serif">
                        Why <span className="text-emerald-400">Unique</span><br className="hidden sm:block"/>Corner?
                    </h2>
                    <p className="text-emerald-100/70 text-sm sm:text-xl mb-8 sm:mb-12 leading-relaxed max-w-md font-light">
                        We don't just sell products; we curate experiences. Every item in our collection is handpicked for its innovation, design, and ability to spark joy in your daily life.
                    </p>
                    <div className="flex justify-start">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/shop')} 
                            className="group bg-white text-emerald-950 font-bold px-6 sm:px-12 py-3.5 sm:py-5 rounded-full hover:bg-emerald-50 transition-all shadow-2xl flex items-center gap-3 text-xs sm:text-base"
                        >
                            <span>Start Your Journey</span>
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform" />
                        </motion.button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {[
                        { icon: Zap, title: "Innovation First", desc: "Cutting-edge gadgets that simplify and enhance your daily routine." },
                        { icon: Heart, title: "Artistic Decor", desc: "Home decor that tells a story and reflects your unique personality." },
                        { icon: Star, title: "Handpicked Only", desc: "We filter through thousands of items to bring you only the absolute best." },
                        { icon: ShieldCheck, title: "Trusted Quality", desc: "Rigorous quality checks ensure every piece meets our high standards." }
                    ].map((feature, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                            whileHover={{ y: -5, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                            className="bg-white/10 backdrop-blur-xl p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 transition-colors group flex flex-row sm:flex-col items-center sm:items-start gap-5 sm:gap-0"
                        >
                            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center sm:mb-6 group-hover:bg-emerald-400 group-hover:text-emerald-950 transition-colors">
                                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400 group-hover:text-emerald-950 transition-colors" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-base sm:text-xl font-bold mb-1 sm:mb-3 tracking-tight">{feature.title}</h4>
                                <p className="text-emerald-100/60 text-[11px] sm:text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* --- SECTION 5: NEW ARRIVALS --- */}
        <section className="mb-24 sm:mb-40">
          <SectionTitle title="New Arrivals" align="center" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {newArrivalsDisplay.map((p, index) => (
                 <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                >
                    <ProductCard product={p} priority={index < 2} />
                </motion.div>
            ))}
          </div>
          {!loading && allNewArrivals.length > 4 && (
            <div className="mt-16 flex justify-center">
              <button
                onClick={() => navigate('/shop')}
                className="group px-12 py-4 bg-stone-900 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-emerald-800 transition-all duration-500 shadow-2xl hover:shadow-emerald-200"
              >
                Explore Full Gallery
              </button>
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default HomePage;
