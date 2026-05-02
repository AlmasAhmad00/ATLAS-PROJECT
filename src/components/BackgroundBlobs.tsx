import React from 'react';

export const BackgroundBlobs: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-slate-50 pointer-events-none">
      {/* Soft gradient base matches the reference image */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 opacity-60" />
      
      {/* Geometric reference lines - replicating the translucent parallel style */}
      <svg 
        viewBox="0 0 1000 1000" 
        className="absolute w-full h-full opacity-[0.03]" 
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Blue Tracks */}
        <path 
          d="M700 200 L950 200 L950 800" 
          stroke="#0088FF" 
          strokeWidth="60" 
          fill="none" 
          strokeLinecap="round" 
        />
        <path 
          d="M800 200 L900 200 L900 700" 
          stroke="#0088FF" 
          strokeWidth="60" 
          fill="none" 
          strokeLinecap="round" 
        />

        {/* Red Tracks */}
        <path 
          d="M100 800 L350 800 L350 200" 
          stroke="#C01010" 
          strokeWidth="60" 
          fill="none" 
          strokeLinecap="round" 
        />
        <path 
          d="M200 800 L300 800 L300 300" 
          stroke="#C01010" 
          strokeWidth="60" 
          fill="none" 
          strokeLinecap="round" 
        />
      </svg>

      {/* Decorative Blur and Noise if desired, but keeping it clean like the reference */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-200/20 rounded-full blur-[120px]" />
    </div>
  );
};
