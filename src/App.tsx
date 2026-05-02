/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { UserRole, Zone } from './types';
import { Layout } from './components/Layout';
import { GateSentinel } from './components/GateSentinel';
import { ThermalPedagogy } from './components/ThermalPedagogy';
import { PrincipalDashboard } from './components/PrincipalDashboard';
import { ClerkDashboard } from './components/ClerkDashboard';
import { CounselorDashboard } from './components/CounselorDashboard';
import { GlassCard } from './components/GlassCard';
import { SchoolMap } from './components/SchoolMap';
import { Shield, BookOpen, AlertCircle, Droplets, MapPin, Zap, Siren, Volume2, UserPlus, Info, Users } from 'lucide-react';

const MOCK_ZONES: Zone[] = [
  { id: '1', name: 'Classroom 4 KA 2', type: 'indoor', temperature: 33, humidity: 65 },
  { id: '2', name: 'Main Gate', type: 'outdoor', temperature: 36, humidity: 40 },
  { id: '3', name: 'Cafeteria', type: 'indoor', temperature: 25, humidity: 55 },
  { id: '4', name: 'Playground', type: 'outdoor', temperature: 34, humidity: 45 },
  { id: '5', name: 'Library', type: 'indoor', temperature: 24, humidity: 50 },
  { id: '6', name: 'Science Lab', type: 'indoor', temperature: 28, humidity: 60 },
  { id: '7', name: 'Hallway East', type: 'indoor', temperature: 31, humidity: 50 },
  { id: '8', name: 'Staff Lounge', type: 'indoor', temperature: 26, humidity: 55 },
];

import { TeacherDashboard } from './components/TeacherDashboard';
import { ClinicReferralForm } from './components/ClinicReferralForm';
import { StudentDashboard } from './components/StudentDashboard';
import { ClinicVisit, TransportationSlot, User, WaterLog, OutbreakAlert, ClinicInventoryItem, HygieneLog, StressCheck, GlobalHealthBrief, HealthForecast } from './types';
import { analyzeSymptomTrend } from './services/healthIntelligenceService';

const GRADES = [
  '4 KA 1', '4 KA 2', '4 KA 3', '4 KE 1', '4 KE 2', '4 KM 1', '4 KM 2', '4 KM 3', '4 AG 1', '4 AG 2', '4 PD',
  '5 KA 1', '5 KA 2', '5 KA 3', '5 KE 1', '5 KE 2', '5 KM 1', '5 KM 2', '5 KM 3', '5 AG 1', '5 AG 2',
  '5 PD'
];

