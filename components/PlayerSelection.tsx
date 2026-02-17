// ==========================================
// PLAYER SELECTION COMPONENT (MULTIPLAYER)
// ==========================================

import React, { useState } from 'react';
import { User } from '../types';

interface PlayerSelectionProps {
  onPlayersSelected: (player1: User, player2: User) => void;
  onBack: () => void;
}

/**
 * Handles Player 1 and Player 2 account selection/creation for multiplayer mode.
 */
const PlayerSelection: React.FC<PlayerSelectionProps> = ({ onPlayersSelected, onBack }) => {
  const [step, setStep] = useState<'PLAYER1' | 'PLAYER2'>('PLAYER1');
  const [player1, setPlayer1] = useState<User | null>(null);
  const [inputMode, setInputMode] = useState<'PICK' | 'ENTRY'>('PICK');
  const [nameInput, setNameInput] = useState('');

  // Fetch all registered users from localStorage
  const usersJson = localStorage.getItem('beta_games_users');
  const allUsers: Record<string, User> = usersJson ? JSON.parse(usersJson) : {};
  const availableUsers = Object.values(allUsers);

  // Filter out Player 1 when selecting Player 2
  const filteredUsers = step === 'PLAYER2' && player1 
    ? availableUsers.filter(u => u.name !== player1.name)
    : availableUsers;

  const handleSelectUser = (user: User) => {
    if (step === 'PLAYER1') {
      setPlayer1(user);
      setStep('PLAYER2');
      setInputMode('PICK');
      setNameInput('');
    } else {
      // Player 2 selected, proceed to symbol selection
      onPlayersSelected(player1!, user);
    }
  };

  const handleCreateUser = () => {
    const name = nameInput.trim();
    if (!name) return;

    let newUser: User;
    if (allUsers[name]) {
      // User already exists, load it
      newUser = allUsers[name];
    } else {
      // Create new user
      newUser = {
        name,
        score: 0,
        avatar: step === 'PLAYER1' ? 'male' : 'female',
        preferredDifficulty: 'Easy'
      };
      // Save to localStorage
      allUsers[name] = newUser;
      localStorage.setItem('beta_games_users', JSON.stringify(allUsers));
    }

    if (step === 'PLAYER1') {
      setPlayer1(newUser);
      setStep('PLAYER2');
      setInputMode('PICK');
      setNameInput('');
    } else {
      onPlayersSelected(player1!, newUser);
    }
  };

  const handleBackButton = () => {
    if (step === 'PLAYER2') {
      setStep('PLAYER1');
      setPlayer1(null);
      setInputMode('PICK');
      setNameInput('');
    } else {
      onBack();
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center">
        <button 
          onClick={handleBackButton}
          className="text-slate-400 hover:text-orange-500 transition-colors p-1 mr-3"
          title="Back"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
          {step === 'PLAYER1' ? 'Select Player 1' : 'Select Player 2'}
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="z-10 text-center mb-8">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2 uppercase">
            {step === 'PLAYER1' ? 'Player 1' : 'Player 2'}
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">
            {step === 'PLAYER1' ? 'Choose or Create Account' : `Playing Against ${player1?.name}`}
          </p>
        </div>

        {/* Account Selection Card */}
        <div className="z-10 w-full max-w-md bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100">
          <div className="flex items-center justify-between mb-4 px-2">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Selection</h4>
            <button 
              onClick={() => { setInputMode(inputMode === 'PICK' ? 'ENTRY' : 'PICK'); setNameInput(''); }}
              className="text-[9px] font-bold text-indigo-600 uppercase border-b border-indigo-200"
            >
              {inputMode === 'PICK' ? 'Create New' : 'Pick Existing'}
            </button>
          </div>

          {inputMode === 'PICK' ? (
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <button
                    key={u.name}
                    onClick={() => handleSelectUser(u)}
                    className="w-full p-4 rounded-2xl flex items-center justify-between transition-all bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 border-2 border-transparent"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${u.avatar === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                      </div>
                      <span className="font-bold">{u.name}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Score: {u.score}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-center py-6 text-slate-400 text-xs italic">No accounts found. Create one!</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateUser()}
                placeholder="Enter player name..."
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 transition-all text-center"
                autoFocus
              />
              <button
                onClick={handleCreateUser}
                disabled={!nameInput.trim()}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                  !nameInput.trim()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0'
                }`}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerSelection;
