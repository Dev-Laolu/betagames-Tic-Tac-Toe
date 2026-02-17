// ==========================================
// LOADING SCREEN COMPONENT
// ==========================================

import React, { useEffect, useState } from 'react';

// // Component Props interface
interface LoadingScreenProps {
  onComplete: () => void;
}

/**
 * // Splash screen that displays when the app is initializing.
 * // Features a progress circle and the Beta Games logo.
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  // // State to track the initialization progress (0 to 100)
  const [progress, setProgress] = useState(0);

  // // Effect to handle the loading progress animation
  useEffect(() => {
    // // Interval to increment the progress state
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        // // When progress reaches 100, clear interval and trigger onComplete
        if (oldProgress >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        // // Increment progress by 2 units
        return oldProgress + 2;
      });
    }, 40);
    // // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, [onComplete]);

  // // SVG calculations for progress circle
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  // // Calculate the offset to represent the current progress visually
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    // // Full-screen background with branded color
    <div className="fixed inset-0 bg-[#FF6B1A] flex flex-col items-center justify-center z-50 transition-opacity duration-1000 animate-in fade-in">
      <div className="relative flex items-center justify-center">
        {/* // Progress Circle Visual */}
        <svg className="w-56 h-56 transform -rotate-90 drop-shadow-2xl">
          <circle
            cx="112"
            cy="112"
            r={radius}
            stroke="white"
            strokeWidth="8"
            fill="transparent"
            className="opacity-20"
          />
          <circle
            cx="112"
            cy="112"
            r={radius}
            stroke="white"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.1s linear' }}
            strokeLinecap="round"
          />
        </svg>
        {/* // Centered Logo Image */}
        <div className="absolute flex flex-col items-center">
          <img 
            src="/asset/betagames.png" 
            alt="Beta Games Logo" 
            className="w-24 h-24 object-contain animate-pulse-glow"
          />
        </div>
      </div>
      {/* // Status message */}
      <p className="text-white font-black mt-12 animate-pulse uppercase tracking-[0.3em] text-xs">Initializing Arena...</p>
    </div>
  );
};

export default LoadingScreen;
