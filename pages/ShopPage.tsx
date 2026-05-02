
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import { Search, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { useAppStore } from '../store';
import { Product } from '../types';
import { trackServerEvent } from '../services/trackingService';

const PRODUCTS_PER_PAGE = 12;

// Robust, full-width skeleton to match the real card dimensions precisely
const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-lg w-full h-full flex flex-col">
    <div className="aspect-[3/4] bg-stone-200 w-full animate-pulse" />
    <div className="p-3 sm:p-4 space-y-1.5 flex flex-col flex-1">
      {/* Title Bar */}
      <div className="h-5 sm:h-7 bg-stone-200 rounded w-full animate-pulse" />
      {/* Fabric Bar */}
      <div className="h-4 bg-stone-200 rounded w-2/3 animate-pulse" />
      
      <div className="pt-2 flex flex-col items-start w-full mt-auto">
        {/* Price Container */}
        <div className="flex items-center space-x-2 mb-3 w-full">
           <div className="h-6 sm:h-8 bg-stone-200 rounded w-1/3 animate-pulse" />
        </div>
        
        {/* Button Bar */}
        <div className="w-full bg-stone-200 rounded-full h-[33px] sm:h-10 animate-pulse" />
      </div>
    </div>
  </div>
);

const ShopPage: React.FC = () => {
    const { products, isInitialLoading, ensureAllProductsLoaded, fullProductsLoaded } = useAppStore(state => ({
        products: state.products,
        isInitialLoading: state.loading,
        ensureAllProductsLoaded: state.ensureAllProductsLoaded,
        fullProductsLoaded: state.fullProductsLoaded
    }));
    
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [shuffledProducts, setShuffledProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (!fullProductsLoaded) {
            ensureAllProductsLoaded();
        }
    }, [ensureAllProductsLoaded, fullProductsLoaded]);

    useEffect(() => {
        if (products.length > 0) {
            const arr = [...products];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            setShuffledProducts(arr);
        }
    }, [products.length]);
  
  const uniqueCategories = useMemo(() => {
    const categories = products.map(p => p.category);
    return categories.filter((value, index, self) => self.indexOf(value) === index);
  }, [products]);

  const [category, setCategory] = useState('All');
  const [color, setColor] = useState('All');

  // Track Category View
  useEffect(() => {
    if (category !== 'All') {
      trackServerEvent('ViewCategory', {
        content_name: category,
        content_category: category,
      }, {});
    }
  }, [category]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceLimit, setPriceLimit] = useState(10000);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [debouncedPriceLimit, setDebouncedPriceLimit] = useState(10000);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setDebouncedPriceLimit(priceLimit);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, priceLimit]);
  
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFilterOpen]);

  const filteredProducts = useMemo(() => {
    const baseList = shuffledProducts.length > 0 ? shuffledProducts : products;
    return baseList.filter(p => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesPrice = p.price <= debouncedPriceLimit;
      const matchesSearch = p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesColor = color === 'All' || p.colors.map(c => c.toLowerCase()).includes(color.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch && matchesColor;
    });
  }, [shuffledProducts, products, category, debouncedPriceLimit, debouncedSearchTerm, color]);
  
  useEffect(() => {
      setCurrentPage(1);
  }, [category, debouncedPriceLimit, debouncedSearchTerm, color]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = useMemo(() => {
      const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
      return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [currentPage, filteredProducts]);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 border border-stone-300 rounded-full focus:ring-emerald-800 focus:border-emerald-800 transition text-sm bg-white text-black"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
      </div>

      <div className="space-y-3 p-4 bg-white rounded-lg border border-stone-200">
        <h3 className="font-semibold text-stone-900 text-sm sm:text-base">Max Price (৳)</h3>
        <input
          type="range"
          min="500"
          max="10000"
          step="100"
          value={priceLimit}
          onChange={(e) => setPriceLimit(Number(e.target.value))}
          className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-800"
        />
        <p className="text-xs text-stone-500 text-right">Up to: ৳{priceLimit.toLocaleString()}</p>
      </div>

      <div className="space-y-3 p-4 bg-white rounded-lg border border-stone-200">
        <h3 className="font-semibold text-stone-900 text-sm sm:text-base">Category</h3>
        <div className="relative">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 pr-10 border border-stone-300 rounded-lg text-sm focus:ring-emerald-800 focus:border-emerald-800 bg-white appearance-none text-black">
            <option value="All">All Categories</option>
            {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-3 p-4 bg-white rounded-lg border border-stone-200">
        <h3 className="font-semibold text-stone-900 text-sm sm:text-base">Color</h3>
        <div className="flex flex-wrap gap-2">
          {['All', 'Green', 'Silver', 'Black', 'White', 'Gold'].map(c => (
            <button key={c} onClick={() => setColor(c)} className={`px-3 py-1 text-xs font-medium rounded-full transition duration-300 border ${color === c ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white text-stone-700 border-stone-300 hover:bg-emerald-50 hover:border-emerald-800'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const showSkeletons = (isInitialLoading || shuffledProducts.length === 0) && products.length === 0;

  return (
    <main className="max-w-screen-2xl mx-auto w-full px-2 sm:px-6 lg:px-8 pt-6 lg:pt-12 pb-24">
      <div className="text-center mb-6 lg:mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 tracking-tight">Unique Corner Collections</h2>
      </div>

      <div className="lg:hidden flex justify-end mb-6">
           <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center space-x-2 text-stone-900 font-bold text-xs uppercase tracking-wider bg-white px-5 py-2.5 rounded-full border border-stone-200 shadow-sm active:scale-95 transition hover:bg-stone-50"
            >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter</span>
            </button>
      </div>

      <div className="lg:grid lg:grid-cols-4 lg:gap-10">
        <aside className="hidden lg:block lg:col-span-1">
          <FilterPanel />
        </aside>
        
        <div 
          className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 lg:hidden ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsFilterOpen(false)}
        ></div>
        <div 
          className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex justify-between items-center p-5 border-b border-stone-100 bg-stone-50/50">
            <h3 className="text-lg font-bold text-stone-900">Filter Products</h3>
            <button onClick={() => setIsFilterOpen(false)} className="p-2 rounded-full hover:bg-stone-200 text-stone-500 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-5 overflow-y-auto h-[calc(100vh-80px)] pb-24">
            <FilterPanel />
          </div>
          <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-stone-100">
              <button 
                onClick={() => setIsFilterOpen(false)} 
                className="w-full bg-stone-900 text-white text-sm font-bold uppercase tracking-wider py-3.5 rounded-xl hover:bg-stone-800 transition duration-300 shadow-lg active:scale-95"
              >
                View {filteredProducts.length} Products
              </button>
            </div>
        </div>

        <section className="lg:col-span-3">
          {showSkeletons ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
              {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center p-10 bg-white rounded-xl border border-stone-200">
              <p className="text-base sm:text-lg text-stone-600">No products match your current filters. Try adjusting your selections.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-6">
                {currentProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-12 mb-8 sm:mt-16 sm:mb-12">
                      <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="border border-emerald-800 text-emerald-800 font-medium px-6 py-2 rounded-full hover:bg-emerald-800 hover:text-white transition duration-300 active:scale-95 text-sm disabled:bg-transparent disabled:text-emerald-300 disabled:border-emerald-300 disabled:cursor-not-allowed"
                      >
                          Previous
                      </button>
                      <span className="text-sm font-medium text-stone-700">
                          Page {currentPage} of {totalPages}
                      </span>
                      <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="border border-emerald-800 text-emerald-800 font-medium px-6 py-2 rounded-full hover:bg-emerald-800 hover:text-white transition duration-300 active:scale-95 text-sm disabled:bg-transparent disabled:text-emerald-300 disabled:border-emerald-300 disabled:cursor-not-allowed"
                      >
                          Next
                      </button>
                  </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default ShopPage;
