import React, { useState } from 'react';
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
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
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
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
              <div className="relative">
                <Icons.CheckSquare className="absolute left-3 top-2.5 text-slate-500" size={16} />
                <input
                  type="password"
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
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
      </div>
    </div>
  );
};