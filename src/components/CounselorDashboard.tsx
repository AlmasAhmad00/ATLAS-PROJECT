import React, { useState } from 'react';
import { StressCheck, User, OutbreakAlert } from '../types';
import { GlassCard } from './GlassCard';
import { 
  Heart, 
  Smile, 
  Meh, 
  Frown, 
  Activity, 
  MessageSquare, 
  ShieldCheck, 
  Search, 
  PhoneCall,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  Brain,
  Dog,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CounselorDashboardProps {
  stressChecks: StressCheck[];
  students: User[];
  outbreakAlerts: OutbreakAlert[];
  onAction?: (type: string, studentName?: string) => void;
}

export const CounselorDashboard: React.FC<CounselorDashboardProps> = ({ 
  stressChecks, 
  students, 
  outbreakAlerts,
  onAction 
}) => {
  const [filter, setFilter] = useState<'all' | 'high-stress'>('high-stress');
  
  const highStressChecks = stressChecks.filter(c => c.level >= 4);
  const displayChecks = filter === 'all' ? stressChecks : highStressChecks;

  const avgStress = stressChecks.length > 0 
    ? (stressChecks.reduce((acc, c) => acc + c.level, 0) / stressChecks.length).toFixed(1)
    : "0";

  const getMoodConfig = (level: number) => {
    switch (level) {
      case 1: return { icon: <Smile className="w-5 h-5 text-emerald-500" />, label: 'Great', color: 'text-emerald-600' };
      case 2: return { icon: <Smile className="w-5 h-5 text-blue-500" />, label: 'Good', color: 'text-blue-600' };
      case 3: return { icon: <Meh className="w-5 h-5 text-amber-500" />, label: 'Okay', color: 'text-amber-600' };
      case 4: return { icon: <Frown className="w-5 h-5 text-orange-500" />, label: 'Stressed', color: 'text-orange-600' };
      case 5: return { icon: <Frown className="w-5 h-5 text-rose-500" />, label: 'Exhausted', color: 'text-rose-600' };
      default: return { icon: <Meh />, label: 'Unknown', color: 'text-slate-400' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Intelligence Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Milo Crisis Alerts</p>
           <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-rose-600">{outbreakAlerts.filter(a => a.type === 'wellness-crisis').length}</span>
              <div className="p-3 bg-blue-50 rounded-2xl">
                 <Dog className="w-6 h-6 text-blue-500" />
              </div>
           </div>
           <p className="text-[10px] text-blue-600 font-bold mt-2 uppercase">AI wellness pings</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">High Stress Alerts</p>
           <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-rose-600">{highStressChecks.length}</span>
              <div className="p-3 bg-rose-50 rounded-2xl">
                 <AlertCircle className="w-6 h-6 text-rose-500" />
              </div>
           </div>
           <p className="text-[10px] text-rose-600 font-bold mt-2 uppercase">Critical Interventions needed</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Interventions Active</p>
           <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-blue-600">8</span>
              <div className="p-3 bg-blue-50 rounded-2xl">
                 <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
           </div>
           <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tight">Across 12 Grades</p>
        </div>

        <div className="bg-emerald-600 text-white rounded-3xl p-5 shadow-xl shadow-emerald-200 flex flex-col justify-between">
           <div className="flex justify-between items-start">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 text-emerald-100">School Sentiment</p>
              <Heart className="w-5 h-5 fill-white/20" />
           </div>
           <div>
              <p className="text-xl font-bold italic tracking-tighter">"Resilient & Focused"</p>
              <p className="text-[10px] mt-1 opacity-70">Based on 850 weekly check-ins</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-800 italic tracking-tighter uppercase">Emotional Pulse Registry</h2>
              <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                 <button 
                  onClick={() => setFilter('high-stress')} 
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition ${filter === 'high-stress' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    High Risk
                 </button>
                 <button 
                  onClick={() => setFilter('all')} 
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition ${filter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    All Logs
                 </button>
              </div>
           </div>

           <div className="space-y-4">
              <AnimatePresence>
                {outbreakAlerts.filter(a => a.type === 'wellness-crisis').map(alert => (
                  <motion.div 
                    key={alert.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="p-6 bg-blue-900 text-white rounded-[2rem] border-4 border-blue-400/30 shadow-2xl relative overflow-hidden group mb-4"
                  >
                     <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                        <Dog className="w-20 h-20" />
                     </div>
                     <div className="flex items-start gap-4 relative z-10">
                        <div className="p-3 bg-white rounded-2xl text-blue-900 shadow-xl">
                           <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                           <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-200 mb-1">Emergency Crisis Feed (Milo)</h4>
                           <p className="text-lg font-bold leading-tight mb-3 italic">"{alert.description}"</p>
                           <div className="flex gap-2">
                              <button 
                                onClick={() => onAction?.('Milo Secure Log Access')}
                                className="px-4 py-2 bg-white text-blue-900 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition"
                              >
                                 Open Secure Chat Logs
                              </button>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {displayChecks.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] p-20 text-center">
                   <ShieldCheck className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active high-stress alerts</p>
                </div>
              ) : (
                displayChecks.map(check => {
                  const mood = getMoodConfig(check.level);
                  return (
                    <motion.div 
                      key={check.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:shadow-xl transition-shadow group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${check.level >= 4 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'}`}>
                              {check.studentName.charAt(0)}
                           </div>
                           <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-black text-slate-800 leading-none">{check.studentName}</h4>
                                <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">{check.grade}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="flex items-center gap-1.5">
                                    {mood.icon}
                                    <span className={`text-[10px] font-black uppercase ${mood.color}`}>{mood.label} Status</span>
                                 </div>
                                 <span className="text-slate-200">|</span>
                                 <div className="flex items-center gap-1.5 text-slate-400">
                                    <Clock className="w-3 h-3" />
                                    <span className="text-[10px] font-bold">Checked in {check.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-3">
                           <button 
                            onClick={() => onAction?.('Counseling Session', check.studentName)}
                            className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition"
                           >
                              <MessageSquare className="w-4 h-4" />
                              Counsel
                           </button>
                           <button 
                            onClick={() => onAction?.('Emergency Contact Call', check.studentName)}
                            className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition group-hover:bg-slate-200"
                           >
                              <PhoneCall className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <GlassCard title="Counselor Intelligence" icon={<TrendingDown className="w-5 h-5 text-indigo-500" />}>
              <div className="space-y-6">
                 <div className="p-5 rounded-3xl bg-indigo-50 border border-indigo-100">
                    <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-3">Weekly Focus</h4>
                    <p className="text-xs text-indigo-700/80 leading-relaxed font-medium">
                       Examination stress is trending upward in Grade 5 sections. Recommendation: Request "Mindfulness Breaks" for all teachers in Block A.
                    </p>
                    <button 
                      onClick={() => onAction?.('Global Mindfulness Execution')}
                      className="mt-4 w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition"
                    >
                       Execute Global Recommendation
                    </button>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Recent Interventions</h4>
                    <div className="space-y-2">
                       {[
                         { name: 'Sarah Yeoh', time: '1h ago', status: 'In Progress' },
                         { name: 'Muhammed Ali', time: 'Yesterday', status: 'Completed' },
                       ].map((it, i) => (
                         <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-xs text-slate-500 border border-slate-100">
                               {it.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                               <p className="text-[10px] font-bold text-slate-800">{it.name}</p>
                               <p className="text-[9px] text-slate-400 font-medium">{it.time}</p>
                            </div>
                            <span className="text-[8px] font-black uppercase text-indigo-600">{it.status}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </GlassCard>

           <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Activity className="w-24 h-24" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-6 text-slate-400">Privacy Shield Active</h4>
              <p className="text-xs font-medium text-slate-300 leading-relaxed italic mb-6">
                "AsTech counselor data is encrypted. These logs are strictly confidential and shared only with the designated Health Principal."
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-400">
                 <CheckCircle2 className="w-4 h-4" />
                 GDPR & PDPA Compliant
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
