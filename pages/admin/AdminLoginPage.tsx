
import React, { useState } from 'react';
import { Lock, Mail, LoaderCircle, AlertCircle, ChevronLeft, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../../store';

const AdminLoginPage: React.FC = () => {
  const { login, resetAdminPassword } = useAppStore(state => ({
    login: state.login,
    resetAdminPassword: state.resetAdminPassword
  }));
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isReseting, setIsReseting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    await login(email, password);
    setIsLoggingIn(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (isReseting) return;
    
    const confirm = window.confirm("Are you sure you want to reset the password to default? A notification will be sent to your email.");
    if (!confirm) return;

    setIsReseting(true);
    const success = await resetAdminPassword(email);
    if (success) setIsResetMode(false);
    setIsReseting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-950 p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full -ml-64 -mt-64 blur-[120px]"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-400/5 rounded-full -mr-32 -mb-32 blur-[100px]"></div>

      <div className="w-full max-w-sm p-10 space-y-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden group">
        
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-800 text-white font-black text-4xl mb-6 shadow-2xl shadow-emerald-900/40 font-serif">
            U
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight font-serif">
            {isResetMode ? 'Recover Access' : 'Admin Portal'}
          </h1>
          <p className="mt-3 text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.3em]">
            {isResetMode ? 'Emergency Security Reset' : 'Secure Command Center'}
          </p>
        </div>

        <form onSubmit={isResetMode ? handleReset : handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-emerald-500/40 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@uniquecorner.com"
                className="w-full bg-emerald-900/30 border border-white/10 p-4 pl-12 rounded-2xl text-white placeholder:text-emerald-100/20 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 outline-none text-sm"
                required
              />
            </div>
          </div>

          {!isResetMode && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-500/40 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-emerald-900/30 border border-white/10 p-4 pl-12 rounded-2xl text-white placeholder:text-emerald-100/20 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 outline-none text-sm"
                  required
                />
              </div>
            </div>
          )}

          {isResetMode && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3 items-start animate-fadeIn">
                <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-amber-200/80 leading-relaxed uppercase tracking-tight">
                    Warning: Password will revert to system default. A secure notification will be sent to your primary email address.
                </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn || isReseting}
            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-2xl active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50
              ${isResetMode 
                ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                : 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-emerald-900/40'}
            `}
          >
            {isLoggingIn || isReseting ? (
              <LoaderCircle className="w-5 h-5 animate-spin" />
            ) : (
              isResetMode ? 'Confirm Reset' : 'Authenticate'
            )}
          </button>
        </form>

        <div className="pt-2 text-center relative z-10">
          <button 
            type="button" 
            onClick={() => setIsResetMode(!isResetMode)}
            className="group inline-flex items-center gap-2 text-[10px] font-black text-emerald-500/40 hover:text-emerald-400 transition-all uppercase tracking-widest p-3 border border-white/5 rounded-xl hover:bg-white/5"
          >
            {isResetMode ? (
              <>
                <ChevronLeft className="w-3.5 h-3.5" />
                Back to Login
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                Forgot Access? Reset
              </>
            )}
          </button>
        </div>

        <div className="text-center pt-6">
            <p className="text-[9px] font-black text-emerald-900/50 uppercase tracking-[0.4em]">
                Secure Admin Portal © 2026 Unique Corner
            </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
