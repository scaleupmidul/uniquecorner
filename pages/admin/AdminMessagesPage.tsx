import React, { useState, useMemo } from 'react';
import { ContactMessage } from '../../types';
import { Search, X, Trash2, Mail, CheckCircle } from 'lucide-react';
// FIX: Corrected the import path for `useAppStore` from the non-existent 'StoreContext.tsx' to the correct location 'store/index.ts'.
import { useAppStore } from '../../store';


interface MessageDetailsModalProps {
  message: ContactMessage;
  onClose: () => void;
  markMessageAsRead: (messageId: string, isRead: boolean) => Promise<void>;
  deleteContactMessage: (messageId: string) => Promise<void>;
}

const MessageDetailsModal: React.FC<MessageDetailsModalProps> = ({ message, onClose, markMessageAsRead, deleteContactMessage }) => {

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to permanently delete this message?')) {
            await deleteContactMessage(message.id);
            onClose();
        }
    }
    
    const handleToggleRead = async () => {
        await markMessageAsRead(message.id, !message.isRead);
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden border border-stone-100">
                <div className="p-8 border-b flex justify-between items-center bg-emerald-50/30">
                    <div>
                        <h2 className="text-2xl font-black text-emerald-950 tracking-tighter font-serif">Message Intel</h2>
                        <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest mt-1">From: {message.name}</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition shadow-sm border border-transparent hover:border-emerald-100"><X className="w-6 h-6 text-emerald-950"/></button>
                </div>
                <div className="p-8 space-y-8 overflow-y-auto text-stone-900 flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                            <span className="block text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Email Address</span>
                            <span className="font-bold text-sm text-emerald-900">{message.email}</span>
                        </div>
                        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                            <span className="block text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Received On</span>
                            <span className="font-bold text-sm text-emerald-900">{message.date}</span>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-stone-100">
                        <span className="block text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-4">Message Narrative</span>
                        <div className="p-6 bg-emerald-50/30 rounded-3xl border border-emerald-100 text-stone-700 whitespace-pre-wrap leading-relaxed font-medium text-sm">
                            {message.message}
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-stone-50/50 border-t border-stone-100 flex justify-between items-center flex-wrap gap-4">
                    <div className="flex gap-3">
                        <button 
                            onClick={handleToggleRead} 
                            className="bg-emerald-800 text-white px-6 py-3 rounded-xl hover:bg-emerald-900 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-lg shadow-emerald-900/20">
                            {message.isRead ? <Mail className="w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>}
                            <span>Mark as {message.isRead ? 'Unread' : 'Read'}</span>
                        </button>
                        <button onClick={handleDelete} className="bg-red-50 text-red-600 px-6 py-3 rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest active:scale-95 border border-red-100">
                            <Trash2 className="w-4 h-4"/>
                            <span>Delete</span>
                        </button>
                    </div>
                    <button onClick={onClose} className="px-6 py-3 font-black text-[10px] uppercase tracking-widest text-stone-400 hover:text-stone-900 transition">
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
};

const AdminMessagesPage: React.FC = () => {
  const { contactMessages, markMessageAsRead, deleteContactMessage } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const filteredMessages = useMemo(() => {
    return [...contactMessages].filter(msg => 
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [contactMessages, searchTerm]);

  return (
    <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <h1 className="text-4xl font-black text-stone-900 tracking-tighter uppercase font-serif">Message <span className="text-emerald-800">Intelligence</span></h1>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.4em] mt-2">Customer inquiries and feedback</p>
            </div>
            <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input 
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-stone-100 rounded-2xl text-sm bg-white text-stone-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                />
            </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.02)] border border-stone-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-stone-50/50 border-b border-stone-100">
                        <tr>
                            <th scope="col" className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] w-12">Status</th>
                            <th scope="col" className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Origin</th>
                            <th scope="col" className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Narrative Snippet</th>
                            <th scope="col" className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                        {filteredMessages.map(msg => (
                            <tr key={msg.id} className={`hover:bg-emerald-50/30 transition-all group cursor-pointer ${!msg.isRead ? 'bg-emerald-50/50' : 'bg-white'}`} onClick={() => setSelectedMessage(msg)}>
                                <td className="px-8 py-6">
                                    {!msg.isRead && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>}
                                </td>
                                <td className="px-8 py-6">
                                    <div className="font-black text-stone-900 text-sm tracking-tight uppercase">{msg.name}</div>
                                    <div className={`text-[10px] font-bold mt-1 ${!msg.isRead ? 'text-emerald-700' : 'text-stone-400'}`}>{msg.email}</div>
                                </td>
                                <td className="px-8 py-6 max-w-sm truncate text-stone-600 font-medium text-xs">{msg.message}</td>
                                <td className="px-8 py-6 text-stone-400 font-bold text-[10px] uppercase tracking-tighter">{msg.date}</td>
                            </tr>
                        ))}
                        {filteredMessages.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-8 py-24 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                        <Mail size={48} />
                                        <span className="text-xs font-black uppercase tracking-widest">No messages found</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        {selectedMessage && <MessageDetailsModal 
            message={selectedMessage} 
            onClose={() => setSelectedMessage(null)}
            markMessageAsRead={markMessageAsRead}
            deleteContactMessage={deleteContactMessage}
        />}
    </div>
  );
};

export default AdminMessagesPage;