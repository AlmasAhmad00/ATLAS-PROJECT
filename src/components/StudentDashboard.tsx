import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { User, WaterLog } from '../types';
import { 
  Droplets, 
  Camera, 
  Trophy, 
  Crown, 
  Users, 
  Zap, 
  Info, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Timer,
  RefreshCw,
  Flame,
  ShieldAlert,
  Brain,
  Smile,
  Meh,
  Frown,
  Activity
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { MiloBot } from './MiloBot';

interface StudentDashboardProps {
  currentUser: User;
  allStudents: User[];
  onLogWater: (amountMl: number, imageUrl: string, isVerified: boolean, analysis: string) => void;
  onLogStress?: (level: number) => void;
  onMiloAlert?: (message: string) => void;
  waterLogs: WaterLog[];
  zones: any[];
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  allStudents,
  onLogWater,
  onLogStress,
  onMiloAlert,
  waterLogs,
  zones
}) => {
  const [isLogging, setIsLogging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stressLevel, setStressLevel] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sorting for leaderboard - User asked for "Hydrated King"
  // Top 5 most hydrated students
  const leaderboard = [...allStudents]
    .filter(s => s.role === 'student')
    .sort((a, b) => (b.hydrationLevel || 0) - (a.hydrationLevel || 0))
    .slice(0, 5);

  const friendsStatuses = allStudents
    .filter(s => s.role === 'student' && s.id !== currentUser.id)
    .slice(0, 4);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        runAIScan(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAIScan = async (base64Data: string) => {
    setIsScanning(true);
    setScanResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: (process.env as any).GEMINI_API_KEY });
      // Remove data:image/jpeg;base64, prefix
      const base64Content = base64Data.split(',')[1];

      const prompt = `
        Analyze this image for a school water hydration program.
        Check for:
        1. Is there a water bottle or glass of water in the image?
        2. Does this look like a duplicate of a common stock photo or a previous submission (cheat detection)?
        3. Is the environment unique?
        
        Respond in JSON format:
        {
          "isWaterVisible": boolean,
          "isDuplicate": boolean,
          "isEnvironmentGeneric": boolean,
          "analysis": "string explanation",
          "isVerified": boolean (true only if water is visible AND NOT a duplicate)
        }
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { inlineData: { data: base64Content, mimeType: "image/jpeg" } },
              { text: prompt }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || "{}");
      
      if (result.isVerified) {
        setScanResult({ success: true, message: result.analysis });
        // Simulating delay for "scanning" effect
        setTimeout(() => {
          onLogWater(250, base64Data, true, result.analysis);
          setIsLogging(false);
          setScanResult(null);
          setCapturedImage(null);
        }, 2000);
      } else {
        setScanResult({ success: false, message: `FLAGGED: ${result.analysis}` });
      }
    } catch (err) {
      console.error(err);
      setScanResult({ success: false, message: "AI Scan failed. Please try again in a well-lit area." });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* dehydration Header */}
      <section className="relative overflow-hidden rounded-[3rem] bg-linear-to-br from-slate-900 to-slate-800 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Droplets className="w-40 h-40" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-black uppercase tracking-widest">
                Personal Status
              </div>
              <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold">
                <Flame className="w-3 h-3" />
                Heat Alert: Level 2
              </div>
            </div>
            
            <h2 className="text-5xl font-black italic tracking-tighter mb-4">
              {currentUser.hydrationLevel && currentUser.hydrationLevel < 40 ? 'CRITICAL DRY' : 'STAY FROSTY'}
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hydration Balance</span>
                <span className="text-2xl font-black">{currentUser.hydrationLevel}%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${currentUser.hydrationLevel || 0}%` }}
                  className={`h-full ${
                    (currentUser.hydrationLevel || 0) < 30 ? 'bg-rose-500' : 
                    (currentUser.hydrationLevel || 0) < 60 ? 'bg-amber-500' : 'bg-blue-400'
                  }`}
                />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {(currentUser.hydrationLevel || 0) < 50 
                  ? "URGENT: Your thermal indicators are peaking. Visit a cool point immediately." 
                  : "Good progress. Maintain intake to sustain cognitive performance."}
              </p>
            </div>

            <button 
              onClick={() => setIsLogging(true)}
              className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition shadow-xl flex items-center gap-3"
            >
              <Camera className="w-5 h-5" />
              Log Water Intake
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Hydration Leaderboard
            </h3>
            <div className="space-y-4">
              {leaderboard.map((student, idx) => (
                <div key={student.id} className="flex items-center gap-4 relative">
                  {idx === 0 && (
                    <motion.div 
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="absolute -top-6 left-2 z-20"
                    >
                      <Crown className="w-8 h-8 text-amber-400 drop-shadow-lg" />
                    </motion.div>
                  )}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                    idx === 0 ? 'bg-amber-400 text-slate-900 border-2 border-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {student.fullName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold truncate">{student.fullName}</p>
                    <div className="flex items-center gap-2">
                       <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400" style={{ width: `${student.hydrationLevel}%` }} />
                       </div>
                       <span className="text-[10px] font-black text-slate-400">{student.hydrationLevel}%</span>
                    </div>
                  </div>
                  {idx === 0 && (
                    <div className="flex flex-col items-end">
                      <span className="text-[8px] font-black text-blue-400 uppercase tracking-tighter">HYDRATED KING</span>
                      <Droplets className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Friends & Social Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
           <GlassCard 
             title="Weekly Wellness Scan" 
             icon={<Brain className="w-5 h-5 text-indigo-500" />}
             className="relative overflow-hidden"
           >
              {stressLevel === null ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-800">How has your mind felt this week?</p>
                    <div className="px-2 py-1 rounded-full bg-indigo-50 text-[10px] font-black text-indigo-600 uppercase tracking-widest">ATLAS Cognitive Check</div>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { level: 1, icon: <Smile className="w-6 h-6 text-emerald-500" />, label: 'Great' },
                      { level: 2, icon: <Smile className="w-6 h-6 text-blue-500" />, label: 'Good' },
                      { level: 3, icon: <Meh className="w-6 h-6 text-amber-500" />, label: 'Okay' },
                      { level: 4, icon: <Frown className="w-6 h-6 text-orange-500" />, label: 'Stressed' },
                      { level: 5, icon: <Frown className="w-6 h-6 text-rose-500" />, label: 'Exhausted' },
                    ].map((mood) => (
                      <button 
                        key={mood.level}
                        onClick={() => {
                          setStressLevel(mood.level);
                          if (onLogStress) onLogStress(mood.level);
                        }}
                        className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                      >
                        <div className="group-hover:scale-110 transition-transform">{mood.icon}</div>
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium italic">Your response helps ATLAS suggest the right breaks for your class.</p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-6 py-4"
                >
                  <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <Brain className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-black text-slate-800 tracking-tight italic uppercase">Status Received</p>
                    <p className="text-xs text-slate-500 font-medium">
                      {stressLevel <= 2 ? "Brilliant! Let's sustain this high-performance mindset." : 
                       stressLevel === 3 ? "Acknowledged. Remember to take micro-breaks between sessions." :
                       "High load detected. ATLAS has notified your teacher to include extra stretching/mindfulness."}
                    </p>
                  </div>
                  <button 
                    onClick={() => setStressLevel(null)}
                    className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-400"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
           </GlassCard>

           <GlassCard title="Squad Hydration Status" icon={<Users className="w-5 h-5 text-blue-500" />}>
              <div className="grid grid-cols-2 gap-4">
                {friendsStatuses.map(friend => (
                  <div key={friend.id} className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black ${
                      (friend.hydrationLevel || 0) < 40 ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {friend.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{friend.fullName}</p>
                      <div className="flex items-center gap-1">
                         <Droplets className={`w-3 h-3 ${ (friend.hydrationLevel || 0) < 40 ? 'text-rose-500' : 'text-blue-500' }`} />
                         <span className="text-[10px] font-black uppercase text-slate-400">{friend.hydrationLevel}% Flow</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
           </GlassCard>

           <GlassCard title="Cooling Zones Map" icon={<MapPin className="w-5 h-5 text-emerald-500" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {zones.filter(z => z.temperature < 28).slice(0, 4).map(z => (
                  <div key={z.id} className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <div>
                      <p className="font-bold text-slate-800">{z.name}</p>
                      <p className="text-[10px] text-emerald-600 font-black uppercase tracking-wider">{z.temperature}°C • SAFE ZONE</p>
                    </div>
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                ))}
              </div>
           </GlassCard>
        </div>

        <div className="space-y-8">
           <GlassCard title="Recent Intake" icon={<ClipboardList className="w-5 h-5 text-purple-600" />}>
              <div className="space-y-4">
                {waterLogs.slice(0, 3).map(log => (
                  <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-black text-slate-800">{log.amountMl}ml</span>
                       <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                         log.status === 'verified' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                       }`}>
                         {log.status}
                       </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium line-clamp-2 italic">
                      "{log.aiAnalysis || 'Awaiting verification...'}"
                    </p>
                  </div>
                ))}
                {waterLogs.length === 0 && (
                  <div className="text-center py-8 opacity-20 italic text-xs">No entries today</div>
                )}
              </div>
           </GlassCard>

           <section className="bg-blue-600 text-white rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden">
              <div className="absolute -bottom-4 -right-4 opacity-20">
                <Trophy className="w-24 h-24" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4">Wellness Quest</h4>
              <p className="text-sm font-bold mb-4">Drink 2L to unlock "Frost Master" avatar badge.</p>
              <div className="h-1.5 bg-white/20 rounded-full">
                <div className="h-full bg-white w-1/4" />
              </div>
           </section>
        </div>
      </div>

      {/* AI Scanner Backdrop */}
      <AnimatePresence>
        {isLogging && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.9 }}
               className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl"
             >
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tighter italic uppercase flex items-center gap-3">
                    <Droplets className="text-blue-500" />
                    Hydration Log
                  </h2>
                  <button onClick={() => setIsLogging(false)} className="p-2 hover:bg-slate-100 rounded-xl transition">
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <div className="p-8 space-y-8">
                  {!capturedImage ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center cursor-pointer hover:border-blue-200 transition bg-slate-50 relative group"
                    >
                      <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition" />
                      <Camera className="w-16 h-16 text-slate-200 mb-4 group-hover:text-blue-300 transition" />
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tap to capture evidence</p>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        capture="environment"
                        onChange={handleCapture}
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                      <img src={capturedImage} className="w-full h-full object-cover" />
                      {isScanning && (
                        <div className="absolute inset-0 bg-blue-900/40 flex flex-col items-center justify-center">
                           <RefreshCw className="w-12 h-12 text-white animate-spin mb-4" />
                           <p className="text-white font-black uppercase tracking-[0.3em] text-xs">AI Scanning for Cheats...</p>
                           {/* Scanning line animation */}
                           <motion.div 
                             animate={{ top: ['0%', '100%', '0%'] }}
                             transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                             className="absolute left-0 right-0 h-1 bg-blue-400 shadow-[0_0_15px_#60A5FA] z-20"
                           />
                        </div>
                      )}
                    </div>
                  )}

                  <AnimatePresence>
                    {scanResult && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 rounded-2xl flex items-start gap-4 ${
                          scanResult.success ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'
                        }`}
                      >
                        {scanResult.success ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
                        )}
                        <div>
                          <p className={`font-black uppercase text-xs ${scanResult.success ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {scanResult.success ? 'Verified by ATLAS AI' : 'Verification Denied'}
                          </p>
                          <p className="text-xs text-slate-600 font-medium mt-1 uppercase tracking-tight leading-relaxed">
                            {scanResult.message}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {!capturedImage && (
                    <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4">
                      <ShieldAlert className="w-6 h-6 text-amber-500" />
                      <div>
                        <p className="text-amber-800 font-black uppercase text-[10px]">Anti-Cheat Protocol</p>
                        <p className="text-[10px] text-amber-700/70 font-medium">AI will analyze image metadata and visual markers to ensure authentic consumption.</p>
                      </div>
                    </div>
                  )}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Milo Wellness Bot */}
      <MiloBot 
        studentName={currentUser.fullName} 
        onSafetyAlert={(msg) => onMiloAlert && onMiloAlert(msg)} 
      />
    </div>
  );
};

const X = ({ className, onClick }: { className?: string, onClick?: () => void }) => (
  <svg onClick={onClick} className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

const ClipboardList = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
);
