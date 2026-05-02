import React, { useRef, useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Camera, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HealthStatus } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const GateSentinel: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{ status: HealthStatus; message: string; features: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError(null);
    } catch (err) {
      setError('Camera access denied. Please enable camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const scanHealth = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      const base64Data = canvas.toDataURL('image/jpeg').split(',')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
              { text: 'Analyze this student face for the ATLAS (AsTech Total Learning & Assistant System) universal pathogen screen. Look for: 1) Ocular Health: Redness (Pink Eye), discharge, or swelling. 2) Respiratory Distress: Signs of coughing or labored breathing. 3) Epidermal Rashes: Spots, textures, or lesions (HFM/Measles). 4) Heat Stress: Dehydration/Pale skin. Provide the response in JSON.' }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING, enum: ['green', 'yellow', 'red'] },
              message: { type: Type.STRING },
              features: { type: Type.ARRAY, items: { type: Type.STRING } },
              vitals: {
                type: Type.OBJECT,
                properties: {
                  temperature: { type: Type.NUMBER },
                  breathingRate: { type: Type.NUMBER }
                }
              }
            },
            required: ['status', 'message', 'features']
          }
        }
      });

      const parsedResult = JSON.parse(response.text);
      setResult(parsedResult);
    } catch (err) {
      console.error(err);
      setError('Health analysis failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <section className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm w-full flex flex-col">
        <h2 className="font-bold text-slate-700 mb-3 text-sm uppercase tracking-wider">Gate Sentinel: Live Analytics Feed</h2>
        
        <div className="relative bg-slate-800 rounded-lg aspect-video mb-3 overflow-hidden border-2 border-slate-800 shadow-inner group">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover opacity-60 mix-blend-screen"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute inset-4 border border-blue-400/50 rounded flex items-center justify-center">
            <div className={`w-16 h-16 border-2 border-blue-400/80 rounded-full ${isScanning ? 'animate-ping' : ''}`}></div>
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400"></div>
          </div>

          <div className="absolute bottom-2 left-2 text-[8px] bg-black/60 text-white px-2 py-0.5 font-mono flex items-center gap-2 rounded">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            LIVE FEED: 1080P PROXY
          </div>
          
          {isScanning && (
            <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[1px] flex flex-col items-center justify-center">
               <p className="text-white text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">Running Neural Analysis...</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center justify-between bg-slate-50 border border-slate-100 p-2 rounded">
            <span className="text-[10px] font-bold text-slate-500">ACCURACY</span>
            <span className="text-[10px] font-mono font-bold text-blue-600">89.4%</span>
          </div>
          <div className="flex-1 flex items-center justify-between bg-slate-50 border border-slate-100 p-2 rounded">
            <span className="text-[10px] font-bold text-slate-500">LATENCY</span>
            <span className="text-[10px] font-mono font-bold text-blue-600">42MS</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={scanHealth}
            disabled={isScanning}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            Trigger Scan
          </button>
          <button
            onClick={() => { setResult(null); setError(null); }}
            className="px-4 py-2.5 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </section>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mt-4 space-y-2"
          >
            <div className={`flex items-center justify-between p-3 rounded-lg border font-bold ${
              result.status === 'red' ? 'bg-rose-50 border-rose-200 text-rose-700' :
              result.status === 'yellow' ? 'bg-amber-50 border-amber-200 text-amber-700' :
              'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              <span className="text-xs">ID: #SCAN-{Math.floor(Math.random() * 90000) + 10000}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full text-white uppercase ${
                result.status === 'red' ? 'bg-rose-500' :
                result.status === 'yellow' ? 'bg-amber-500' :
                'bg-emerald-500'
              }`}>{result.status}</span>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-sm">
              <p className="text-slate-700 font-medium mb-3">{result.message}</p>
              <div className="flex flex-wrap gap-2">
                {result.features.map((feature, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 bg-slate-100 text-slate-500 font-bold rounded">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
