import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', title, icon }) => {
  return (
    <div className={`card p-6 shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
          {icon && <div className="p-2 rounded-lg bg-slate-100 text-slate-600">{icon}</div>}
          <h3 className="text-lg font-display font-bold text-slate-800">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};
