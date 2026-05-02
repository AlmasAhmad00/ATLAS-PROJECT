import React from 'react';
import { Zone, OutbreakAlert, ClinicInventoryItem, HygieneLog, GlobalHealthBrief } from '../types';
import { 
  Thermometer, 
  Droplets, 
  Map as MapIcon, 
  Users, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Stethoscope, 
  Package, 
  TrendingUp, 
  Activity,
  UserX,
  Zap,
  Info,
  Wind,
  Globe,
  Newspaper
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import { motion, AnimatePresence } from 'motion/react';

interface PrincipalDashboardProps {
  zones: Zone[];
  outbreakAlerts?: OutbreakAlert[];
  inventory?: ClinicInventoryItem[];
  hygieneLogs?: HygieneLog[];
  globalHealthBriefs?: GlobalHealthBrief[];
  onResolveAlert?: (id: string) => void;
  onGenerateReport?: (type: string) => void;
}

export const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({ 
  zones,
  outbreakAlerts = [],
  inventory = [],
  hygieneLogs = [],
  globalHealthBriefs = [],
  onResolveAlert,
  onGenerateReport
}) => {
  const averageTemp = zones.reduce((acc, z) => acc + z.temperature, 0) / zones.length;
  const criticalZones = zones.filter(z => z.temperature >= 32).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Average School Temp" value={`${averageTemp.toFixed(1)}°C`} icon={<Thermometer className="w-5 h-5" />} color="blue" />
        <StatCard title="Health Index" value="98.4" icon={<Activity className="w-5 h-5" />} color="emerald" />
        <StatCard title="Active Students" value="1,240" icon={<Users className="w-5 h-5" />} color="slate" />
        <StatCard title="Global AQI" value="14" icon={<Wind className="w-5 h-5" />} color="blue" />
      </div>

      <AnimatePresence>
        {outbreakAlerts.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden"
          >
            <div className="bg-rose-900 text-white p-6 rounded-3xl shadow-2xl border-4 border-rose-500/20 mb-6 relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <ShieldAlert className="w-32 h-32" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Principal's Outbreak Intelligence Warning</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {outbreakAlerts.map(alert => (
                  <div key={alert.id} className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-2xl">
                    <p className="text-[10px] font-black uppercase text-rose-300 tracking-widest mb-1">{alert.type.replace(/-/g, ' ')}</p>
                    <h3 className="font-bold text-lg mb-2">{alert.title}</h3>
                    <p className="text-xs opacity-80 leading-relaxed mb-4">{alert.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                       <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-full">{alert.affectedGroup}</span>
                       <button 
                        onClick={() => onResolveAlert?.(alert.id)}
                        className="text-[10px] font-black uppercase text-rose-300 hover:text-white transition underline"
                       >
                        Execute Response
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <GlassCard 
            title="Environmental Intelligence: Global Mapping" 
            icon={<MapIcon className="w-5 h-5" />} 
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[400px] overflow-y-auto pr-2">
              {zones.map((zone) => (
                <div 
                  key={zone.id}
                  className={`rounded-xl border-2 p-4 flex flex-col justify-between transition-all hover:shadow-md ${
                    zone.temperature >= 32 ? 'bg-rose-50 border-rose-500' :
                    zone.temperature >= 27 ? 'bg-amber-50 border-amber-400' :
                    'bg-slate-50 border-emerald-400'
                  }`}
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{zone.type}</p>
                    <h5 className="font-bold text-slate-800 leading-tight">{zone.name}</h5>
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-light text-slate-900">{zone.temperature}°C</p>
                    {zone.temperature >= 32 && (
                      <p className="text-[10px] text-rose-600 font-bold uppercase mt-2">Relocation Required</p>
                    )}
                    {zone.temperature < 27 && (
                      <p className="text-[10px] text-emerald-600 font-bold uppercase mt-2">Cool Zone Active</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <section className="bg-slate-900 text-white rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
              <Globe className="w-48 h-48 animate-pulse" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter">Global Disease Awareness Feed</h2>
                  <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest">Real-time health intelligence updates</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {globalHealthBriefs.length === 0 ? (
                  <p className="text-slate-400 text-sm italic">No global health threats detected in current interval.</p>
                ) : (
                  globalHealthBriefs.map(brief => (
                    <div key={brief.id} className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-[2rem] hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          brief.riskLevel === 'high' ? 'bg-rose-500 text-white' :
                          brief.riskLevel === 'moderate' ? 'bg-amber-500 text-white' :
                          'bg-blue-500 text-white'
                        }`}>
                          {brief.riskLevel} Risk
                        </span>
                        <span className="text-[8px] font-bold text-slate-400">{brief.source} • {brief.region}</span>
                      </div>
                      <h4 className="font-bold text-sm mb-2 text-blue-100">{brief.title}</h4>
                      <p className="text-[10px] text-slate-300 leading-relaxed line-clamp-3">{brief.summary}</p>
                      <button 
                        onClick={() => onGenerateReport?.(`Global Health Investigation: ${brief.title}`)}
                        className="mt-4 text-[9px] font-black uppercase text-blue-400 flex items-center gap-1 hover:text-white transition"
                      >
                        View Full Investigation Protocol <TrendingUp className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <GlassCard title="Clinic Resource Inventory" icon={<Package className="w-5 h-5 text-indigo-500" />}>
            <div className="space-y-3">
              {inventory.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{item.name}</p>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{item.quantity} {item.unit} Remaining</p>
                    </div>
                  </div>
                  {item.quantity <= item.lowStockThreshold && (
                    <span className="text-[8px] font-black uppercase text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full animate-bounce">Low Stock</span>
                  )}
                </div>
              ))}
              <button 
                onClick={() => onGenerateReport?.('Inventory Restock')}
                className="w-full mt-2 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition"
              >
                Generate Restock List
              </button>
            </div>
          </GlassCard>

          <GlassCard title="Hygiene Compliance Monitor" icon={<Sparkles className="w-5 h-5 text-blue-500" />}>
             <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                   <div className="flex justify-between items-center mb-2">
                      <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Global Sanitizer Usage</h4>
                      <TrendingUp className="w-3 h-3 text-blue-600" />
                   </div>
                   <p className="text-2xl font-black text-blue-900">82%</p>
                   <p className="text-[10px] text-blue-700 font-medium mt-1">Average usage per hygiene interval</p>
                </div>
                
                <div className="space-y-2">
                   {hygieneLogs.slice(0, 3).map(log => (
                     <div key={log.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                        <span className="text-slate-500 font-medium">Zone {log.zoneId.split('-')[1]} Usage</span>
                        <span className="font-bold text-slate-800">{log.usageCount} Events</span>
                     </div>
                   ))}
                </div>
                
                <div className="p-3 bg-emerald-900 text-white rounded-2xl flex items-center gap-3">
                   <Zap className="w-4 h-4 text-emerald-400" />
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-80">System Action</p>
                      <p className="text-[10px] font-bold">UV-C Sterilization: Armed at 00:00</p>
                   </div>
                </div>
             </div>
          </GlassCard>

          <GlassCard title="Outbreak Alert Matrix" icon={<Zap className="w-5 h-5 text-rose-500" />}>
            <div className="space-y-3">
              <NotificationItem 
                type="critical" 
                time="2m ago" 
                message="Symptom Cluster: 5 Sore Throats in 4 KA 1. Outbreak Likely." 
              />
              <NotificationItem 
                type="warning" 
                time="15m ago" 
                message="Block B sanitizer logs critical: Hygiene break recommended." 
              />
              <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg mt-4">
                <h4 className="text-[10px] font-bold uppercase opacity-80 mb-2">School Health Index</h4>
                <div className="flex justify-between items-end">
                  <p className="text-2xl font-bold">98.4</p>
                  <div className="h-8 w-16 flex items-end gap-1">
                    <div className="bg-white/30 w-full h-[40%] rounded-t-sm"></div>
                    <div className="bg-white/30 w-full h-[60%] rounded-t-sm"></div>
                    <div className="bg-white w-full h-[90%] rounded-t-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) => {
  const bgStyles: Record<string, string> = {
    blue: 'bg-blue-600 text-white',
    red: 'bg-rose-500 text-white',
    slate: 'bg-slate-800 text-white',
    emerald: 'bg-emerald-600 text-white',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${bgStyles[color] || 'bg-slate-100 text-slate-600'}`}>
        {icon}
      </div>
    </div>
  );
};

const NotificationItem = ({ type, time, message }: { type: 'critical' | 'warning' | 'info'; time: string; message: string }) => {
  const styles = {
    critical: 'bg-red-50 border-red-100 text-red-700',
    warning: 'bg-amber-50 border-amber-100 text-amber-700',
    info: 'bg-blue-50 border-blue-100 text-blue-700',
  };

  return (
    <div className={`p-4 rounded-2xl border ${styles[type]} space-y-1`}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{type}</span>
        <span className="text-[10px] opacity-60 font-medium">{time}</span>
      </div>
      <p className="text-sm font-medium leading-snug">{message}</p>
    </div>
  );
};
