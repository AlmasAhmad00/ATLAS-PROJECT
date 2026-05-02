import React from 'react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { ArrowRight, ShieldCheck, Thermometer, Zap } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="min-h-screen flex flex-col p-12 md:p-24 relative overflow-hidden font-sans bg-slate-100"
      style={{
        backgroundImage: 'url("/input_file_0.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Fallback overlay in case image loads slowly or fails */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px] -z-10" />
      
      {/* Header Section */}
      <header className="relative z-10 w-full max-w-6xl mx-auto mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Logo />
          <span className="text-xl font-bold text-slate-800 tracking-tight">By Katwoo</span>
        </div>
        <div className="w-full h-[1px] bg-slate-800 opacity-20" />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-grow flex-col justify-center max-w-6xl mx-auto w-full">
        <div className="max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-8xl md:text-[10rem] font-black text-slate-800 leading-[0.9] mb-10 tracking-tight"
          >
            ATLAS.
          </motion.h1>
          
          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="px-12 py-5 bg-slate-800 text-white font-black text-xs rounded-xl shadow-2xl hover:bg-slate-900 transition-all flex items-center gap-4 uppercase tracking-[0.4em] border border-slate-700"
          >
            Access Portal
            <ArrowRight className="w-5 h-5 opacity-70 group-hover:opacity-100" />
          </motion.button>
        </div>
      </main>

      {/* Bottom Identity Block */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto flex justify-end">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-right space-y-0.5"
        >
          <div className="text-xl font-light text-slate-600 tracking-wider">
            <span className="font-bold">A</span>daptive 
            <span className="font-bold"> T</span>riage
          </div>
          <div className="text-xl font-light text-slate-600 tracking-wider">
            <span className="font-bold">L</span>earner 
            <span className="font-bold"> A</span>ssurance
          </div>
          <div className="text-xl font-light text-slate-600 tracking-widest">
            <span className="font-bold text-slate-800">S</span>ystem
          </div>
        </motion.div>
      </footer>
    </motion.div>
  );
};

const FeatureItem = ({ icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-800 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-black text-slate-800 mb-2 italic uppercase tracking-tight">{title}</h3>
    <p className="text-sm text-slate-400 font-medium leading-relaxed">{desc}</p>
  </div>
);