const MOCK_STUDENTS: User[] = [
  { 
    id: 'st1', 
    fullName: 'Siti Humaira Binti Mohd Khusairi', 
    role: 'student', 
    grade: '5 PD',
    emergencyContact: { name: 'En. Mohd Khusairi', relationship: 'Father', phone: '017-4551348' },
    hydrationLevel: 85,
    totalWaterIntake: 1500
  },
  { 
    id: 'st2', 
    fullName: 'Nur Ariesya Binti Hasbi', 
    role: 'student', 
    grade: '5 KA 3',
    emergencyContact: { name: 'Pn. Zahra', relationship: 'Mother', phone: '013-9876543' },
    hydrationLevel: 35,
    totalWaterIntake: 450
  },
  { 
    id: 'st3', 
    fullName: 'Nur Farah Fatini Binti Mohd Effendi', 
    role: 'student', 
    grade: '5 KA 1',
    emergencyContact: { name: 'En. Effendi', relationship: 'Father', phone: '011-2233445' },
    hydrationLevel: 42,
    totalWaterIntake: 600
  },
  { 
    id: 'st4', 
    fullName: 'Ain Nur Syaninah Binti Faizul Nazreen', 
    role: 'student', 
    grade: '5 KA 2',
    emergencyContact: { name: 'Ms. Fatmawaty', relationship: 'Mother', phone: '018-97567866' },
    hydrationLevel: 70,
    totalWaterIntake: 1200
  },
  { 
    id: 'st5', 
    fullName: 'Muhayra Almas Syifa Binti Ahmad Suhaimi', 
    role: 'student', 
    grade: '5 KA 2',
    emergencyContact: { name: 'Mr. Suhaimi', relationship: 'Father', phone: '016-5374080' },
    hydrationLevel: 55,
    totalWaterIntake: 800
  },
  { 
    id: 'st6', 
    fullName: 'Nur Farah Alesya Binti Fazlisyam', 
    role: 'student', 
    grade: '5 KA 2',
    emergencyContact: { name: 'Mr. Fazlisyam', relationship: 'Father', phone: '017-1122334' },
    hydrationLevel: 25,
    totalWaterIntake: 300
  },
  { 
    id: 'st7', 
    fullName: 'Amysha Nur Hani', 
    role: 'student', 
    grade: '5 KA 2',
    emergencyContact: { name: 'Pn. Sofia', relationship: 'Mother', phone: '016-4455667' },
    hydrationLevel: 48,
    totalWaterIntake: 700
  },
  { 
    id: 'st8', 
    fullName: 'Nur Haifa Najihah', 
    role: 'student', 
    grade: '5 PD',
    emergencyContact: { name: 'Pn. Zahara', relationship: 'Mother', phone: '012-3344556' },
    hydrationLevel: 60,
    totalWaterIntake: 900
  },
  { 
    id: 'st9', 
    fullName: 'Nur Aimuni Faqihah', 
    role: 'student', 
    grade: '5 AG 2',
    emergencyContact: { name: 'En. Faqih', relationship: 'Father', phone: '013-4455667' },
    hydrationLevel: 55,
    totalWaterIntake: 800
  },
  { 
    id: 'st10', 
    fullName: 'Asura Krid', 
    role: 'student', 
    grade: '5 KA 1',
    emergencyContact: { name: 'Mr. Krid', relationship: 'Father', phone: '014-5566778' },
    hydrationLevel: 70,
    totalWaterIntake: 1200
  },
  { 
    id: 'st11', 
    fullName: 'Mohd Hatim Ammar', 
    role: 'student', 
    grade: '5 KA 1',
    emergencyContact: { name: 'En. Ammar', relationship: 'Father', phone: '015-6677889' },
    hydrationLevel: 45,
    totalWaterIntake: 600
  },
  { 
    id: 'st12', 
    fullName: 'Putra Seri Iskandar', 
    role: 'student', 
    grade: '5 KA 2',
    emergencyContact: { name: 'En. Iskandar', relationship: 'Father', phone: '016-7788990' },
    hydrationLevel: 80,
    totalWaterIntake: 1500
  },
  { 
    id: 'st13', 
    fullName: 'Nur Wafa Qistina', 
    role: 'student', 
    grade: '5 KM 3',
    emergencyContact: { name: 'Pn. Qistina', relationship: 'Mother', phone: '017-8899001' },
    hydrationLevel: 30,
    totalWaterIntake: 450
  },
  { 
    id: 'st14', 
    fullName: 'Chong Wei Khang', 
    role: 'student', 
    grade: '4 KE 1',
    emergencyContact: { name: 'Mr. Chong', relationship: 'Father', phone: '015-7788990' },
    hydrationLevel: 62,
    totalWaterIntake: 900
  },
  { 
    id: 'st15', 
    fullName: 'Danial Irfan', 
    role: 'student', 
    grade: '5 KM 1',
    emergencyContact: { name: 'En. Irfan', relationship: 'Father', phone: '014-2233445' },
    hydrationLevel: 31,
    totalWaterIntake: 400
  },
  { 
    id: 'st16', 
    fullName: 'Esha Pillay', 
    role: 'student', 
    grade: '5 AG 2',
    emergencyContact: { name: 'Mr. Pillay', relationship: 'Father', phone: '011-3344556' },
    hydrationLevel: 58,
    totalWaterIntake: 850
  },
  { 
    id: 'st17', 
    fullName: 'Farhan Hakim', 
    role: 'student', 
    grade: '4 KE 2',
    emergencyContact: { name: 'En. Hakim', relationship: 'Father', phone: '012-7788991' },
    hydrationLevel: 75,
    totalWaterIntake: 1100
  },
  { 
    id: 'st18', 
    fullName: 'Goh Mei Zhen', 
    role: 'student', 
    grade: '4 KM 3',
    emergencyContact: { name: 'Mr. Goh', relationship: 'Father', phone: '013-3344557' },
    hydrationLevel: 15,
    totalWaterIntake: 200
  },
  { 
    id: 'st19', 
    fullName: 'Hana Alisya', 
    role: 'student', 
    grade: '5 KA 1',
    emergencyContact: { name: 'Pn. Alisya', relationship: 'Mother', phone: '014-9988776' },
    hydrationLevel: 90,
    totalWaterIntake: 1800
  }
];

