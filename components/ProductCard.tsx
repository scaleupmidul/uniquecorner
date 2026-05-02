import React, { useState, memo } from 'react';
import { ArrowRight, AlertCircle, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useAppStore } from '../store';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
    const regularPrice = product.regularPrice || product.price + 200;
    const navigate = useAppStore(state => state.navigate);
    const addToCart = useAppStore(state => state.addToCart);
    const isOutOfStock = product.isOutOfStock ?? false;

    const linkId = product.productId || product.id;

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className={`bg-white rounded-2xl border border-stone-100 overflow-hidden transition-all duration-500 group cursor-pointer h-full flex flex-col shadow-sm hover:shadow-xl ${isOutOfStock ? 'opacity-80 grayscale-[0.3]' : ''}`}
            onClick={() => navigate(`/product/${linkId}`)}
        >
            <div
                className="relative w-full bg-stone-50 flex-shrink-0 overflow-hidden"
                style={{ aspectRatio: '3/4' }}
            >
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'opacity-50' : ''}`}
                    loading={priority ? "eager" : "lazy"}
                    // @ts-ignore
                    fetchPriority={priority ? "high" : "auto"}
                    decoding="async"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col items-start space-y-1.5 z-10">
                    {product.isNewArrival && !isOutOfStock && (
                        <span className="bg-emerald-800 text-white text-[9px] font-bold px-2.5 py-1 rounded-md shadow-md tracking-wider uppercase">NEW</span>
                    )}
                    {product.isTrending && !isOutOfStock && (
                        <span className="bg-[#f9bc2f] text-stone-900 text-[9px] font-bold px-2.5 py-1 rounded-md shadow-md tracking-wider uppercase">BEST</span>
                    )}
                </div>
            </div>

            <div className="p-4 space-y-1.5 flex flex-col flex-1 text-left">
                <h3 className="text-base sm:text-lg font-bold text-stone-900 line-clamp-1" title={product.name}>{product.name}</h3>
                <p className={`text-xs font-semibold tracking-wide ${isOutOfStock ? 'text-stone-400' : 'text-emerald-800'}`}>
                    {product.category === 'Fashion' ? `Fabric: ${product.fabric}` : `Type: ${product.category}`}
                </p>

                <div className="pt-1 flex items-center space-x-2">
                    <span className={`text-lg sm:text-xl font-bold ${isOutOfStock ? 'text-stone-500' : 'text-stone-900'}`}>
                        ৳{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.onSale && (
                        <span className="text-sm text-stone-400 line-through">
                            ৳{regularPrice.toLocaleString('en-IN')}
                        </span>
                    )}
                </div>

                <div className="pt-3 mt-auto">
                    <button 
                        className="w-full bg-emerald-800 text-white py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-900 transition-colors shadow-md"
                    >
                        <span>View Item</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default memo(ProductCard);
