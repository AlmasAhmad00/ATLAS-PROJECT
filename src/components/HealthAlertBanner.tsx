import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Activity, ShieldAlert, ArrowRight, X } from 'lucide-react';
import { HealthForecast } from '../types';

interface HealthAlertBannerProps {
  forecasts: HealthForecast[];
  onClose?: () => void;
}

export const HealthAlertBanner: React.FC<HealthAlertBannerProps> = ({ forecasts, onClose }) => {
  if (forecasts.length === 0) return null;

  const latest = forecasts[0];
  const isCritical = latest.severity === 'critical' || latest.severity === 'high';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={`mb-8 overflow-hidden rounded-3xl border relative ${
          isCritical 
            ? 'bg-red-50 border-red-200 shadow-lg shadow-red-100' 
            : 'bg-orange-50 border-orange-200'
        }`}
      >
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors z-10"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className={`p-4 rounded-2xl ${isCritical ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'} shadow-xl`}>
              <ShieldAlert className="w-8 h-8" />
            </div>
            
            <div className="flex-grow space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  isCritical ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'
                }`}>
                  {latest.severity} Health Warning
                </span>
                <span className="text-slate-400 text-xs font-medium">
                  Trend Detected: {latest.timestamp.toLocaleTimeString()}
                </span>
              </div>

              <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                {latest.title}: {latest.suspectedDisease}
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
                {latest.description}. Current tracking shows <span className="font-bold text-slate-800">{latest.affectedCount} students</span> reporting similar symptoms: {latest.symptoms.join(', ')}.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-xl border border-white/50">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Suggested Action: {latest.suggestedAction}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-[200px]">
              <div className="p-4 bg-white/40 rounded-2xl border border-white/60">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Alert Distributed To</p>
                <div className="flex flex-wrap gap-1">
                  {['Admin', 'Teachers', 'Wardens', 'Students'].map(role => (
                    <span key={role} className="text-[9px] font-bold text-slate-600 bg-white/60 px-2 py-0.5 rounded-md border border-white/80">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`h-1.5 w-full bg-slate-200 overflow-hidden`}>
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className={`h-full w-1/3 ${isCritical ? 'bg-red-600' : 'bg-orange-500'}`}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
