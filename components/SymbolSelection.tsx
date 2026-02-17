// ==========================================
// SYMBOL SELECTION COMPONENT
// ==========================================

import React from 'react';
import { User, GameMode, GameSymbol } from '../types';

interface SymbolSelectionProps {
  user: User;
  player2: User | null;
  gameMode: GameMode;
  onSymbolSelected: (symbol: GameSymbol) => void;
  onBack: () => void;
}

/**
 * Dedicated screen for choosing X or O before entering the game.
 * For Single Player: User chooses, AI gets opposite.
 * For Multiplayer: Player 1 chooses, Player 2 auto-assigned opposite.
 */
const SymbolSelection: React.FC<SymbolSelectionProps> = ({ 
  user, 
  player2, 
  gameMode, 
  onSymbolSelected, 
  onBack 
}) => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 relative animate-in fade-in duration-500">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-10 left-6 text-slate-400 hover:text-orange-500 font-bold flex items-center space-x-2 transition-all active:scale-95"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="uppercase tracking-widest text-[10px]">Back</span>
      </button>

      {/* Main Selection Card */}
      <div className="bg-white p-8 rounded-[3rem] shadow-2xl w-full max-w-sm border border-slate-100">
        <h2 className="text-2xl font-black text-slate-800 text-center mb-2 uppercase tracking-tight">
          {gameMode === 'Two Player' ? `${user.name}, Choose Side` : 'Pick Your Side'}
        </h2>
        <p className="text-slate-400 text-center text-[10px] font-bold uppercase tracking-widest mb-8">
          {gameMode === 'Two Player' ? `${player2?.name} gets the other` : 'Play against AI'}
        </p>

        {/* Symbol Selection Buttons */}
        <div className="flex space-x-6 mb-8">
          {/* X Button */}
          <button 
            onClick={() => onSymbolSelected('X')}
            className="flex-1 aspect-square bg-slate-50 hover:bg-[#FF6B1A] hover:text-white transition-all rounded-[2rem] flex flex-col items-center justify-center border-2 border-slate-100 hover:border-[#FF6B1A] group shadow-inner active:scale-95"
          >
            <span className="text-6xl font-black mb-2 group-hover:scale-110 transition-transform">X</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 text-center">Starts Match</span>
          </button>

          {/* O Button */}
          <button 
            onClick={() => onSymbolSelected('O')}
            className="flex-1 aspect-square bg-slate-50 hover:bg-slate-800 hover:text-white transition-all rounded-[2rem] flex flex-col items-center justify-center border-2 border-slate-100 hover:border-slate-800 group shadow-inner active:scale-95"
          >
            <span className="text-6xl font-black mb-2 group-hover:scale-110 transition-transform">O</span>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 text-center">Goes Second</span>
          </button>
        </div>

        {/* Player Info Display */}
        <div className="space-y-2">
          <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Player 1</span>
            <span className="text-sm font-bold text-slate-700">{user.name}</span>
          </div>
          
          {gameMode === 'Two Player' && player2 && (
            <div className="px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Player 2</span>
              <span className="text-sm font-bold text-slate-700">{player2.name}</span>
            </div>
          )}
        </div>

        {/* Mode Indicator */}
        <div className="mt-6 px-4 py-2 rounded-2xl flex items-center justify-center space-x-2 bg-slate-100 border border-slate-200">
          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${gameMode === 'Two Player' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
          <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
            {gameMode === 'Two Player' ? 'Multiplayer Mode' : 'Single Player Mode'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SymbolSelection;
