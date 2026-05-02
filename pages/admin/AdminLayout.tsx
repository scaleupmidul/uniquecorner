

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, ListOrdered, LogOut, Menu, X, MessageSquare, Settings, CreditCard } from 'lucide-react';
import { useAppStore } from '../../store';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NavLink: React.FC<{ icon: React.ElementType, label: string, onClick: () => void, notificationCount?: number }> = ({ icon: Icon, label, onClick, notificationCount = 0 }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between space-x-3 px-4 py-3 text-emerald-100/70 hover:bg-emerald-800 hover:text-white rounded-xl transition-all duration-200 group">
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
      <span className="font-medium text-sm tracking-tight">{label}</span>
    </div>
    {notificationCount > 0 && (
      <span className="bg-emerald-500 text-emerald-950 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-emerald-500/20">
        {notificationCount}
      </span>
    )}
  </button>
);

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { navigate, logout, contactMessages, newOrdersCount, loadAdminData } = useAppStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Trigger admin data load when layout mounts (admin logs in or refreshes on admin page)
  useEffect(() => {
      loadAdminData();
  }, [loadAdminData]);

  const unreadMessagesCount = contactMessages.filter(msg => !msg.isRead).length;

  const handleNav = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-emerald-900/50">
        <h1 className="text-xl font-black text-white tracking-tighter uppercase font-serif">Unique <span className="text-emerald-400">Corner</span></h1>
        <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-[0.3em] mt-1">Admin Portal</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <NavLink icon={LayoutDashboard} label="Dashboard" onClick={() => handleNav('/admin/dashboard')} />
        <NavLink icon={ShoppingBag} label="Products" onClick={() => handleNav('/admin/products')} />
        <NavLink icon={ListOrdered} label="Orders" onClick={() => handleNav('/admin/orders')} notificationCount={newOrdersCount} />
        <NavLink icon={MessageSquare} label="Messages" onClick={() => handleNav('/admin/messages')} notificationCount={unreadMessagesCount} />
        <NavLink icon={CreditCard} label="Transactions" onClick={() => handleNav('/admin/transactions')} />
        <NavLink icon={Settings} label="Settings" onClick={() => handleNav('/admin/settings')} />
      </nav>
      <div className="p-4 border-t border-emerald-900/50">
        <NavLink icon={LogOut} label="Logout" onClick={logout} />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#fbfbf9]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-shrink-0 w-64 bg-emerald-950 text-white shadow-2xl z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-30 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setIsSidebarOpen(false)}>
        <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm"></div>
      </div>
      <aside className={`fixed top-0 left-0 z-40 w-64 h-full bg-emerald-950 text-white transform transition-transform duration-500 ease-in-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b border-stone-100 md:hidden">
          <h1 className="text-xl font-black text-emerald-800 tracking-tighter uppercase font-serif">Unique <span className="text-emerald-600">Corner</span></h1>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-emerald-50 rounded-xl text-emerald-800">
            <Menu className="w-6 h-6" />
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#fbfbf9] p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
