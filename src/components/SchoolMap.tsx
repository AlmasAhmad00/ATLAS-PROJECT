import React from 'react';
import { Zone } from '../types';
import { Building2, Shield, Wind, X, MapPin, Trees, Car, Zap } from 'lucide-react';

interface SchoolMapProps {
  zones: Zone[];
  onClose?: () => void;
}

export const SchoolMap: React.FC<SchoolMapProps> = ({ zones, onClose }) => {
  // Group zones into building blocks
  const blockA = zones.filter(z => z.id === '1' || z.id === '5' || z.name.includes('Classroom'));
  const blockB = zones.filter(z => z.id === '2' || z.id === '3' || z.id === '8');
  const blockC = zones.filter(z => z.id === '6');
  const field = zones.filter(z => z.id === '4' || z.id === '7');

  return (
    <div className="relative bg-[#0F172A] rounded-[2.5rem] p-8 overflow-hidden min-h-[750px] border border-white/5 shadow-2xl font-sans text-slate-200">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#f8fafc 1px, transparent 1px), linear-gradient(90deg, #f8fafc 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Schematic Layout Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <header className="flex justify-between items-start mb-12">
          <div className="flex items-start gap-5">
            {onClose && (
              <button onClick={onClose} className="lg:hidden p-3 bg-slate-800/80 border border-slate-700 rounded-2xl text-slate-200 hover:bg-slate-700 transition-all active:scale-90">
                <X className="w-5 h-5" />
              </button>
            )}
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-white tracking-tight leading-none italic uppercase">A T L A S <span className="font-light text-slate-500">Board</span></h2>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />
                </div>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">AsTech Thermal & Learning Analysis System</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 rounded-3xl gap-8 shadow-2xl">
               <LegendItem color="bg-emerald-400" label="Optimum" />
               <LegendItem color="bg-amber-400" label="Elevated" />
               <LegendItem color="bg-rose-500" label="Critical" />
            </div>
            {onClose && (
              <button 
                onClick={onClose}
                className="hidden lg:flex items-center gap-3 px-8 py-4 bg-slate-800 text-white border border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-700 transition-all shadow-xl active:scale-95"
              >
                <X className="w-4 h-4" />
                Close Terminal
              </button>
            )}
          </div>
        </header>

        {/* FLAT 2D SCHOOL CANVAS */}
        <div className="relative flex-grow h-[550px] mt-4 bg-slate-800/10 rounded-[3rem] border border-white/5 p-8">
          <div className="grid grid-cols-12 grid-rows-6 h-full gap-4">
            
            {/* BLOCK A - Academic */}
            <div className="col-span-4 row-span-4">
              <BuildingBlock 
                color="bg-blue-600/10" 
                borderColor="border-blue-500/30"
                label="BLOCK A - Academic" 
                icon={<Building2 className="w-5 h-5 text-blue-400" />}
                zones={blockA}
              />
            </div>

            {/* BLOCK B - Admin */}
            <div className="col-span-3 row-span-3 col-start-9">
              <BuildingBlock 
                color="bg-purple-600/10" 
                borderColor="border-purple-500/30"
                label="BLOCK B - Admin" 
                icon={<Shield className="w-5 h-5 text-purple-400" />}
                zones={blockB}
              />
            </div>

            {/* BLOCK C - Science */}
            <div className="col-span-5 row-span-2 col-start-1 row-start-5">
              <BuildingBlock 
                color="bg-emerald-600/10" 
                borderColor="border-emerald-500/30"
                label="BLOCK C - Lab" 
                icon={<Zap className="w-5 h-5 text-emerald-400" />}
                zones={blockC}
              />
            </div>

        {/* FIELD ZONE */}
            <div className="col-span-4 row-span-3 col-start-6 row-start-3 border-2 border-dashed border-slate-700/50 rounded-[2.5rem] bg-slate-900/40 p-6 flex flex-col items-center justify-center">
               <div className="flex items-center gap-3 mb-6 opacity-30">
                  <MapPin className="w-8 h-8 text-slate-500" />
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Outdoor Zones</span>
               </div>
               <div className="grid grid-cols-1 gap-3 w-full">
                  {field.map(z => <ZoneCard key={z.id} zone={z} />)}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

interface BuildingBlockProps {
  color: string;
  borderColor: string;
  label: string;
  icon: React.ReactNode;
  zones: Zone[];
}

const BuildingBlock: React.FC<BuildingBlockProps> = ({ color, borderColor, label, icon, zones }) => {
  return (
    <div className={`h-full w-full rounded-[2rem] border-2 ${borderColor} ${color} p-6 flex flex-col`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-900/50 rounded-xl">
          {icon}
        </div>
        <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/50">{label}</span>
      </div>
      <div className="flex-grow overflow-y-auto space-y-2 pr-2 scrollbar-hide">
        {zones.map((z) => (
          <ZoneCard key={z.id} zone={z} />
        ))}
      </div>
    </div>
  );
};

const ZoneCard: React.FC<{ zone: Zone }> = ({ zone }) => {
  const isCritical = zone.temperature >= 32;
  const isWarning = zone.temperature >= 27 && zone.temperature < 32;
  const statusColor = isCritical ? 'bg-rose-600' : isWarning ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300">
      <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-3 shadow-lg flex items-center gap-4 hover:border-blue-500 transition-all">
         <div className={`w-10 h-10 rounded-xl ${statusColor} flex items-center justify-center text-white shrink-0`}>
            <span className="text-xl font-black tracking-tighter">{zone.temperature}°</span>
         </div>
         <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-black text-white uppercase tracking-wider truncate">{zone.name}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
               <div className={`w-1 h-1 rounded-full ${isCritical ? 'animate-pulse bg-rose-400' : 'bg-emerald-400'}`} />
               <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">{isCritical ? 'ALERT' : 'STABLE'}</span>
            </div>
         </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-3">
    <div className={`w-3 h-3 rounded-full ${color} shadow-[0_0_15px_rgba(0,0,0,0.5)]`} />
    <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{label}</span>
  </div>
);
