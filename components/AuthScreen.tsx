// ==========================================
// AUTHENTICATION SCREEN COMPONENT
// ==========================================

import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { LEVEL_THRESHOLDS } from '../services/gameLogic';

// // Component Props interface
interface AuthScreenProps {
  onLogin: (name: string) => void;
  onBack: () => void;
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
 * // Screen responsible for user login and new player registration.
 * // Displays the logo, input for name, and existing user profiles.
 */
const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onBack }) => {
  // // State for the input field name
  const [name, setName] = useState('');
  // // State for existing users retrieved from local storage
  const [existingUsers, setExistingUsers] = useState<User[]>([]);
  // // State for error message when username already exists
  const [errorMessage, setErrorMessage] = useState('');
  // // State for level info modal visibility
  const [showLevelInfo, setShowLevelInfo] = useState(false);

  // // Effect to load users from local storage on component mount
  useEffect(() => {
    const usersJson = localStorage.getItem('beta_games_users');
    if (usersJson) {
      try {
        const usersMap: Record<string, User> = JSON.parse(usersJson);
        setExistingUsers(Object.values(usersMap));
      } catch (e) {
        // // Log error if parsing fails
        console.error("Failed to parse existing users", e);
      }
    }
  }, []);

  // // Handle name input change and clear error
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setErrorMessage(''); // Clear error when user types
  };

  // // Handle submission of the login form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    
    if (!trimmedName) return;
    
    // // Check if username already exists
    const userExists = existingUsers.some(user => user.name.toLowerCase() === trimmedName.toLowerCase());
    
    if (userExists) {
      setErrorMessage(`The username "${trimmedName}" already exists. Please choose a different name or select it from the list below.`);
      return;
    }
    
    // // If validation passes, proceed with login
    onLogin(trimmedName);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-orange-50 to-slate-50">
      {/* // Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* // Back Button */}
            <button 
              onClick={onBack}
              className="text-slate-400 hover:text-orange-500 transition-colors p-1 mr-2"
              title="Back to Mode Selection"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <img src="/asset/betagames.png" alt="Beta Games Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Beta Games</h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tic-Tac-Toe Arena</p>
            </div>
          </div>
          {/* // Info Button */}
          <button 
            onClick={() => setShowLevelInfo(true)} 
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-orange-100 border border-slate-200 hover:border-orange-300 flex items-center justify-center transition-all active:scale-90"
            title="Level Information"
          >
            <span className="text-slate-600 hover:text-orange-600 font-black text-sm">i</span>
          </button>
        </div>
      </div>

      {/* // Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-orange-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* // Header Section with Logo */}
        <div className="bg-[#FF6B1A] py-12 flex flex-col items-center relative">
          <div className="bg-white p-4 rounded-3xl shadow-xl mb-4 transform -rotate-3 transition-transform hover:rotate-0">
             <div className="flex flex-col items-center leading-none px-2">
                <img 
                  src="/asset/betagames.png" 
                  alt="Beta Games Logo" 
                  className="w-16 h-16 object-contain mb-2"
                />
                <span className="text-slate-400 text-[10px] font-black tracking-[0.4em] uppercase">GAMES</span>
             </div>
          </div>
          <h1 className="text-white text-2xl font-black uppercase tracking-tight">X and O Arena</h1>
        </div>
        
        {/* // Form and List Content */}
        <div className="p-8">
          {/* // Form for new/existing user input */}
          <form onSubmit={handleSubmit} className="mb-8 animate-slide-up [animation-delay:200ms]">
            <label className="block text-slate-400 text-[10px] font-black tracking-widest uppercase mb-3 ml-1">
              Player Identity
            </label>
            <div className="relative group transistion-all duration-300 focus-within:scale-[1.02]">
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Type your name..."
                className={`w-full px-6 py-5 bg-slate-50 rounded-[1.5rem] border-2 ${errorMessage ? 'border-red-300 focus:border-red-500' : 'border-transparent focus:border-[#FF6B1A]'} focus:bg-white focus:outline-none transition-all duration-300 text-lg font-bold text-slate-800 placeholder:text-slate-300 shadow-inner`}
              />
              <button
                type="submit"
                className={`absolute right-2 top-2 bottom-2 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${name.trim() ? 'bg-[#FF6B1A] text-white shadow-lg shadow-orange-200 opacity-100 scale-100' : 'bg-slate-200 text-slate-400 opacity-0 scale-90 pointer-events-none'}`}
              >
                Go
              </button>
            </div>
            {/* // Error Message Display */}
            {errorMessage && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-2">
                <p className="text-red-600 text-xs font-bold flex items-start space-x-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{errorMessage}</span>
                </p>
              </div>
            )}
          </form>

          {/* // Existing Accounts List Section */}
          {existingUsers.length > 0 && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-700 delay-150">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-[1px] flex-1 bg-slate-100"></div>
                <span className="text-slate-300 text-[9px] font-black uppercase tracking-widest">Jump Back In</span>
                <div className="h-[1px] flex-1 bg-slate-100"></div>
              </div>
              
              {/* // Scrollable list of profiles */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {existingUsers.map((user) => (
                  <button
                    key={user.name}
                    onClick={() => onLogin(user.name)}
                    className="w-full p-4 bg-white border border-slate-100 rounded-2xl flex items-center space-x-4 transition-all hover:border-orange-200 hover:shadow-md active:scale-95 group"
                  >
                    <div className="w-12 h-12 bg-slate-50 rounded-xl p-2 group-hover:scale-110 transition-transform">
                      {user.avatar === 'male' ? <AvatarMale /> : <AvatarFemale />}
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-black text-slate-800 leading-none">{user.name}</h4>
                      <p className="text-[#FF6B1A] text-[9px] font-black uppercase tracking-widest mt-1">
                        Rank Score: {user.score}
                      </p>
                    </div>
                    <div className="text-slate-200 group-hover:text-orange-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* // Footer note */}
          <p className="text-slate-300 text-center mt-8 text-[9px] uppercase tracking-widest font-black">
            Beta Games Secure Local Storage Enabled
          </p>
        </div>
      </div>
      </div>
    
    {/* // Level Info Modal */}
    {showLevelInfo && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in" onClick={() => setShowLevelInfo(false)}>
        <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 animate-in slide-in-from-bottom-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-slate-800 uppercase">Level Hierarchy</h3>
            <button onClick={() => setShowLevelInfo(false)} className="text-slate-400 hover:text-slate-600 p-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
            {LEVEL_THRESHOLDS.map((level, index) => (
              <div 
                key={level.label} 
                className="p-4 rounded-2xl flex items-center justify-between transition-all bg-slate-50 text-slate-700"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-black text-slate-300">
                    {LEVEL_THRESHOLDS.length - index}
                  </span>
                  <span className="font-bold">{level.label}</span>
                </div>
                <span className="text-xs font-black uppercase text-slate-400">
                  {level.score}+ pts
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest text-center">
              Climb the ranks by winning matches!
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default AuthScreen;
