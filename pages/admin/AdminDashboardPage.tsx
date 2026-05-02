
import React, { useState } from 'react';
import { Order } from '../../types';
import { 
    ShoppingBag, ListOrdered, DollarSign, CreditCard, RefreshCw, 
    TrendingUp, ArrowUpRight, ArrowDownRight, Package, 
    AlertCircle, Sparkles, User, ChevronRight, Phone, Wallet, Smartphone
} from 'lucide-react';
import { useAppStore } from '../../store';

const getStatusColor = (status: Order['status']) => {
    switch (status) {
        case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
        case 'Confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        case 'Shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
        case 'Delivered': return 'bg-emerald-800 text-white border-emerald-800';
        default: return 'bg-stone-50 text-stone-500 border-stone-100';
    }
}

const PrimaryStatCard: React.FC<{ title: string, value: string, icon: React.ElementType, trend?: string, color: 'emerald' | 'teal' | 'blue' | 'stone' }> = ({ title, value, icon: Icon, trend, color }) => {
    const colorClasses = {
        emerald: 'bg-emerald-800 shadow-emerald-200',
        teal: 'bg-teal-700 shadow-teal-200',
        blue: 'bg-blue-600 shadow-blue-200',
        stone: 'bg-stone-800 shadow-stone-200'
    };

    return (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-stone-100 flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-all duration-500">
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-700 ${colorClasses[color]}`}></div>
            
            <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl text-white shadow-xl ${colorClasses[color]}`}>
                    <Icon size={24} strokeWidth={2.5} />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                        <TrendingUp size={10} /> {trend}
                    </div>
                )}
            </div>
            
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2">{title}</p>
            <p className="text-4xl font-black text-stone-900 tracking-tighter font-serif">{value}</p>
        </div>
    );
};

const SecondaryStatCard: React.FC<{ title: string, value: string | number, icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-5 rounded-2xl border border-stone-100 flex items-center gap-5 hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300">
        <div className="p-3 bg-stone-50 rounded-xl text-stone-500">
            <Icon size={18} />
        </div>
        <div>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none mb-2">{title}</p>
            <p className="text-base font-black text-stone-800 leading-none">{value}</p>
        </div>
    </div>
);

const CategoryPerformanceItem: React.FC<{ label: string, revenue: number, orders: number, icon: React.ElementType, color: string }> = ({ label, revenue, orders, icon: Icon, color }) => (
    <div className="group flex items-center justify-between p-6 bg-white rounded-3xl border border-stone-100 hover:border-emerald-200 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-emerald-100/30">
        <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${color} shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon size={22} />
            </div>
            <div>
                <h4 className="text-sm font-black text-stone-900 uppercase tracking-tight">{label}</h4>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{orders} Orders</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-xl font-black text-stone-900 tracking-tight font-serif">৳{revenue.toLocaleString()}</p>
            <div className="flex items-center justify-end gap-1 text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">
                <ArrowUpRight size={10} /> Active
            </div>
        </div>
    </div>
);

