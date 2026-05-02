import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Dog, ShieldAlert, X, Lock, Wind } from 'lucide-react';
import { MiloChatMessage } from '../types';
import { getMiloResponse } from '../services/miloService';

interface MiloBotProps {
  studentName: string;
  onSafetyAlert: (message: string) => void;
}

export const MiloBot: React.FC<MiloBotProps> = ({ studentName, onSafetyAlert }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNapping, setIsNapping] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  
  const [messages, setMessages] = useState<MiloChatMessage[]>([
    {
      role: 'model',
      text: `Eh, hello! I noticed your energy is a bit mid today. Everything ngam? 🐶`,
      emoji: '🐶',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activityTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-nap logic
  useEffect(() => {
    const handleActivity = () => {
      setIsNapping(false);
      if (activityTimer.current) clearTimeout(activityTimer.current);
      activityTimer.current = setTimeout(() => setIsNapping(true), 45000); // 45s silence = nap
    };

    if (isOpen) {
      handleActivity();
      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keydown', handleActivity);
    }

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;
    
    const userMsg: MiloChatMessage = {
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await getMiloResponse(messages, textToSend);
    
    const miloMsg: MiloChatMessage = {
      role: 'model',
      text: response.text,
      emoji: response.emoji,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, miloMsg]);
    setIsLoading(false);

    if (response.safety_flag) {
      onSafetyAlert(`Milo detected a critical safety concern with ${studentName}: "${textToSend}"`);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-white border border-slate-200 text-emerald-500 rounded-full shadow-2xl flex items-center justify-center z-40 overflow-hidden group"
      >
         <Dog className="w-8 h-8" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[150] flex flex-col font-sans overflow-hidden"
          >
            {/* Ambient Background Flares (Optimized for smoothness) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ willChange: 'transform' }}>
               {/* Bottom Pink/Peach Flare */}
               <motion.div 
                 animate={{ 
                   opacity: [0.4, 0.6, 0.4],
                   scale: [1, 1.1, 1]
                 }}
                 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                 className="absolute -bottom-64 -left-32 w-[800px] h-[800px] bg-rose-100/30 rounded-full blur-[120px] will-change-transform" 
               />
               {/* Bottom Orange Flare */}
               <motion.div 
                 animate={{ 
                   opacity: [0.3, 0.5, 0.3],
                   scale: [1, 1.15, 1]
                 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
                 className="absolute -bottom-64 -right-32 w-[900px] h-[900px] bg-orange-100/40 rounded-full blur-[140px] will-change-transform" 
               />
               {/* Top Teal/Blue Flare (Static or very slow) */}
               <motion.div 
                 animate={{ 
                   opacity: [0.1, 0.2, 0.1]
                 }}
                 transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                 className="absolute -top-32 right-0 w-[600px] h-[600px] bg-teal-50/30 rounded-full blur-[100px] will-change-opacity" 
               />
            </div>

            {/* --- ATLAS CHAT WINDOW (Fullscreen Glassmorphism) --- */}
            <div className="relative flex-grow flex flex-col h-full w-full overflow-hidden" style={{ perspective: '1000px' }}>
              {/* Fixed Custom Header */}
              <header className="absolute top-0 left-0 right-0 z-50 h-24 flex items-center justify-center pointer-events-none will-change-transform">
                 <div className="px-6 py-2.5 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-full shadow-lg shadow-black/5 flex items-center gap-3 pointer-events-auto">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest whitespace-nowrap">
                      Chat with Milo (Active Now 🐶)
                    </span>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="p-1 hover:bg-slate-200/50 rounded-full transition-colors ml-2"
                    >
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                 </div>
              </header>

              {/* Main Chat Area (Scrollable Conversation) */}
              <main 
                ref={scrollRef}
                className="flex-grow overflow-y-auto px-6 py-16 pt-32 pb-40 space-y-6 scroll-smooth no-scrollbar relative w-full max-w-2xl mx-auto"
              >
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <div 
                      key={i}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                        className={`
                          relative max-w-[85%] px-6 py-3.5 rounded-[26px] text-[16px] font-medium leading-relaxed shadow-sm tracking-tight will-change-transform
                          ${msg.role === 'user' 
                            ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg shadow-indigo-100' 
                            : 'bg-white/80 backdrop-blur-xl text-slate-900 border border-white shadow-sm shadow-black/5'
                          }
                        `}
                      >
                        {msg.text}
                      </motion.div>
                      
                      {/* Counselor Nudge Nudge Indicator (Integrated) */}
                      {msg.role === 'model' && i === messages.length - 1 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="mt-2 px-3 py-1 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full shadow-sm flex items-center gap-1.5 ml-2"
                        >
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            Milo nudge to Counselor 🤫
                          </span>
                          <Lock className="w-2 h-2 text-slate-300" />
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">(🔒 Private)</span>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/40 backdrop-blur-xl px-5 py-4 rounded-[24px] border border-white/60 flex items-center gap-1.5">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                    </div>
                  </div>
                )}
              </main>

              {/* Custom Glass Input Area (Docked at bottom) */}
              <footer className="absolute bottom-8 left-0 right-0 px-6 flex justify-center z-[100] will-change-transform">
                 <div className="relative w-full max-w-lg group">
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-2xl rounded-[28px] border border-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.04)] group-focus-within:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500" />
                    <div className="relative p-5 px-7 flex items-center justify-between gap-4">
                       <div className="flex flex-col items-start flex-grow">
                          <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                            placeholder="Hey Milo..."
                            className="bg-transparent text-lg font-bold text-slate-900 placeholder:text-slate-200 outline-none w-full tracking-tight"
                          />
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.25em] mt-1">Type to start a private chat</span>
                       </div>
                       <button 
                         onClick={() => handleSend(input)}
                         className="w-11 h-11 bg-slate-900 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-black/10 flex-shrink-0"
                       >
                         <Send className="w-4 h-4 rotate-[-45deg] -translate-y-0.5 translate-x-0.5" />
                       </button>
                    </div>
                 </div>
              </footer>

              {/* Bottom Legal / Tech Disclaimer (Static) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-20 flex items-center gap-2">
                <ShieldAlert className="w-2.5 h-2.5" />
                <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">AI Guided Support • Encrypted Session • ATLAS Framework</span>
              </div>
            </div>

            {/* Napping State Overlay (Styled for Atlas) */}
            <AnimatePresence>
              {isNapping && !isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-40 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-[160]"
                >
                   <div className="p-6 bg-white/60 backdrop-blur-3xl rounded-[32px] border border-white/60 shadow-2xl shadow-black/5 flex flex-col items-center gap-2">
                      <motion.span 
                        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="text-5xl"
                      >
                        💤 🐶
                      </motion.span>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Milo is napping...</span>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Breathing Animation Overlap */}
            <AnimatePresence>
              {showBreathing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white z-[150] flex flex-col items-center justify-center p-8 text-center"
                >
                   <motion.div 
                     animate={{ scale: [1, 1.4, 1] }} 
                     transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                     className="w-48 h-48 bg-blue-50 rounded-full flex items-center justify-center mb-12 border border-blue-100"
                   >
                     <Wind className="w-20 h-20 text-blue-300" />
                   </motion.div>
                   <h3 className="text-3xl font-black text-slate-900 mb-4">Just Breathe</h3>
                   <p className="text-lg text-slate-500 mb-12 max-w-xs font-medium leading-relaxed">
                      Breath in for 4, tahan for 4, exhale for 4. Steady je, fam.
                   </p>
                   <button 
                     onClick={() => setShowBreathing(false)}
                     className="px-8 py-4 bg-[#F2F2F7] rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-200 transition-colors"
                   >
                     I feel better now
                   </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
