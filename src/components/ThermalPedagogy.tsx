import React, { useMemo } from 'react';
import { Thermometer, BookOpen, Droplets, Move, AlertCircle, Sparkles, Timer, Activity, Zap } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ThermalPedagogyProps {
  temperature: number;
  onNotify?: (msg: string) => void;
}

export const ThermalPedagogy: React.FC<ThermalPedagogyProps> = ({ temperature, onNotify }) => {
  const logic = useMemo(() => {
    if (temperature < 26) {
      return {
        level: 'Optimal',
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        style: 'Standard Active Learning',
        action: 'Energy Optimization Mode'
      };
    } else if (temperature <= 31) {
      return {
        level: 'High',
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        style: 'Individual Focused Work',
        action: 'Mandatory Hydration (30m)'
      };
    } else if (temperature <= 34) {
      return {
        level: 'Critical',
        color: 'text-orange-500',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        style: 'Passive Learning / Video',
        action: 'Relocate to Cool Zones'
      };
    } else {
      return {
        level: 'Extreme',
        color: 'text-red-500',
        bg: 'bg-red-50',
        border: 'border-red-200',
        style: 'Emergency Shutdown',
        action: 'Clinic Evacuation'
      };
    }
  }, [temperature]);

  return (
    <div className="space-y-4">
      <section className="bg-slate-900 text-white rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BookOpen className="w-24 h-24" />
        </div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-blue-400 animate-pulse rounded-full"></div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">AI Thermal-Pedagogy Logic</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="md:border-r border-slate-700 md:pr-6">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Recommended Style</p>
            <p className="text-xl font-semibold">{logic.style}</p>
          </div>
          <div className="md:border-r border-slate-700 md:px-6">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Required Action</p>
            <p className="text-xl font-semibold">{logic.action}</p>
          </div>
          <div className="md:pl-6">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">Temp Status</p>
            <p className={`text-xl font-bold ${logic.color}`}>{temperature}°C ({logic.level})</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => onNotify?.("Hydration break logged for current grade.")}
          className="bg-white border border-slate-200 hover:bg-slate-50 transition-colors p-4 rounded-xl text-left flex items-center gap-4 group"
        >
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Log Hydration Break</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Sync to Principal Dashboard</p>
          </div>
        </button>
        <button 
          onClick={() => onNotify?.("Emergency referral initiated. Principal notified.")}
          className="bg-white border border-slate-200 hover:bg-slate-50 transition-colors p-4 rounded-xl text-left flex items-center gap-4 group"
        >
          <div className="p-3 rounded-lg bg-rose-50 text-rose-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Clinic Referral</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Emergency Principal Notification</p>
          </div>
        </button>
      </div>
    </div>
  );
};