const AdminDashboardPage: React.FC = () => {
    const { orders, navigate, dashboardStats, loadAdminData, notify } = useAppStore();
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    const stats = dashboardStats || {
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        onlineTransactions: 0,
        outOfStockCount: 0,
        fashionRevenue: 0,
        cosmeticsRevenue: 0,
        fashionOrders: 0,
        cosmeticsOrders: 0,
        customerCount: 0
    };

    const recentOrders = [...orders].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.date).getTime();
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.date).getTime();
        return dateB - dateA;
    }).slice(0, 7);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await loadAdminData();
            notify("Dashboard metrics updated.", "success");
        } catch (e) {
            notify("Refresh failed.", "error");
        } finally {
            setIsRefreshing(false);
        }
    };

    // --- DYNAMIC INSIGHTS ENGINE ---
    const getSystemInsight = () => {
        if (stats.totalOrders === 0) return "Launch your first campaign to see sales insights here.";
        
        const gadgetLead = stats.fashionRevenue > stats.cosmeticsRevenue;
        
        if (gadgetLead) {
            return `Gadgets are dominating with ৳${stats.fashionRevenue.toLocaleString()} in sales. Consider expanding your tech collection.`;
        } else {
            return `Home Decor is trending! Your artistic wing is generating high volume. Stock up on top-selling vases.`;
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto animate-fadeIn pb-24">
            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-black text-stone-900 tracking-tighter uppercase leading-none font-serif">
                        Pulse <span className="text-emerald-800">Command</span>
                    </h1>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.4em] mt-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Live System Intelligence
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex flex-col items-end mr-4">
                         <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">System Sync</span>
                         <span className="text-[11px] font-bold text-stone-500">{new Date().toLocaleTimeString()}</span>
                    </div>
                    <button 
                        onClick={handleRefresh} 
                        disabled={isRefreshing}
                        className="bg-white border border-stone-200 p-4 rounded-2xl shadow-sm hover:shadow-xl hover:text-emerald-800 transition-all active:scale-95 group"
                    >
                        <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
                    </button>
                    <button onClick={() => navigate('/admin/orders')} className="bg-emerald-800 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-900/20 hover:bg-emerald-900 transition-all active:scale-95">
                        Manage Orders
                    </button>
                </div>
            </div>

            {/* --- MAIN METRICS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <PrimaryStatCard title="Gross Revenue" value={`৳${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="emerald" trend="+12%" />
                <PrimaryStatCard title="Total Volume" value={stats.totalOrders.toLocaleString()} icon={ListOrdered} color="teal" trend="+8%" />
                <PrimaryStatCard title="Online Pay" value={stats.onlineTransactions.toLocaleString()} icon={Wallet} color="blue" />
                <PrimaryStatCard title="Inventory" value={stats.totalProducts.toLocaleString()} icon={Package} color="stone" />
            </div>

            {/* --- SECONDARY METRICS (SMART BAR) --- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                <SecondaryStatCard title="Stock Alerts" value={`${stats.outOfStockCount} Items`} icon={AlertCircle} />
                <SecondaryStatCard title="Avg Basket" value={`৳${stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString() : 0}`} icon={TrendingUp} />
                <SecondaryStatCard title="Active Orders" value={orders.filter(o => o.status === 'Pending').length} icon={Sparkles} />
                <SecondaryStatCard title="Unique Buyers" value={stats.customerCount || 0} icon={User} />
            </div>

            {/* --- CORE DATA SPLIT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* CATEGORY BREAKDOWN */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest">Performance Split</h3>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Live</span>
                    </div>
                    <div className="space-y-4">
                        <CategoryPerformanceItem 
                            label="Gadget Studio" 
                            revenue={stats.fashionRevenue} 
                            orders={stats.fashionOrders} 
                            icon={Smartphone} 
                            color="bg-emerald-50 text-emerald-800"
                        />
                        <CategoryPerformanceItem 
                            label="Decor Rituals" 
                            revenue={stats.cosmeticsRevenue} 
                            orders={stats.cosmeticsOrders} 
                            icon={Sparkles} 
                            color="bg-stone-100 text-stone-800"
                        />
                    </div>
                    
                    <div className="p-8 bg-emerald-950 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
                         <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/50 mb-6 relative z-10">AI Merchant Insights</h4>
                         <p className="text-lg font-light leading-relaxed text-emerald-100/80 relative z-10">
                             {getSystemInsight()}
                         </p>
                         <button onClick={() => navigate('/admin/products')} className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 hover:text-emerald-300 transition-colors relative z-10">
                             Optimise Inventory <ChevronRight size={14} />
                         </button>
                    </div>
                </div>

                {/* RECENT ORDERS TABLE */}
                <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest">Incoming Pipeline</h3>
                        <button onClick={() => navigate('/admin/orders')} className="text-[10px] font-black text-stone-400 uppercase tracking-widest hover:text-emerald-800 transition-colors">Full History</button>
                    </div>
                    
                    <div className="bg-white rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.02)] border border-stone-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-stone-50/50 border-b border-stone-100">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Identification</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Merchant Data</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Product Value</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Pipeline Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-50">
                                    {recentOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-stone-50/30 transition-colors group cursor-pointer" onClick={() => navigate('/admin/orders')}>
                                            <td className="px-8 py-6">
                                                <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">#{order.orderId || order.id.slice(-6)}</span>
                                                <div className="text-[10px] text-stone-400 mt-3 font-bold uppercase tracking-tighter">{order.date}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-black text-stone-900 text-sm uppercase tracking-tight">{order.firstName} {order.lastName}</div>
                                                <div className="flex items-center gap-2 mt-2 text-stone-400">
                                                    <Phone size={12} />
                                                    <span className="text-[11px] font-bold">{order.phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="font-black text-stone-900 text-lg tracking-tighter font-serif">৳{(order.total - (order.shippingCharge || 0)).toLocaleString()}</div>
                                                <div className="flex items-center gap-1.5 mt-2">
                                                    {order.paymentMethod === 'Online' ? (
                                                        <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-lg uppercase tracking-tighter border border-blue-100">Paid Advance</span>
                                                    ) : (
                                                        <span className="text-[9px] font-black bg-stone-100 text-stone-500 px-2 py-1 rounded-lg uppercase tracking-tighter">COD</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-2 text-[9px] font-black rounded-xl uppercase tracking-widest border shadow-sm ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentOrders.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-24 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-20">
                                                    <Package size={48} />
                                                    <span className="text-xs font-black uppercase tracking-widest">No active orders found</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboardPage;
