
// pages/admin/AdminProductsPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Product, AppSettings } from '../../types';
import { Plus, Edit, Trash2, Search, LoaderCircle, X, Info, ChevronDown, Tag, PlusCircle, AlertCircle, Move } from 'lucide-react';
import { useAppStore } from '../../store';
import TableSkeleton from '../../components/admin/TableSkeleton';

const compressImage = (file: File, options: { maxWidth: number; quality: number }): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(img.src);
            const { maxWidth, quality } = options;
            let { width, height } = img;
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
            } else {
                const maxHeight = maxWidth;
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height);
                    height = maxHeight;
                }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('Failed to get canvas context');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality));
        };
        img.onerror = (error) => reject(error);
    });
};

interface ImageInputProps {
    currentImage: string;
    onImageChange: (value: string) => void;
    options: { maxWidth: number; quality: number };
}

const ImageInput: React.FC<ImageInputProps> = ({ currentImage, onImageChange, options }) => {
    const { notify } = useAppStore();
    const [inputType, setInputType] = useState<'upload' | 'url'>('upload');
    const [isProcessing, setIsProcessing] = useState(false);
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 15 * 1024 * 1024) {
             notify('File is too large.', 'error');
             return;
        }
        setIsProcessing(true);
        try {
            const compressedDataUrl = await compressImage(file, options);
            onImageChange(compressedDataUrl);
        } catch (error) {
            notify('Failed to process image.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };
    return (
        <div className="flex-grow">
            <div className="flex items-center mb-2">
                <button type="button" onClick={() => setInputType('upload')} className={`px-3 py-1 text-xs rounded-l-md ${inputType === 'upload' ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-700'}`}>Upload</button>
                <button type="button" onClick={() => setInputType('url')} className={`px-3 py-1 text-xs rounded-r-md ${inputType === 'url' ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-700'}`}>URL</button>
            </div>
            {inputType === 'upload' ? (
                <div className="flex items-center gap-2">
                    <input type="file" onChange={handleFileSelect} accept="image/*" className="text-xs w-full text-black" />
                    {isProcessing && <LoaderCircle className="w-4 h-4 animate-spin text-emerald-800" />}
                </div>
            ) : (
                <input type="text" value={currentImage.startsWith('data:') ? '' : currentImage} onChange={(e) => onImageChange(e.target.value)} placeholder="https://..." className="w-full p-2 border rounded text-sm bg-white text-black" />
            )}
        </div>
    );
};

const ProductFormModal: React.FC<{ product?: Product | null, onSave: (p: any) => Promise<void>, onClose: () => void }> = ({ product, onSave, onClose }) => {
    const { settings, updateSettings } = useAppStore();
    const [formData, setFormData] = useState({
        name: product?.name || '',
        category: product?.category || 'Cosmetics',
        price: product?.price || 0,
        regularPrice: product?.regularPrice || 0,
        description: product?.description || '',
        fabric: product?.fabric || '',
        colors: product?.colors.join(', ') || '',
        sizes: product?.sizes || [],
        image1: product?.images?.[0] || '',
        image2: product?.images?.[1] || '',
        image3: product?.images?.[2] || '',
        isNewArrival: product?.isNewArrival ?? false,
        newArrivalDisplayOrder: (product?.newArrivalDisplayOrder === undefined || product.newArrivalDisplayOrder >= 1000) ? '' : String(product.newArrivalDisplayOrder),
        isTrending: product?.isTrending ?? false,
        trendingDisplayOrder: (product?.trendingDisplayOrder === undefined || product.trendingDisplayOrder >= 1000) ? '' : String(product.trendingDisplayOrder),
        onSale: product?.onSale ?? false,
        isOutOfStock: product?.isOutOfStock ?? false,
    });
    
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [customCategoryName, setCustomCategoryName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [newSize, setNewSize] = useState('');

    const COSMETICS_SUB_CATEGORIES = ["Smart Home", "Personal Tech", "Accessories", "Wearables"];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (name === 'category') {
            if (value === 'ADD_NEW') {
                setIsCustomCategory(true);
            } else {
                setIsCustomCategory(false);
                setFormData(prev => ({ ...prev, [name]: value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const isCosmetics = !isCustomCategory && formData.category === 'Cosmetics';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const finalCategory = isCustomCategory ? customCategoryName.trim() : formData.category;

        if (isCustomCategory && finalCategory && !settings.categories.includes(finalCategory)) {
            try {
                await updateSettings({
                    categories: [...settings.categories, finalCategory]
                });
            } catch (err) {
                console.error("Failed to auto-add new category to settings", err);
            }
        }

        const finalData = {
            ...formData,
            category: finalCategory,
            price: Number(formData.price),
            regularPrice: formData.onSale ? Number(formData.regularPrice) : undefined,
            colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean),
            images: [formData.image1, formData.image2, formData.image3].filter(Boolean),
            newArrivalDisplayOrder: formData.newArrivalDisplayOrder === '' ? 1000 : Number(formData.newArrivalDisplayOrder),
            trendingDisplayOrder: formData.trendingDisplayOrder === '' ? 1000 : Number(formData.trendingDisplayOrder),
        };
        await onSave(product ? { ...finalData, id: product.id } : finalData);
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b flex justify-between items-center bg-emerald-50/30">
                    <h2 className="text-2xl font-black text-emerald-950 tracking-tighter font-serif">{product ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition"><X className="w-6 h-6 text-emerald-950" /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                    <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex gap-4 items-start shadow-sm">
                        <Info className="w-6 h-6 text-emerald-700 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-emerald-900 leading-relaxed">
                            <p className="font-black mb-1 uppercase tracking-widest">Inventory Intelligence Tip:</p>
                            <ul className="list-disc pl-4 space-y-1 font-medium">
                                <li>Use <b>Sub-Category</b> to define specific types like "Smartwatch", "Vase", or "Headphones".</li>
                                <li>For <b>Sizes</b>, use dimensions (e.g., "12x12 inch") or technical specs (e.g., "128GB").</li>
                                <li>High-quality <b>Portrait (3:4)</b> images work best for the premium aesthetic.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Product Designation</label>
                            <input name="name" value={formData.name} onChange={handleChange} className="w-full p-4 border border-stone-100 rounded-2xl bg-stone-50/30 text-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold" placeholder="e.g. Minimalist Ceramic Vase" required/>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Primary Collection</label>
                                <div className="relative">
                                    <select 
                                        name="category" 
                                        value={isCustomCategory ? 'ADD_NEW' : formData.category} 
                                        onChange={handleChange} 
                                        className="w-full p-4 border border-stone-100 rounded-2xl bg-stone-50/30 text-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none appearance-none transition-all font-bold"
                                    >
                                        {settings.categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                        <option value="ADD_NEW" className="font-black text-emerald-700">+ Define New Collection...</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                                </div>
                            </div>
                            
                            {isCustomCategory && (
                                <div className="animate-fadeIn">
                                    <label className="block text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                                        <PlusCircle className="w-3.5 h-3.5" /> New Collection Name
                                    </label>
                                    <input 
                                        value={customCategoryName} 
                                        onChange={e => setCustomCategoryName(e.target.value)} 
                                        className="w-full p-4 border-2 border-emerald-100 rounded-2xl bg-emerald-50/30 text-emerald-950 focus:border-emerald-500 outline-none font-bold" 
                                        placeholder="e.g. Smart Living"
                                        required={isCustomCategory}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setIsCustomCategory(false)} 
                                        className="text-[10px] font-black text-stone-400 mt-2 hover:text-emerald-700 transition uppercase tracking-widest ml-1"
                                    >
                                        ← Back to selection
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Sub-Category / Material</label>
                            <input name="fabric" value={formData.fabric} onChange={handleChange} className="w-full p-4 border border-stone-100 rounded-2xl bg-stone-50/30 text-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold" placeholder="e.g. Matte Ceramic / Bluetooth 5.3" />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Market Price (৳)</label>
                            <input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full p-4 border border-stone-100 rounded-2xl bg-stone-50/30 text-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold" required/>
                        </div>

                        {formData.onSale && (
                            <div>
                                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Original Price (৳)</label>
                                <input name="regularPrice" type="number" value={formData.regularPrice} onChange={handleChange} className="w-full p-4 border border-stone-100 rounded-2xl bg-stone-50/30 text-stone-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold" />
                            </div>
                        )}

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Variants (Sizes / Specs)</label>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {formData.sizes.map((s, i) => (
                                    <span key={i} className="bg-emerald-50 text-emerald-800 px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2 border border-emerald-100 shadow-sm">
                                        {s} <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500 transition-colors" onClick={() => setFormData(p => ({...p, sizes: p.sizes.filter((_, idx) => idx !== i)}))} />
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <input value={newSize} onChange={e => setNewSize(e.target.value)} className="flex-1 p-4 border border-stone-100 rounded-2xl text-sm bg-stone-50/30 text-stone-900 font-bold outline-none focus:border-emerald-500" placeholder="e.g. 500ml or Large" />
                                <button type="button" onClick={() => { if(newSize) { setFormData(p => ({...p, sizes: [...p.sizes, newSize]})); setNewSize(''); } }} className="bg-emerald-800 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/20 hover:bg-emerald-900 transition-all active:scale-95">Add</button>
                            </div>
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2 ml-1">Product Narrative</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-4 border border-stone-100 rounded-2xl bg-stone-50/30 text-stone-900 h-32 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium" placeholder="Describe the unique features..." />
                        </div>

                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {['image1', 'image2', 'image3'].map((imgKey, i) => (
                                <div key={imgKey} className="p-4 border border-stone-100 rounded-2xl bg-stone-50/30">
                                    <label className="block text-[9px] font-black text-stone-400 uppercase tracking-widest mb-3 ml-1">Visual Asset {i+1}</label>
                                    <div className="flex flex-col gap-4">
                                        {(formData as any)[imgKey] && <img src={(formData as any)[imgKey]} className="w-full aspect-[3/4] object-cover rounded-xl shadow-md border border-white" />}
                                        <ImageInput currentImage={(formData as any)[imgKey]} onImageChange={(val) => setFormData(p => ({...p, [imgKey]: val}))} options={{maxWidth: 1000, quality: 0.8}} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* --- DISPLAY ORDERING CONTROLS --- */}
                        <div className="md:col-span-2 space-y-6 pt-6 border-t border-stone-100">
                            <div className="grid grid-cols-1 gap-4 p-6 bg-stone-50/50 rounded-3xl border border-stone-100">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} className="w-6 h-6 text-emerald-800 rounded-lg border-stone-200 focus:ring-emerald-500" />
                                        <span className="font-black text-sm text-stone-700 uppercase tracking-tight">New Arrival Spotlight</span>
                                    </div>
                                    {formData.isNewArrival && (
                                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-emerald-100 shadow-sm animate-fadeIn">
                                            <Move className="w-4 h-4 text-emerald-600" />
                                            <input 
                                                type="number" 
                                                name="newArrivalDisplayOrder" 
                                                value={formData.newArrivalDisplayOrder} 
                                                onChange={handleChange} 
                                                placeholder="Order" 
                                                className="w-20 p-1 border-none text-center text-sm font-black text-emerald-800 bg-transparent outline-none"
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="border-t border-stone-100 my-2"></div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} className="w-6 h-6 text-emerald-800 rounded-lg border-stone-200 focus:ring-emerald-500" />
                                        <span className="font-black text-sm text-stone-700 uppercase tracking-tight">Trending Bestseller</span>
                                    </div>
                                    {formData.isTrending && (
                                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-emerald-100 shadow-sm animate-fadeIn">
                                            <Move className="w-4 h-4 text-emerald-600" />
                                            <input 
                                                type="number" 
                                                name="trendingDisplayOrder" 
                                                value={formData.trendingDisplayOrder} 
                                                onChange={handleChange} 
                                                placeholder="Order" 
                                                className="w-20 p-1 border-none text-center text-sm font-black text-emerald-800 bg-transparent outline-none"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between p-6 bg-stone-50/50 rounded-3xl gap-6 border border-stone-100">
                                <div className="flex items-center gap-4">
                                    <input type="checkbox" name="onSale" checked={formData.onSale} onChange={handleChange} className="w-6 h-6 text-emerald-800 rounded-lg border-stone-200 focus:ring-emerald-500" />
                                    <span className="font-black text-sm text-stone-700 uppercase tracking-tight">Active Promotion</span>
                                </div>
                                <div className="flex items-center gap-4 border-l-2 border-red-100 pl-6">
                                    <input type="checkbox" name="isOutOfStock" checked={formData.isOutOfStock} onChange={handleChange} className="w-6 h-6 text-red-600 rounded-lg border-stone-200 focus:ring-red-500" />
                                    <span className="font-black text-sm text-red-700 uppercase tracking-tight">Stock Depleted</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="p-8 bg-stone-50/50 border-t border-stone-100 flex justify-end gap-4">
                    <button onClick={onClose} className="px-8 py-3 font-black text-[10px] uppercase tracking-widest text-stone-400 hover:text-stone-900 transition">Discard</button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={isSaving}
                        className="bg-emerald-800 text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/20 hover:bg-emerald-900 transition-all flex items-center gap-2 active:scale-95"
                    >
                        {isSaving ? <LoaderCircle className="w-5 h-5 animate-spin" /> : 'Commit Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminProductsPage: React.FC = () => {
    const { adminProducts, adminProductsPagination, loadAdminProducts, addProduct, updateProduct, deleteProduct } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            await loadAdminProducts(currentPage, debouncedSearchTerm);
            setIsLoading(false);
        };
        fetchProducts();
    }, [currentPage, debouncedSearchTerm, loadAdminProducts]);

    const handleSave = async (productData: any) => {
        if (editingProduct) {
            await updateProduct({ ...productData, id: editingProduct.id });
        } else {
            await addProduct(productData);
        }
        setIsModalOpen(false);
        setEditingProduct(null);
        loadAdminProducts(currentPage, debouncedSearchTerm);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Delete this product permanently?')) {
            await deleteProduct(id);
            loadAdminProducts(currentPage, debouncedSearchTerm);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-stone-900 tracking-tighter uppercase font-serif">Product <span className="text-emerald-800">Inventory</span></h1>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.4em] mt-2">Manage your premium collection</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 border border-stone-100 rounded-2xl text-sm bg-white text-stone-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" placeholder="Search products..." />
                    </div>
                    <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="bg-emerald-800 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-emerald-900/20 hover:bg-emerald-900 transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest whitespace-nowrap active:scale-95">
                        <Plus className="w-5 h-5" />
                        <span>Add Product</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.02)] border border-stone-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-stone-50/50 border-b border-stone-100">
                        <tr>
                            <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Product Asset</th>
                            <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Collection Data</th>
                            <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Market Value</th>
                            <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Live Status</th>
                            <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] text-right">Actions</th>
                        </tr>
                    </thead>
                    {isLoading ? <TableSkeleton rows={8} cols={5} /> : (
                        <tbody className="divide-y divide-stone-50">
                            {adminProducts.map(p => (
                                <tr key={p.id} className={`hover:bg-emerald-50/30 transition-colors group ${p.isOutOfStock ? 'bg-red-50/10' : ''}`}>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-20 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0 border border-stone-200 relative shadow-sm">
                                                <img src={p.images[0]} className={`w-full h-full object-cover ${p.isOutOfStock ? 'grayscale opacity-50' : ''}`} />
                                                {p.isOutOfStock && <div className="absolute inset-0 flex items-center justify-center bg-red-600/60"><AlertCircle className="w-6 h-6 text-white" /></div>}
                                            </div>
                                            <div>
                                                <div className="font-black text-stone-900 text-sm uppercase tracking-tight line-clamp-1">{p.name}</div>
                                                <div className="text-[10px] text-stone-400 font-mono mt-1">ID: {p.productId || p.id.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col items-start gap-2">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${p.category === 'Decor Rituals' || p.category === 'Cosmetics' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-stone-100 text-stone-600 border-stone-200'}`}>
                                                {p.category}
                                            </span>
                                            {p.fabric && (
                                                <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-bold bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-100">
                                                    <Tag className="w-3 h-3" />
                                                    {p.fabric}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-black text-stone-900 text-base tracking-tighter font-serif">৳{p.price.toLocaleString()}</div>
                                        {p.onSale && <div className="text-[10px] text-stone-400 line-through mt-1">৳{p.regularPrice?.toLocaleString()}</div>}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-wrap gap-2">
                                            {p.isOutOfStock ? (
                                                <span className="px-3 py-1 bg-red-600 text-white text-[9px] font-black rounded-lg uppercase tracking-widest shadow-sm shadow-red-900/20">Depleted</span>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    {p.isNewArrival && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" title="New Arrival"></div>}
                                                    {p.isTrending && <div className="w-2.5 h-2.5 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" title="Trending"></div>}
                                                    {p.onSale && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" title="On Sale"></div>}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <button onClick={() => { setEditingProduct(p); setIsModalOpen(true); }} className="p-3 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors border border-transparent hover:border-emerald-100 shadow-sm"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(p.id)} className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>

            {adminProductsPagination.pages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-4">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 border rounded-xl hover:bg-white transition disabled:opacity-30">Previous</button>
                    <span className="text-sm font-bold text-gray-500">Page {currentPage} of {adminProductsPagination.pages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(adminProductsPagination.pages, p + 1))} disabled={currentPage === adminProductsPagination.pages} className="px-4 py-2 border rounded-xl hover:bg-white transition disabled:opacity-30">Next</button>
                </div>
            )}

            {isModalOpen && <ProductFormModal product={editingProduct} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default AdminProductsPage;
