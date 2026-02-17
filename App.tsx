// ==========================================
// MAIN APPLICATION ENTRY POINT
// ==========================================

import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import AuthScreen from './components/AuthScreen';
import GameMenu from './components/GameMenu';
import GameView from './components/GameView';
import ModeSelection from './components/ModeSelection';
import PlayerSelection from './components/PlayerSelection';
import SymbolSelection from './components/SymbolSelection';
import { User, GameMode, Difficulty, GameSymbol } from './types';
import { getLevel } from './services/gameLogic';

// // Level-based penalty system for AI defeats
const getPenaltyForLevel = (level: Difficulty): number => {
  const penalties: Record<Difficulty, number> = {
    'Demigod': -200,
    'Ascendant': -150,
    'Immortal': -100,
    'Legend': -50,
    'Titan': -50,
    'Warlord': -50,
    'Grandmaster': -50,
    'Strategist': -50,
    'Elite': -50,
    'Superstar': -50,
    'Advanced': -20,
    'Easy': -20,
  };
  return penalties[level] || -20;
};

/**
 * // The root component that manages the global state and navigation logic.
 * // Handles user authentication, profile updates, and view switching.
 */
const App: React.FC = () => {
  // // State to control the display of the loading/splash screen
  const [isLoading, setIsLoading] = useState(true);
  // // State to track the current active view
  const [view, setView] = useState<'MODE_SELECTION' | 'AUTH' | 'PLAYER_SELECTION' | 'SYMBOL_SELECTION' | 'GAME'>('MODE_SELECTION');
  // // State to hold the currently logged-in user object (Player 1)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // // State to hold the second player (for Two Player mode)
  const [player2, setPlayer2] = useState<User | null>(null);
  // // State for the selected game mode
  const [gameMode, setGameMode] = useState<GameMode>('Single Player');
  // // State for the selected symbol (X or O)
  const [selectedSymbol, setSelectedSymbol] = useState<GameSymbol | null>(null);

  // // Persists user data to browser local storage
  const saveUserToStorage = (user: User) => {
    const usersJson = localStorage.getItem('beta_games_users');
    const users: Record<string, User> = usersJson ? JSON.parse(usersJson) : {};
    users[user.name] = user;
    localStorage.setItem('beta_games_users', JSON.stringify(users));
  };

  // // Handles user login or registration by name (for Single Player)
  const handleLogin = (name: string) => {
    const usersJson = localStorage.getItem('beta_games_users');
    const users: Record<string, User> = usersJson ? JSON.parse(usersJson) : {};
    
    // // If user exists, load their data; otherwise, create a new profile
    if (users[name]) {
      setCurrentUser(users[name]);
    } else {
      const newUser: User = { 
        name, 
        score: 0, 
        avatar: 'male', 
        preferredDifficulty: 'Easy' 
      };
      saveUserToStorage(newUser);
      setCurrentUser(newUser);
    }
    // // Navigate to Symbol Selection after login (only once)
    setView('SYMBOL_SELECTION');
  };

  // // Updates a user's profile and persists changes
  const handleUpdateUser = (user: User, updates: Partial<User>) => {
    const updatedUser = { ...user, ...updates };
    if (currentUser && user.name === currentUser.name) setCurrentUser(updatedUser);
    if (player2 && user.name === player2.name) setPlayer2(updatedUser);
    saveUserToStorage(updatedUser);
  };

  // // Handles mode selection from Mode Selection screen
  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    
    if (mode === 'Single Player') {
      // // Single Player: go to Auth for account selection
      setView('AUTH');
    } else {
      // // Multiplayer: go to Player Selection
      setView('PLAYER_SELECTION');
    }
  };

  // // Handles player selection for multiplayer mode
  const handlePlayersSelected = (p1: User, p2: User) => {
    setCurrentUser(p1);
    setPlayer2(p2);
    setView('SYMBOL_SELECTION');
  };

  // // Handles symbol selection
  const handleSymbolSelected = (symbol: GameSymbol) => {
    setSelectedSymbol(symbol);
    setView('GAME');
  };

  // // Handles back navigation from Symbol Selection
  const handleBackFromSymbol = () => {
    if (gameMode === 'Single Player') {
      setView('AUTH');
    } else {
      setView('PLAYER_SELECTION');
    }
    setSelectedSymbol(null);
  };

  // // Handles back navigation from Game
  const handleBackFromGame = () => {
    setSelectedSymbol(null);
    setView('SYMBOL_SELECTION');
  };

  // // Handles exit to main menu
  const handleExitToMenu = () => {
    if (currentUser) saveUserToStorage(currentUser);
    if (player2) saveUserToStorage(player2);
    setCurrentUser(null);
    setPlayer2(null);
    setSelectedSymbol(null);
    setView('MODE_SELECTION');
  };

  // // Display the Loading Screen initially
  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    // // Application Wrapper with global styles
    <div className="h-screen w-screen overflow-hidden bg-slate-50 font-sans selection:bg-orange-100">
      {/* // Conditional Rendering based on the current View State */}
      {view === 'MODE_SELECTION' ? (
        <ModeSelection
          onSelectMode={handleModeSelect}
          onBack={handleExitToMenu}
        />
      ) : view === 'AUTH' ? (
        <AuthScreen 
          onLogin={handleLogin} 
          onBack={() => setView('MODE_SELECTION')}
        />
      ) : view === 'PLAYER_SELECTION' ? (
        <PlayerSelection
          onPlayersSelected={handlePlayersSelected}
          onBack={() => setView('MODE_SELECTION')}
        />
      ) : view === 'SYMBOL_SELECTION' && currentUser ? (
        <SymbolSelection
          user={currentUser}
          player2={player2}
          gameMode={gameMode}
          onSymbolSelected={handleSymbolSelected}
          onBack={handleBackFromSymbol}
        />
      ) : view === 'GAME' && currentUser && selectedSymbol ? (
        <GameView 
          user={currentUser} 
          player2={player2}
          gameMode={gameMode}
          userSymbol={selectedSymbol}
          onScoreChange={(points, targetUser) => {
            const userToUpdate = targetUser || currentUser;
            // // Apply level-based penalty for AI defeats
            let adjustedPoints = points;
            if (points < 0 && gameMode === 'Single Player') {
              const currentLevel = getLevel(userToUpdate.score);
              adjustedPoints = getPenaltyForLevel(currentLevel);
            }
            handleUpdateUser(userToUpdate, { score: Math.max(0, userToUpdate.score + adjustedPoints) });
          }} 
          onBackToMenu={handleBackFromGame}
        />
      ) : (
        <ModeSelection
          onSelectMode={handleModeSelect}
          onBack={handleExitToMenu}
        />
      )}
    </div>
  );
};

export default App;
