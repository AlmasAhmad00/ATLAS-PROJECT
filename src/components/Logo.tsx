import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Blue Top-Left */}
        <path 
          d="M35 15V35H15" 
          stroke="#0088FF" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M45 15V45H15" 
          stroke="#0088FF" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />

        {/* Blue Top-Right */}
        <path 
          d="M65 15V35H85" 
          stroke="#0088FF" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M55 15V45H85" 
          stroke="#0088FF" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />

        {/* Red Bottom-Left */}
        <path 
          d="M35 85V65H15" 
          stroke="#C01010" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M45 85V55H15" 
          stroke="#C01010" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />

        {/* Red Bottom-Right */}
        <path 
          d="M65 85V65H85" 
          stroke="#C01010" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M55 85V55H85" 
          stroke="#C01010" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
