// ==========================================
// GAME MENU COMPONENT
// ==========================================

import React, { useState } from 'react';
import { User } from '../types';
import { getLevel, LEVEL_THRESHOLDS } from '../services/gameLogic';

// // Component Props interface
interface GameMenuProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
  onStartGame: () => void;
  onExit: () => void;
}

// // Male Avatar SVG Component
const AvatarMale = () => (
  <svg className="w-full h-full text-blue-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
  </svg>
);

// // Female Avatar SVG Component
const AvatarFemale = () => (
  <svg className="w-full h-full text-pink-500" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c-4.97 0-9 4.03-9 9 0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11c0-4.97-4.03-9-9-9zm0 16c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
  </svg>
);

/**
 * // Main Lobby / Menu Screen.
 * // Allows users to customize their profile, select difficulty, and start the game.
 */
const GameMenu: React.FC<GameMenuProps> = ({ user, onUpdateUser, onStartGame, onExit }) => {
  // // State for Level Info modal visibility
  const [showLevelInfo, setShowLevelInfo] = useState(false);
  
  // // Get current level based on score
  const currentLevel = getLevel(user.score);
  const isSuperstar = user.score >= 1000;

  return (
    // // Full-screen container
    <div className="h-screen w-screen flex flex-col bg-[#FF6B1A] overflow-hidden">
      {/* // Top Header Section */}
      <div className="pt-12 pb-20 px-8 flex flex-col items-center relative">
          {/* // Info Button (Small 'i' icon) */}
          <div className="absolute top-6 left-6">
            <button 
              onClick={() => setShowLevelInfo(true)} 
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center transition-all active:scale-90"
              title="Level Information"
            >
              <span className="text-white font-black text-sm">i</span>
            </button>
          </div>
          <div className="absolute top-6 right-6">
            <button 
              onClick={onExit} 
              className="text-white/80 hover:text-white bg-white/10 p-2 rounded-full transition-all hover:bg-white/20 active:scale-90"
              title="Exit and Save"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>


          {/* // Avatar Display */}
          <div className="w-28 h-28 bg-white rounded-full p-1 shadow-2xl mb-4 transform hover:rotate-6 transition-transform">
            <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
              {user.avatar === 'male' ? <AvatarMale /> : <AvatarFemale />}
            </div>
          </div>
          
          {/* // Player Name */}
          <h2 className="text-white text-3xl font-black">{user.name}</h2>
          
          {/* // User Score and Level Display */}
          <div className="mt-6 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/30">
            <p className="text-white/70 text-[8px] font-black uppercase tracking-widest text-center">Arena Points</p>
            <p className="text-white font-black text-3xl text-center leading-none mt-1">{user.score}</p>
            <p className="text-white/90 text-[10px] font-bold uppercase tracking-wider text-center mt-2">{currentLevel} Rank</p>
          </div>
        </div>

      {/* // Main Content Area */}
      <div className="flex-1 bg-white px-8 py-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-50 rounded-3xl p-6 mb-6">
            <h3 className="text-slate-400 text-[10px] font-black tracking-widest uppercase mb-4 text-center">Customize Profile</h3>
            {/* // Avatar Selection Toggle */}
            <div className="flex justify-center space-x-6 mb-6">
              <button 
                onClick={() => onUpdateUser({ avatar: 'male' })}
                className={`w-14 h-14 rounded-2xl p-2 transition-all duration-300 ${user.avatar === 'male' ? 'bg-blue-50 border-2 border-blue-400 scale-110 shadow-lg' : 'bg-slate-50 opacity-40 hover:opacity-100'}`}
              >
                <AvatarMale />
              </button>
              <button 
                onClick={() => onUpdateUser({ avatar: 'female' })}
                className={`w-14 h-14 rounded-2xl p-2 transition-all duration-300 ${user.avatar === 'female' ? 'bg-pink-50 border-2 border-pink-400 scale-110 shadow-lg' : 'bg-slate-50 opacity-40 hover:opacity-100'}`}
              >
                <AvatarFemale />
              </button>
            </div>

            <hr className="border-slate-200 mb-6" />

            <h3 className="text-slate-400 text-[10px] font-black tracking-widest uppercase mb-3 text-center">Difficulty Selection</h3>
            {/* // Difficulty Toggle or Superstar Display */}
            <div className="flex flex-col space-y-2">
              {isSuperstar ? (
                <div className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center space-x-3 border-2 border-yellow-200 shadow-lg">
                  <div className="bg-white rounded-full p-1">
                    <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-white font-black uppercase text-xs tracking-widest">Superstar Status</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onUpdateUser({ preferredDifficulty: 'Average' })}
                    className={`py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${user.preferredDifficulty === 'Average' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    Average
                  </button>
                  <button
                    onClick={() => onUpdateUser({ preferredDifficulty: 'Advanced' })}
                    className={`py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${user.preferredDifficulty === 'Advanced' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    Advanced
                  </button>
                </div>
              )}
              {/* // Bug Fix: Show informative message ONLY when superstar status is NOT reached yet */}
              {!isSuperstar && <p className="text-center text-[9px] font-bold text-orange-400 uppercase tracking-tight mt-1">Unlock Superstar at 1000+ Score</p>}
            </div>
          </div>

          {/* // Main Action Button to Enter the Game */}
          <button
            onClick={onStartGame}
            className="w-full py-5 bg-[#FF6B1A] text-white rounded-xl font-black text-xl active:scale-95 transition-all uppercase tracking-tight hover:bg-[#e65a12]"
          >
            Enter Arena
          </button>
        </div>
      </div>

      {/* // Level Info Modal */}
      {showLevelInfo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in" onClick={() => setShowLevelInfo(false)}>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 animate-in slide-in-from-bottom-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-slate-800 uppercase">Level Hierarchy</h3>
              <button onClick={() => setShowLevelInfo(false)} className="text-slate-400 hover:text-slate-600 p-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
              {LEVEL_THRESHOLDS.map((level, index) => (
                <div 
                  key={level.label} 
                  className={`p-4 rounded-2xl flex items-center justify-between transition-all ${
                    currentLevel === level.label ? 'bg-orange-500 text-white scale-105' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`text-2xl font-black ${currentLevel === level.label ? 'text-white' : 'text-slate-300'}`}>
                      {LEVEL_THRESHOLDS.length - index}
                    </span>
                    <span className="font-bold">{level.label}</span>
                  </div>
                  <span className={`text-xs font-black uppercase ${currentLevel === level.label ? 'text-orange-100' : 'text-slate-400'}`}>
                    {level.score}+ pts
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest text-center mb-2">Your Progress</p>
              <p className="text-center text-slate-700 font-bold">{user.score} points • {currentLevel} Rank</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameMenu;