import { LandingPage } from './components/LandingPage';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [role, setRole] = useState<UserRole>('principal');
  const [showMapModal, setShowMapModal] = useState(false);
  const [autoAnnouncement, setAutoAnnouncement] = useState<string | null>(null);
  const [students, setStudents] = useState<User[]>(MOCK_STUDENTS);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [stressChecks, setStressChecks] = useState<StressCheck[]>([
    {
      id: 'sc1',
      studentId: 'st6',
      studentName: 'Aiman Hafiz',
      grade: '4 KA 1',
      level: 4,
      status: 'pending',
      timestamp: new Date(Date.now() - 1000 * 60 * 60)
    },
    {
      id: 'sc2',
      studentId: 'st2',
      studentName: 'Nur Ariesya Binti Hasbi',
      grade: '5 KA 3',
      level: 5,
      status: 'pending',
      timestamp: new Date(Date.now() - 1000 * 60 * 120)
    }
  ]);
  
  const logStressCheck = (level: number) => {
    // Mock user st1
    const user = students.find(s => s.id === 'st1') || students[0];
    const newCheck: StressCheck = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: user.id,
      studentName: user.fullName,
      grade: user.grade || 'Unknown',
      level,
      status: 'pending',
      timestamp: new Date()
    };
    setStressChecks(prev => [newCheck, ...prev]);
  };
  
  const addWaterLog = (amountMl: number, imageUrl: string, isVerified: boolean, analysis: string) => {
    const newLog: WaterLog = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: 'curr_student', // Mock current user
      amountMl,
      imageUrl,
      timestamp: new Date(),
      isVerified,
      status: isVerified ? 'verified' : 'flagged',
      aiAnalysis: analysis
    };
    setWaterLogs(prev => [newLog, ...prev]);
    
    if (isVerified) {
      setStudents(prev => prev.map(s => {
        if (s.id === 'st1') { // Mocking st1 as the main user for demo
          const newIntake = (s.totalWaterIntake || 0) + amountMl;
          const newLevel = Math.min(100, (s.hydrationLevel || 0) + 10);
          return { ...s, totalWaterIntake: newIntake, hydrationLevel: newLevel };
        }
        return s;
      }));
    }
  };
  
  // Monitoring zones for auto-announcements
  useEffect(() => {
    const criticalZones = MOCK_ZONES.filter(z => z.temperature >= 37);
    if (criticalZones.length > 0) {
      const zoneNames = criticalZones.map(z => z.name).join(', ');
      setAutoAnnouncement(`AUTOMATIC ALERT: Critical temperature detected in ${zoneNames}. AI recommends immediate evacuation to indoor cool zones.`);
    } else {
      setAutoAnnouncement(null);
    }
  }, []);
  const [visits, setVisits] = useState<ClinicVisit[]>([
    {
      id: 'v1',
      studentId: 'st1',
      studentName: 'Ahmad bin Salleh',
      referrerId: 't1',
      reason: 'Biometric Alert: Conjunctivitis (Pink Eye) signs detected by Gate AI.',
      visitType: 'eye-infection',
      status: 'in-progress',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: 'v2',
      studentId: 'st3',
      studentName: 'Kevin Lim',
      referrerId: 't2',
      reason: 'Cluster Detection: 3rd respiratory referral in Grade 5 KA 1 this morning.',
      visitType: 'respiratory',
      status: 'pending',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const [outbreakAlerts, setOutbreakAlerts] = useState<OutbreakAlert[]>([
    {
      id: 'a1',
      type: 'symptom-cluster',
      severity: 'high',
      title: 'Localized Respiratory Cluster',
      description: '5 students in Grade 4 KM 2 are displaying coughing and wheezing patterns. AI predicts contagious spread.',
      affectedGroup: 'Grade 4 KM 2',
      suggestedAction: 'Isolate block and initiate remote learning for this section.',
      timestamp: new Date()
    },
    {
      id: 'a2',
      type: 'low-hygiene',
      severity: 'moderate',
      title: 'Hygiene Compliance Deficit',
      description: 'Block B sanitizer usage has dropped below 15% threshold during flu season.',
      affectedGroup: 'Block B',
      suggestedAction: 'Trigger school-wide hygiene break and teacher notifications.',
      timestamp: new Date()
    }
  ]);

  const [inventory] = useState<ClinicInventoryItem[]>([
    { id: 'i1', name: 'Adhesive Bandages (Assorted)', quantity: 250, unit: 'units', lowStockThreshold: 100 },
    { id: 'i2', name: 'Sterile Gauze Pads (4x4)', quantity: 45, unit: 'packs', lowStockThreshold: 20 },
    { id: 'i3', name: 'N95 Respirators', quantity: 500, unit: 'units', lowStockThreshold: 200 },
    { id: 'i4', name: 'Elastic Pressure Wraps', quantity: 15, unit: 'units', lowStockThreshold: 10 },
    { id: 'i5', name: 'Antiseptic Cleansing Wipes', quantity: 120, unit: 'units', lowStockThreshold: 50 },
    { id: 'i6', name: 'First Aid Medical Tape', quantity: 12, unit: 'rolls', lowStockThreshold: 5 }
  ]);

  const [hygieneLogs] = useState<HygieneLog[]>([
    { id: 'l1', zoneId: 'zone-1', usageCount: 42, type: 'sanitizer', timestamp: new Date() },
    { id: 'l2', zoneId: 'zone-3', usageCount: 156, type: 'handwash', timestamp: new Date() },
    { id: 'l3', zoneId: 'zone-5', usageCount: 8, type: 'sanitizer', timestamp: new Date() }
  ]);

  const [healthForecasts, setHealthForecasts] = useState<HealthForecast[]>([]);

  const [globalHealthBriefs] = useState<GlobalHealthBrief[]>([
    {
      id: 'g1',
      source: 'WHO Intelligence',
      title: 'Variant B.1.x Surveillance',
      summary: 'Monitoring new respiratory variant in Southeast Asia. Current local risk remains low but vigilance for symptom clusters is advised.',
      riskLevel: 'low',
      region: 'Global/SEA',
      timestamp: new Date()
    },
    {
      id: 'g2',
      source: 'CDC Global Feed',
      title: 'Dengue Outbreak Vector Alert',
      summary: 'Increased mosquito activity reported in tropical zones. Advise school-wide repellent protocols and standing water clearance.',
      riskLevel: 'moderate',
      region: 'Equatorial Zones',
      timestamp: new Date()
    }
  ]);

  const [transportSlots, setTransportSlots] = useState<TransportationSlot[]>([
    { id: 'slot1', time: '09:00 AM', maxCapacity: 10, assignedStudentIds: [], status: 'scheduled' },
    { id: 'slot2', time: '11:30 AM', maxCapacity: 10, assignedStudentIds: [], status: 'scheduled' },
    { id: 'slot3', time: '02:30 PM', maxCapacity: 10, assignedStudentIds: [], status: 'scheduled' },
  ]);

  const addVisit = async (studentId: string, reason: string, symptoms: string[] = [], referrerId: string = 'clerk1') => {
    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    if (!student) return;

    const newVisit: ClinicVisit = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: student.id,
      studentName: student.fullName,
      studentGrade: student.grade,
      referrerId,
      reason,
      symptoms,
      status: 'pending',
      timestamp: new Date(),
    };
    
    setVisits(prev => {
      const updated = [newVisit, ...prev];
      // Trigger AI Analysis in background
      if (symptoms.length > 0) {
        analyzeSymptomTrend(updated).then(forecast => {
          if (forecast) setHealthForecasts(f => [forecast, ...f]);
        });
      }
      return updated;
    });
  };

  const updateVisitStatus = (id: string, status: ClinicVisit['status']) => {
    setVisits(prev => prev.map(v => v.id === id ? { ...v, status } : v));
  };

  const handleMiloAlert = (alertText: string) => {
    const newAlert: OutbreakAlert = {
      id: `milo-${Date.now()}`,
      type: 'wellness-crisis',
      severity: 'critical',
      title: 'Milo Wellness Alert',
      description: alertText,
      affectedGroup: 'Student Wellness Portal',
      suggestedAction: 'Immediate counselor/teacher check-in requested.',
      timestamp: new Date()
    };
    setOutbreakAlerts(prev => [newAlert, ...prev]);
  };

  const assignToSlot = (visitId: string, slotId: string) => {
    setTransportSlots(prev => prev.map(slot => {
      if (slot.id === slotId) {
        return { ...slot, assignedStudentIds: [...slot.assignedStudentIds, visitId] };
      }
      return slot;
    }));
    setVisits(prev => prev.map(v => v.id === visitId ? { ...v, transportationSlotId: slotId, status: 'referred-to-clinic' } : v));
  };

  const resolveAlert = (id: string) => {
    setOutbreakAlerts(prev => prev.filter(a => a.id !== id));
    showNotification("Alert resolved and archive updated.");
  };

  const renderDashboard = () => {
    switch (role) {
      case 'principal':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-3xl font-black text-slate-800">Campus Oversight</h2>
                <p className="text-slate-500 font-medium">Monitoring 2,400 Students • 12 Active Sensors</p>
              </div>
              <button 
                onClick={() => setShowMapModal(true)}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-slate-800 transition"
              >
                View Full Map Board
              </button>
            </div>
            {showMapModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-6xl relative animate-in zoom-in-95 duration-200">
                  <SchoolMap 
                    zones={MOCK_ZONES} 
                    onClose={() => setShowMapModal(false)} 
                  />
                </div>
              </div>
            )}
            <PrincipalDashboard 
              zones={MOCK_ZONES} 
              outbreakAlerts={outbreakAlerts}
              inventory={inventory}
              hygieneLogs={hygieneLogs}
              globalHealthBriefs={globalHealthBriefs}
              onResolveAlert={resolveAlert}
              onGenerateReport={(type) => showNotification(`${type} Report generated and sent to PPD.`)}
            />
          </div>
        );
      
      case 'counselor':
        return (
          <CounselorDashboard 
            stressChecks={stressChecks} 
            students={students} 
            outbreakAlerts={outbreakAlerts} 
            onAction={(type, student) => showNotification(`${type} initiated for ${student || 'selected target'}.`)}
          />
        );

      case 'clerk':
        return (
          <ClerkDashboard 
            visits={visits} 
            slots={transportSlots}
            onUpdateStatus={updateVisitStatus}
            onAssignSlot={assignToSlot}
            onAddVisit={(s, r) => addVisit(s, r, [], 'clerk_hub')}
            students={MOCK_STUDENTS}
            allGrades={GRADES}
            onNotify={(msg) => showNotification(msg)}
          />
        );

      case 'teacher':
        return (
          <div className="space-y-8">
            <TeacherDashboard 
              students={students.filter(s => s.grade === '5 KA 1' || s.grade === '5 PD')} 
              onAddVisit={addVisit} 
              visits={visits}
              temperature={MOCK_ZONES[0].temperature}
              allGrades={GRADES}
              classroomAlerts={outbreakAlerts.filter(a => a.affectedGroup.includes('KA') || a.affectedGroup.includes('Block B'))}
              onResolveAlert={resolveAlert}
              onStartMindfulness={() => showNotification("Mindfulness session broadcast to classroom speakers.")}
            />
            <ThermalPedagogy onNotify={(msg) => showNotification(msg)} />
          </div>
        );

      case 'guard':
        return (
          <div className="space-y-8">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-display font-black text-slate-800">Entrance Health Sentinel</h2>
              <p className="text-slate-500 font-medium max-w-lg mx-auto">AI-powered biometric scanning interface for immediate detection of heat-related stress markers.</p>
            </div>
            <GateSentinel />
          </div>
        );

      case 'warden':
        return (
          <div className="space-y-8">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-3xl font-display font-black text-slate-800">Transition & Session Safety</h2>
                <p className="text-slate-500 font-medium">Warden Oversight Active: Transition Periods & Afterschool.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => showNotification("School-wide announcement broadcast initiated.")}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-red-700 transition"
                >
                  <Volume2 className="w-4 h-4" />
                  Make Announcement
                </button>
              </div>
            </div>

            {autoAnnouncement && (
              <div className="p-6 bg-red-600 text-white rounded-3xl shadow-xl animate-pulse flex items-center gap-6 border-4 border-red-400/50">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Volume2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest mb-1 text-red-100">AI Automatic Broadcast</h4>
                  <p className="text-xl font-bold">{autoAnnouncement}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-10">
                    <Volume2 className="w-32 h-32" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        <h3 className="text-lg font-bold uppercase tracking-[0.2em] text-yellow-400">AI Warden Advisor</h3>
                    </div>
                    <div className="max-w-2xl">
                      <p className="text-2xl font-light leading-relaxed mb-6">
                        Ground temperature in Playground has reached <span className="text-rose-400 font-bold">34°C</span>. 
                        Recommend immediate announcement: <span className="italic text-slate-300">"All outdoor activity must cease. Move to Library or Assembly Hall."</span>
                      </p>
                      <div className="flex gap-4">
                          <button 
                            onClick={() => showNotification("Broadcast sent to PA System: Outdoor activity restricted.")}
                            className="px-6 py-3 bg-blue-600 rounded-xl font-bold text-sm hover:bg-blue-700 transition"
                          >
                            Broadcast to PA System
                          </button>
                          <button 
                            onClick={() => showNotification("Warden action logged in security registry.")}
                            className="px-6 py-3 border border-slate-700 rounded-xl font-bold text-sm hover:bg-slate-800 transition"
                          >
                            Log Action
                          </button>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {MOCK_ZONES.filter(z => z.type === 'outdoor' || z.temperature >= 31).map(zone => (
                    <GlassCard key={zone.id} title={zone.name} icon={<MapPin className="w-5 h-5" />}>
                      <div className={`p-6 rounded-3xl border-2 ${
                        zone.temperature >= 32 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                      } space-y-4`}>
                        <div className="flex justify-between items-center">
                          <p className="text-2xl font-black text-slate-800">{zone.temperature}°C</p>
                          <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            zone.temperature >= 32 ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'
                          }`}>
                            {zone.temperature >= 32 ? 'Evacuation Priority' : 'Monitoring'}
                          </span>
                        </div>
                        <div className="space-y-4">
                          <p className="text-xs text-slate-600 font-medium text-balance">
                            {zone.temperature >= 32 
                              ? 'Action: Ground temperature critical. Log clinic entries for students appearing fatigued.' 
                              : 'Action: Transition safety check. Ensure students maintain hydration paths.'}
                          </p>
                          <button 
                            onClick={() => showNotification(`Clinic transfer request logged for ${zone.name}.`)}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-800 hover:bg-slate-50 transition shadow-sm"
                          >
                            <Siren className="w-4 h-4 text-red-500" />
                            Log Student Clinic Transfer
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <GlassCard title="High Risk Students" icon={<Users className="w-5 h-5 text-red-600" />}>
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500 font-medium">Students in critical zones or showing heat stress signs. Contact guardians immediately if condition worsens.</p>
                    {MOCK_STUDENTS.slice(0, 3).map((student) => (
                      <div key={student.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800">{student.fullName}</span>
                          <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Risk: High</span>
                        </div>
                        {student.emergencyContact && (
                          <div className="bg-white p-3 rounded-xl border border-slate-100 space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Emergency Contact</p>
                            <p className="text-sm font-bold text-slate-700 truncate">{student.emergencyContact.name} ({student.emergencyContact.relationship})</p>
                            <a href={`tel:${student.emergencyContact.phone}`} className="text-blue-600 font-black text-xs hover:underline flex items-center gap-1">
                              <Zap className="w-3 h-3 fill-blue-600" />
                              {student.emergencyContact.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </GlassCard>
                <GlassCard title="Emergency Clinic Referral" icon={<Siren className="w-5 h-5 text-red-600" />}>
                  <ClinicReferralForm 
                    students={MOCK_STUDENTS} 
                    onAddVisit={(s, r) => addVisit(s, r, [], 'warden_field')}
                    allGrades={GRADES}
                    description="Immediate field referral for students showing critical heat symptoms during transition."
                  />
                </GlassCard>
              </div>
            </div>
          </div>
        );

      case 'student':
        return (
          <StudentDashboard 
            currentUser={students.find(s => s.id === 'st1') || students[0]} 
            allStudents={students}
            onLogWater={addWaterLog}
            onLogStress={logStressCheck}
            onMiloAlert={handleMiloAlert}
            waterLogs={waterLogs}
            zones={MOCK_ZONES}
          />
        );

      default:
        return <div>Select a role to continue.</div>;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!hasStarted ? (
        <LandingPage key="landing" onStart={() => setHasStarted(true)} />
      ) : (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="min-h-screen"
        >
          <Layout 
            role={role} 
            onRoleChange={setRole} 
            healthForecasts={healthForecasts}
            onDismissForecast={() => setHealthForecasts(prev => prev.slice(1))}
          >
            {renderDashboard()}
            
            {/* Global notification toast */}
            <AnimatePresence>
              {notification && (
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest">{notification}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Layout>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const ActivityCard = ({ title, desc, icon }: { title: string; desc: string; icon: any }) => (
  <div className="p-4 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/15 transition cursor-pointer">
    <div className="flex items-center gap-2 mb-2">
      <div className="p-1 px-2 rounded-lg bg-emerald-700/50 text-emerald-300">
        {icon}
      </div>
      <h4 className="font-bold text-sm">{title}</h4>
    </div>
    <p className="text-xs text-emerald-100/70 leading-relaxed font-medium">{desc}</p>
  </div>
);

