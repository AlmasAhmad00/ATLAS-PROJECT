import React from 'react';
import { User, ClinicVisit, OutbreakAlert } from '../types';
import { GlassCard } from './GlassCard';
import { ThermalPedagogy } from './ThermalPedagogy';
import { 
  Droplets, 
  Siren, 
  ClipboardList, 
  Sparkles, 
  Zap, 
  Wind, 
  Brain, 
  Timer, 
  ShieldAlert,
  MoveHorizontal
} from 'lucide-react';
import { ClinicReferralForm } from './ClinicReferralForm';
import { motion, AnimatePresence } from 'motion/react';

interface TeacherDashboardProps {
  students: User[];
  onAddVisit: (studentId: string, reason: string) => void;
  visits: ClinicVisit[];
  temperature: number;
  allGrades?: string[];
  classroomAlerts?: OutbreakAlert[];
  onResolveAlert?: (id: string) => void;
  onStartMindfulness?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  students, 
  onAddVisit, 
  visits,
  temperature,
  allGrades,
  classroomAlerts = [],
  onResolveAlert,
  onStartMindfulness
}) => {
  const teacherVisits = visits.filter(v => v.referrerId === 'teacher_current'); // Assuming current teacher

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {classroomAlerts.length > 0 && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {classroomAlerts.map(alert => (
              <div key={alert.id} className={`p-6 rounded-[2.5rem] flex items-start gap-4 border-2 shadow-xl ${
                alert.type === 'low-hygiene' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-indigo-600 border-indigo-400 text-white'
              }`}>
                {alert.type === 'low-hygiene' ? <Sparkles className="w-8 h-8" /> : <Brain className="w-8 h-8" />}
                <div className="flex-1">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{alert.severity} Intelligence</span>
                      <ShieldAlert className="w-4 h-4" />
                   </div>
                   <h4 className="text-xl font-black italic tracking-tighter mb-2">{alert.title}</h4>
                   <p className="text-xs font-medium opacity-90 leading-relaxed mb-4">{alert.description}</p>
                   <button 
                    onClick={() => onResolveAlert?.(alert.id)}
                    className="w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition shadow-lg"
                   >
                      {alert.suggestedAction}
                   </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <ThermalPedagogy temperature={temperature} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <GlassCard title="Clinic Referral System" icon={<Siren className="w-5 h-5 text-red-500" />}>
            <ClinicReferralForm students={students} onAddVisit={onAddVisit} allGrades={allGrades} />
          </GlassCard>

          <GlassCard title="Classroom Hydration Status" icon={<Droplets className="w-5 h-5 text-blue-500" />}>
            <div className="space-y-3">
              {students.slice(0, 4).map((student, i) => (
                <div key={student.id} className="p-4 rounded-2xl bg-white/40 border border-white/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{student.fullName}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      i % 3 === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {i % 3 === 0 ? 'Hydrated' : 'Reminder Sent'}
                    </span>
                  </div>
                  {student.emergencyContact && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium bg-slate-50/50 p-2 rounded-lg">
                      <span className="font-bold text-slate-700">Emerg:</span>
                      <span>{student.emergencyContact.name} ({student.emergencyContact.relationship})</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-blue-600 font-bold">{student.emergencyContact.phone}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard title="Global Health Vitals" icon={<Zap className="w-5 h-5 text-amber-500" />}>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[10px] font-black uppercase text-slate-400 mb-1">CO2 Levels</p>
                   <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-slate-800">420 ppm</span>
                      <Wind className="w-4 h-4 text-emerald-500" />
                   </div>
                   <p className="text-[8px] text-emerald-600 font-bold uppercase mt-1">Excellent Air quality</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Stress Index</p>
                   <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-slate-800">Moderate</span>
                      <Brain className="w-4 h-4 text-amber-500" />
                   </div>
                   <button 
                    onClick={onStartMindfulness}
                    className="text-[8px] text-blue-600 font-black uppercase mt-1 flex items-center gap-1 hover:underline"
                   >
                      <Timer className="w-3 h-3" /> Start Mindfulness
                   </button>
                </div>
             </div>
          </GlassCard>

          <h3 className="text-xl font-bold text-slate-800">Your Recent Referrals</h3>
          <div className="space-y-4">
            {teacherVisits.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-400 font-medium">No recent clinic referrals.</p>
              </div>
            ) : (
              teacherVisits.map(visit => (
                <div key={visit.id} className="p-5 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800">{visit.studentName}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${
                      visit.status === 'referred-to-clinic' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      visit.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {visit.status.replace(/-/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 italic">"{visit.reason}"</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {visit.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
