<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> ba310f194abb9585a2d171538e6e4a1b5f5a70dc
import { GlassCard } from './GlassCard';
import { Icons } from './Icons';
import { authService } from '../services/auth';
import { User } from '../types';

interface AuthViewProps {
  onLogin: (user: User) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

<<<<<<< HEAD
=======
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize coordinates to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

>>>>>>> ba310f194abb9585a2d171538e6e4a1b5f5a70dc
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let user;
      if (isLogin) {
        user = await authService.login(formData.email, formData.password);
      } else {
        user = await authService.register(formData.name, formData.email, formData.password);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 mb-4">
            <Icons.Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Lumina Research</h1>
          <p className="text-slate-400">Your intelligent academic assistant</p>
        </div>

        <GlassCard className="p-8">
          <div className="flex mb-6 border-b border-white/10">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
                isLogin ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${
                !isLogin ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                <div className="relative">
                  <Icons.User className="absolute left-3 top-2.5 text-slate-500" size={16} />
                  <input
                    type="text"
                    required
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="John Doe"
=======
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-0 overflow-hidden relative bg-[#0f172a]">
      
      {/* Dynamic 3D Background Grid */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-[-50%] opacity-20 transition-transform duration-100 ease-out" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)', 
            backgroundSize: '50px 50px',
            transform: `perspective(500px) rotateX(60deg) translateY(${mousePos.y * 30 - 100}px) translateX(${mousePos.x * 20}px) scale(2)`
          }} 
        />
        {/* Floating background particles */}
        <div 
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"
            style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)` }}
        />
        <div 
            className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
            style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }}
        />
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center z-10 gap-12 lg:gap-24">
        
        {/* Left Side: Interactive 3D Visuals */}
        <div className="hidden lg:flex flex-col items-start space-y-8 flex-1 perspective-1000">
          <div 
            className="relative preserve-3d transition-transform duration-100 ease-out cursor-default"
            style={{
                transform: `rotateY(${mousePos.x * 15 + 12}deg) rotateX(${mousePos.y * -15 + 5}deg)`
            }}
          >
            
            {/* Floating Paper Layers (Knowledge Stack) */}
            <div className="absolute top-0 left-0 w-72 h-96 bg-blue-600/5 backdrop-blur-[2px] border border-blue-400/10 rounded-xl transform -translate-z-[60px] translate-x-12 translate-y-12 shadow-2xl transition-transform duration-500"></div>
            <div className="absolute top-0 left-0 w-72 h-96 bg-blue-500/10 backdrop-blur-[4px] border border-blue-400/20 rounded-xl transform -translate-z-[30px] translate-x-6 translate-y-6 shadow-2xl transition-transform duration-500"></div>
            
            {/* Main Card */}
            <div className="w-72 h-96 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
               {/* Shine effect */}
               <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
               
               <div className="space-y-6">
                 <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                   <Icons.Sparkles size={28} />
                 </div>
                 <div className="space-y-3">
                   <div className="h-2 w-3/4 bg-white/20 rounded-full animate-pulse"></div>
                   <div className="h-2 w-1/2 bg-white/10 rounded-full animate-pulse delay-75"></div>
                   <div className="h-2 w-full bg-white/10 rounded-full animate-pulse delay-150"></div>
                 </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-xs text-blue-200/80 font-mono border-t border-white/5 pt-4">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-ping"></div>
                    <span>System Online</span>
                  </div>
               </div>
            </div>

            {/* Floating Connection Nodes with independent parallax */}
            <div 
                className="absolute -right-16 top-20 w-20 h-20 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center shadow-xl transform translate-z-[40px]"
                style={{ transform: `translateZ(40px) translateX(${mousePos.x * -10}px)` }}
            >
               <Icons.Search className="text-blue-400" size={28} />
            </div>
            
            <div 
                className="absolute -left-10 bottom-20 w-16 h-16 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center shadow-xl transform translate-z-[50px]"
                style={{ transform: `translateZ(50px) translateX(${mousePos.x * 10}px)` }}
            >
               <Icons.Library className="text-purple-400" size={24} />
            </div>

            <div 
                className="absolute right-8 -bottom-8 w-12 h-12 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center shadow-xl transform translate-z-[20px]"
                style={{ transform: `translateZ(20px) translateY(${mousePos.y * -10}px)` }}
            >
               <Icons.Bot className="text-green-400" size={20} />
            </div>

          </div>

          <div className="space-y-4 pl-4 border-l-2 border-blue-500/30">
            <h1 className="text-6xl font-bold text-white tracking-tight drop-shadow-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
              Lumina <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Research</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-md font-light leading-relaxed">
              The next generation AI research assistant. Synthesize, analyze, and organize academic knowledge in a spatial interface.
            </p>
          </div>
        </div>

        {/* Right Side: Auth Form with Tilt */}
        <div 
            className="w-full max-w-md relative perspective-1000"
            style={{ transform: `rotateY(${mousePos.x * -2}deg) rotateX(${mousePos.y * 2}deg)` }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 animate-pulse transition-opacity duration-500 group-hover:opacity-50"></div>
          
          <GlassCard className="p-8 lg:p-10 relative bg-[#0f172a]/90 border-t border-l border-white/20 shadow-2xl backdrop-blur-xl">
             <div className="lg:hidden text-center mb-8">
               <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>Lumina</h1>
             </div>

             <div className="flex mb-8 p-1 bg-black/40 rounded-xl border border-white/5">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isLogin ? 'bg-white/10 text-white shadow-lg ring-1 ring-white/10' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                  !isLogin ? 'bg-white/10 text-white shadow-lg ring-1 ring-white/10' : 'text-slate-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-1 group">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide ml-1 group-focus-within:text-blue-400 transition-colors">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all hover:bg-black/30"
                    placeholder="e.g. Dr. Rosalind Franklin"
>>>>>>> ba310f194abb9585a2d171538e6e4a1b5f5a70dc
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
<<<<<<< HEAD
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
              <div className="relative">
                <Icons.Bot className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input
                  type="email"
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="researcher@university.edu"
=======
              )}

              <div className="space-y-1 group">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide ml-1 group-focus-within:text-blue-400 transition-colors">Institutional Email</label>
                <input
                  type="email"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all hover:bg-black/30"
                  placeholder="name@university.edu"
>>>>>>> ba310f194abb9585a2d171538e6e4a1b5f5a70dc
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
<<<<<<< HEAD
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
              <div className="relative">
                <Icons.CheckSquare className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input
                  type="password"
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
=======

              <div className="space-y-1 group">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide ml-1 group-focus-within:text-blue-400 transition-colors">Password</label>
                <input
                  type="password"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all hover:bg-black/30"
>>>>>>> ba310f194abb9585a2d171538e6e4a1b5f5a70dc
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
<<<<<<< HEAD
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/20 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>
        </GlassCard>
        
        <p className="text-center text-xs text-slate-500 mt-6">
          By continuing, you agree to Lumina's Terms of Service and Privacy Policy.
        </p>
=======

              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center space-x-2 text-red-200 text-xs animate-shake">
                  <Icons.X size={14} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-slate-100 to-slate-300 text-slate-900 hover:to-white font-bold py-3.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/10 mt-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? 'Access Platform' : 'Initialize Account'}</span>
                    <Icons.ChevronRight size={16} />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 text-center border-t border-white/5 pt-6">
               <p className="text-[10px] text-slate-500 font-mono">
                 SECURE CONNECTION ESTABLISHED • ID: {Date.now().toString().slice(-6)}
               </p>
            </div>
          </GlassCard>
        </div>
>>>>>>> ba310f194abb9585a2d171538e6e4a1b5f5a70dc
      </div>
    </div>
  );
};