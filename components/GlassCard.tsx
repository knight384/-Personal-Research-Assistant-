import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white/5 
        backdrop-blur-md 
        border border-white/10 
        rounded-xl 
        shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] 
        text-slate-100
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:bg-white/10 hover:border-white/20' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
