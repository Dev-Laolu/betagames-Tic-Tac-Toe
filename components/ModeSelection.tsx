// ==========================================
// MODE SELECTION COMPONENT
// ==========================================

import React, { useState } from 'react';
import { GameMode } from '../types';

interface ModeSelectionProps {
  onSelectMode: (mode: GameMode) => void;
  onBack: () => void;
}

/**
 * // A screen that allows the user to choose between Single Player and Two Player modes.
 */
const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelectMode, onBack }) => {
  // // State to track the selected mode before confirmation
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50">
      {/* // Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center">
        <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Select Match Mode</h1>
      </div>

      {/* // Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="z-10 text-center mb-12 animate-slide-up">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2 uppercase animate-float">Arena Select</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Select Battle Mode</p>
        </div>

        {/* // Mode Selection Cards */}
        <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* // Single Player Mode Card */}
          <button
            onClick={() => onSelectMode('Single Player')}
            className="group p-8 rounded-[2rem] border-2 transition-all duration-300 bg-white shadow-xl hover:shadow-2xl hover:border-orange-500 hover:ring-4 hover:ring-orange-50 border-slate-100 animate-slide-up [animation-delay:100ms] hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center transition-all duration-300 bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">Single Player Mode</h3>
              <p className="text-xs text-slate-400 font-medium group-hover:text-orange-500 transition-colors">Play against our advanced AI</p>
            </div>
          </button>

          {/* // Multi-Player Mode Card */}
          <button
            onClick={() => onSelectMode('Two Player')}
            className="group p-8 rounded-[2rem] border-2 transition-all duration-300 bg-white shadow-xl hover:shadow-2xl hover:border-indigo-600 hover:ring-4 hover:ring-indigo-50 border-slate-100 animate-slide-up [animation-delay:200ms] hover:-translate-y-2"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center transition-all duration-300 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 group-hover:-rotate-3 shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">Multi-Player Mode</h3>
              <p className="text-xs text-slate-400 font-medium group-hover:text-indigo-600 transition-colors">Local multiplayer for friends and family</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelection;
