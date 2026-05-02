import React, { useState } from 'react';
import { ClinicVisit, User, TransportationSlot } from '../types';
import { GlassCard } from './GlassCard';
import { Plus, UserPlus, ClipboardList, Stethoscope, CheckCircle, Search, Bus, Users, Bell, X, Phone, HeartPulse, History, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ClerkDashboardProps {
  visits: ClinicVisit[];
  slots: TransportationSlot[];
  onUpdateStatus: (id: string, status: ClinicVisit['status']) => void;
  onAssignSlot: (visitId: string, slotId: string) => void;
  onAddVisit: (studentId: string, reason: string) => void;
  students: User[];
  allGrades?: string[];
  onNotify?: (msg: string) => void;
}

import { ClinicReferralForm } from './ClinicReferralForm';

export const ClerkDashboard: React.FC<ClerkDashboardProps> = ({
  visits,
  slots,
  onUpdateStatus,
  onAssignSlot,
  onAddVisit,
  students,
  allGrades,
  onNotify
}) => {
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const notifyDrivers = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;
    onNotify?.(`Notification sent to drivers for ${slot.time} slot: ${slot.assignedStudentIds.length} students confirmed.`);
  };

  const openStudentProfile = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setSelectedStudent(student);
    }
  };

  const getRecentVisits = (studentId: string) => {
    return visits
      .filter(v => v.studentId === studentId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);
  };

  return (
    <div className="space-y-8">
      {/* Student Profile Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-start">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-3xl font-black">
                    {selectedStudent.fullName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">{selectedStudent.fullName}</h2>
                    <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mt-1">{selectedStudent.grade}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      Emergency Contact
                    </h3>
                    {selectedStudent.emergencyContact ? (
                      <div className="space-y-2">
                        <p className="text-slate-800 font-bold">{selectedStudent.emergencyContact.name}</p>
                        <p className="text-sm text-slate-500 font-medium">{selectedStudent.emergencyContact.relationship}</p>
                        <p className="text-blue-600 font-black tracking-wider mt-2">{selectedStudent.emergencyContact.phone}</p>
                      </div>
                    ) : (
                      <p className="text-slate-400 italic text-sm">No emergency contact data available.</p>
                    )}
                  </div>

                  <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100">
                    <h3 className="text-xs font-black text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <HeartPulse className="w-3 h-3" />
                      Current Health Status
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                      <div>
                        <p className="text-rose-900 font-black uppercase text-xs">Medical Observation</p>
                        <p className="text-rose-600/70 text-[10px] font-bold mt-0.5">Assigned to Clinic Registry</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 ml-2">
                    <History className="w-3 h-3" />
                    Visit History (Last 5)
                  </h3>
                  <div className="space-y-3">
                    {getRecentVisits(selectedStudent.id).map(visit => (
                      <div key={visit.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">{visit.reason}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              {visit.timestamp.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${
                          visit.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                          visit.status === 'discharged' ? 'bg-emerald-100 text-emerald-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {visit.status}
                        </span>
                      </div>
                    ))}
                    {getRecentVisits(selectedStudent.id).length === 0 && (
                      <div className="text-center py-12 opacity-30">
                        <ClipboardList className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-xs font-bold uppercase">No recent records</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="px-8 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-800 transition shadow-lg"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-slate-800">Clinic Registry & Queue</h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
              <Stethoscope className="w-3 h-3" />
              Clinic Status: Open
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="card p-4 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase mb-1">Queueing</span>
              <span className="text-2xl font-black text-amber-500">{visits.filter(v => v.status === 'pending').length}</span>
            </div>
            <div className="card p-4 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase mb-1">Waiting Transport</span>
              <span className="text-2xl font-black text-blue-400">{visits.filter(v => v.status === 'referred-to-clinic').length}</span>
            </div>
            <div className="card p-4 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase mb-1">In Clinic</span>
              <span className="text-2xl font-black text-blue-500">{visits.filter(v => v.status === 'in-progress').length}</span>
            </div>
            <div className="card p-4 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 uppercase mb-1">Discharged</span>
              <span className="text-2xl font-black text-emerald-500">{visits.filter(v => v.status === 'discharged').length}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Active Cases
            </h3>
            {visits.map((visit) => (
              <div key={visit.id} className="card p-5 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <Search className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 
                        className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer transition flex items-center gap-2 group"
                        onClick={() => openStudentProfile(visit.studentId)}
                      >
                        {visit.studentName}
                        <span className="text-[8px] opacity-0 group-hover:opacity-100 bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded uppercase tracking-tighter">View Profile</span>
                      </h4>
                      <div className="flex items-center gap-2">
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                          Logged: {visit.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {visit.transportationSlotId && (
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        )}
                        {visit.transportationSlotId && (
                          <p className="text-[8px] text-blue-500 font-bold uppercase tracking-widest">
                            Transport: {slots.find(s => s.id === visit.transportationSlotId)?.time}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    visit.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      visit.status === 'referred-to-clinic' ? 'bg-blue-100 text-blue-700' :
                        visit.status === 'in-progress' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-emerald-100 text-emerald-700'
                  }`}>
                    {visit.status.replace(/-/g, ' ')}
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed font-medium">
                  {visit.reason}
                </p>

                <div className="flex gap-2">
                  {visit.status === 'pending' && (
                    <>
                      <select 
                        className="flex-1 bg-slate-100 border border-slate-200 rounded-lg px-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => onAssignSlot(visit.id, e.target.value)}
                        value=""
                      >
                        <option value="">Assign Transport Slot...</option>
                        {slots.map(slot => (
                          <option key={slot.id} value={slot.id}>
                            {slot.time} ({slot.assignedStudentIds.length}/{slot.maxCapacity})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => onUpdateStatus(visit.id, 'in-progress')}
                        className="py-2 px-6 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition"
                      >
                        Internal Checkup
                      </button>
                    </>
                  )}
                  {visit.status === 'referred-to-clinic' && (
                    <button
                      onClick={() => onUpdateStatus(visit.id, 'in-progress')}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition"
                    >
                      Arrived at External Clinic
                    </button>
                  )}
                  {visit.status === 'in-progress' && (
                    <button
                      onClick={() => onUpdateStatus(visit.id, 'discharged')}
                      className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition"
                    >
                      Discharge Student
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <GlassCard title="Transport Dispatcher" icon={<Bus className="w-5 h-5 text-blue-600" />}>
            <div className="space-y-4">
              {slots.map(slot => (
                <div key={slot.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-slate-800">{slot.time}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      slot.assignedStudentIds.length >= slot.maxCapacity ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {slot.assignedStudentIds.length} / {slot.maxCapacity} Seats
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => notifyDrivers(slot.id)}
                      className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition flex items-center justify-center gap-2"
                    >
                      <Bell className="w-3 h-3" />
                      Notify Drivers
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard title="Register Student to Clinic" icon={<UserPlus className="w-5 h-5 text-indigo-600" />}>
            <ClinicReferralForm 
              students={students} 
              onAddVisit={onAddVisit}
              allGrades={allGrades}
              description="Direct clinic registration for walk-in students or those arriving from other campus blocks."
            />
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
