// ==========================================
// GAME VIEW COMPONENT
// ==========================================

import React, { useState, useEffect, useCallback } from 'react';
import { User, Player, GameStatus, GameSymbol, Difficulty, GameMode } from '../types';
import { calculateWinner, getEasyMove, getAdvancedMove, getAvailableMoves, getLevel } from '../services/gameLogic';

// // Component Props interface
interface GameViewProps {
  user: User;
  player2: User | null;
  gameMode: GameMode;
  userSymbol: GameSymbol;
  onScoreChange: (points: number, targetUser?: User) => void;
  onBackToMenu: () => void;
}

/**
 * // Main Game Arena Component.
 * // Manages the Tic-Tac-Toe board, player turns, and AI interaction.
 */
const GameView: React.FC<GameViewProps> = ({ user, player2, gameMode, userSymbol: initialUserSymbol, onScoreChange, onBackToMenu }) => {
  // // State for user's chosen symbol (X or O) - initialized from props
  const [userSymbol, setUserSymbol] = useState<GameSymbol | null>(initialUserSymbol);
  // // Board state represented as an array of 9 symbols/null
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  // // Turn indicator: true if X is next, false if O is next
  const [isXNext, setIsXNext] = useState(true);
  // // Current game status (IDLE, PLAYING, WON, DRAW)
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  // // The winning symbol if a win occurs
  const [winner, setWinner] = useState<Player>(null);
  // // Flag to show AI 'thinking' animation
  const [isAiThinking, setIsAiThinking] = useState(false);

  // // Determine the difficulty level based on user score using getLevel
  const effectiveDifficulty: Difficulty = getLevel(user.score);
  
  // // Determine the AI's symbol based on user's choice (only for Single Player)
  const aiSymbol = gameMode === 'Single Player' ? (userSymbol === 'X' ? 'O' : 'X') : null;

  // // Identify who is playing as X and O
  const playerX = userSymbol === 'X' ? user : (gameMode === 'Two Player' ? player2 : null);
  const playerO = userSymbol === 'O' ? user : (gameMode === 'Two Player' ? player2 : null);

  // // Function to initialize a new game session
  const startGame = (symbol: GameSymbol) => {
    setUserSymbol(symbol);
    setBoard(Array(9).fill(null));
    setIsXNext(true); // // 'X' always makes the first move
    setStatus(GameStatus.PLAYING);
    setWinner(null);
    setIsAiThinking(false);
  };

  // // Initialize game automatically when component mounts with the provided symbol
  useEffect(() => {
    if (initialUserSymbol && status === GameStatus.IDLE) {
      startGame(initialUserSymbol);
    }
  }, [initialUserSymbol]); // eslint-disable-line react-hooks/exhaustive-deps

  // // Handle a move made by a human player
  const handleMove = useCallback((idx: number) => {
    // // Prevent move if cell is occupied, game is over, AI is moving, or symbols not assigned
    if (board[idx] || status !== GameStatus.PLAYING || isAiThinking || !userSymbol) return;
    
    const currentSymbol = isXNext ? 'X' : 'O';

    // // In Single Player, only allow the user to move on their turn
    if (gameMode === 'Single Player' && currentSymbol !== userSymbol) return;

    // // Update the board with the current player's symbol
    const newBoard = [...board];
    newBoard[idx] = currentSymbol;
    setBoard(newBoard);

    // // Check for win or draw after the move
    const winResult = calculateWinner(newBoard);
    if (winResult) {
      setWinner(winResult);
      setStatus(GameStatus.WON);
      
      // // Handle logic for scoring
      if (gameMode === 'Single Player') {
        onScoreChange(100); // // P1 wins vs AI
      } else {
        // // PvP: Credit the specific winner
        const winningUser = winResult === 'X' ? playerX! : playerO!;
        onScoreChange(100, winningUser);
      }
    } else if (getAvailableMoves(newBoard).length === 0) {
      setStatus(GameStatus.DRAW);
      if (gameMode === 'Single Player') {
        onScoreChange(20);
      } else {
        onScoreChange(20, user);
        if (player2) onScoreChange(20, player2);
      }
    } else {
      // // Switch turn
      setIsXNext(!isXNext);
    }
  }, [board, status, isAiThinking, userSymbol, isXNext, onScoreChange, gameMode, user, player2, playerX, playerO]);

  // // Effect: Manages the AI's turn automatically (Only in Single Player)
  useEffect(() => {
    if (gameMode !== 'Single Player') return;

    const currentSymbol = isXNext ? 'X' : 'O';
    // // Trigger AI if it's AI's turn and game is ongoing
    if (status === GameStatus.PLAYING && currentSymbol === aiSymbol && !isAiThinking) {
      setIsAiThinking(true);
      
      /**
       * // AI thinking simulation processed locally (OFFLINE).
       * // We use a short random delay to make the AI feel natural.
       */
      const thinkTime = 80 + Math.random() * 70;
      
      const timer = setTimeout(() => {
        const aiMove = effectiveDifficulty === 'Easy' ? getEasyMove(board) : getAdvancedMove(board, aiSymbol, effectiveDifficulty);
        
        // // Safety check: if no valid move is returned, abort
        if (aiMove === undefined || aiMove === -1) {
          setIsAiThinking(false);
          return;
        }

        // // Update the board with AI symbol
        const newBoard = [...board];
        newBoard[aiMove] = aiSymbol;
        setBoard(newBoard);

        // // Check for win or draw after the AI move
        const winResult = calculateWinner(newBoard);
        if (winResult) {
          setWinner(winResult);
          setStatus(GameStatus.WON);
          onScoreChange(-50); // // Penalty for losing to AI
        } else if (getAvailableMoves(newBoard).length === 0) {
          setStatus(GameStatus.DRAW);
          onScoreChange(20);
        } else {
          // // Switch turn back to the user
          setIsXNext(!isXNext);
        }
        setIsAiThinking(false);
      }, thinkTime);

      return () => clearTimeout(timer);
    }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isXNext, status, board, effectiveDifficulty, aiSymbol, gameMode, onScoreChange]);

  // // Logic for PICK SYMBOL VIEW (Initial screen)
  if (status === GameStatus.IDLE || !userSymbol) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-slate-50 relative animate-in fade-in duration-500">
        {/* // Return to Menu button */}
        <button 
          onClick={onBackToMenu}
          className="absolute top-10 left-6 text-slate-400 hover:text-orange-500 font-bold flex items-center space-x-2 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          <span className="uppercase tracking-widest text-[10px]">Back</span>
        </button>

        {/* // Choice Card */}
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl w-full max-w-sm border border-slate-100">
          <h2 className="text-2xl font-black text-slate-800 text-center mb-8 uppercase tracking-tight">
            {gameMode === 'Two Player' ? `${user.name}, Choose Side` : 'Pick Your Side'}
          </h2>
          <div className="flex space-x-6">
            {/* // Selector for 'X' */}
            <button 
              onClick={() => startGame('X')}
              className="flex-1 aspect-square bg-slate-50 hover:bg-[#FF6B1A] hover:text-white transition-all rounded-[2rem] flex flex-col items-center justify-center border-2 border-slate-100 hover:border-[#FF6B1A] group shadow-inner active:scale-95"
            >
              <span className="text-6xl font-black mb-2 group-hover:scale-110 transition-transform">X</span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 text-center">Starts Match</span>
            </button>
            {/* // Selector for 'O' */}
            <button 
              onClick={() => startGame('O')}
              className="flex-1 aspect-square bg-slate-50 hover:bg-slate-800 hover:text-white transition-all rounded-[2rem] flex flex-col items-center justify-center border-2 border-slate-100 hover:border-slate-800 group shadow-inner active:scale-95"
            >
              <span className="text-6xl font-black mb-2 group-hover:scale-110 transition-transform">O</span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 text-center">Goes Second</span>
            </button>
          </div>
          
          {/* // Mode Indicator */}
          <div className="mt-8 px-4 py-2 rounded-2xl flex items-center justify-center space-x-2 bg-slate-100 border border-slate-200">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${gameMode === 'Two Player' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
              {gameMode === 'Two Player' ? `Multiplayer: ${user.name} vs ${player2?.name}` : 'Local Offline Arena Active'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // // Main Game Arena View
  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-300">
      {/* // Game Header: Player Indicators */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-200">
        {/* // Back Button */}
        <button 
          onClick={onBackToMenu}
          className="text-slate-400 hover:text-orange-500 transition-colors p-1 mr-3"
          title="Back"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* // Player 1 / User */}
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm ${userSymbol === 'X' ? 'bg-[#FF6B1A]' : 'bg-slate-800'}`}>
            {userSymbol}
          </div>
          <div>
            <h2 className="font-bold text-slate-800 leading-none text-xs">{user.name}</h2>
            <p className="text-[8px] font-black text-slate-400 uppercase mt-1">Pts: {user.score}</p>
          </div>
        </div>

        {/* // VS Indicator */}
        <div className="text-slate-200 font-black text-sm italic">VS</div>

        {/* // Player 2 / AI */}
        <div className="flex items-center space-x-3 flex-row-reverse space-x-reverse text-right">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm ${aiSymbol === 'X' || (gameMode==='Two Player' && userSymbol==='O') ? 'bg-[#FF6B1A]' : 'bg-slate-800'}`}>
            {userSymbol === 'X' ? 'O' : 'X'}
          </div>
          <div>
            <h2 className="font-bold text-slate-800 leading-none text-xs">
              {gameMode === 'Two Player' ? player2?.name : 'BETA_AI'}
            </h2>
            <p className="text-[8px] font-black text-slate-400 uppercase mt-1">
              {gameMode === 'Two Player' ? `Pts: ${player2?.score}` : effectiveDifficulty}
            </p>
          </div>
        </div>
      </div>

      {/* // Central Game Board Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24 relative">
        {/* // 3x3 Grid Board */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[340px] aspect-square">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleMove(i)}
              disabled={!!cell || status !== GameStatus.PLAYING || isAiThinking}
              className={`
                aspect-square rounded-[1.5rem] flex items-center justify-center text-5xl font-black shadow-inner transition-all duration-300
                ${!cell ? 'bg-white hover:bg-slate-50 active:scale-95' : cell === 'X' ? 'bg-[#FF6B1A] text-white animate-in zoom-in duration-300' : 'bg-slate-800 text-white animate-in zoom-in duration-300'}
                ${status !== GameStatus.PLAYING && cell !== winner && 'opacity-30 grayscale'}
                ${cell === winner && 'scale-105 shadow-2xl z-10 border-4 border-white animate-pulse-glow'}
              `}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* // Turn Indicator Widget */}
        <div className="mt-12 h-20 animate-slide-up [animation-delay:300ms]">
          {status === GameStatus.PLAYING && (
            <div className="flex flex-col items-center">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Arena Turn</p>
              <div className="flex items-center space-x-4">
                 <span className={`text-2xl font-black transition-all ${isXNext ? 'text-[#FF6B1A] scale-125' : 'text-slate-200'}`}>X</span>
                 <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${isXNext ? 'w-1/2 translate-x-0 bg-[#FF6B1A]' : 'w-1/2 translate-x-full bg-slate-800'}`} />
                 </div>
                 <span className={`text-2xl font-black transition-all ${!isXNext ? 'text-slate-800 scale-125' : 'text-slate-200'}`}>O</span>
              </div>
              {/* // Thinking/Sub-labels */}
              {isAiThinking && <p className="text-[#FF6B1A] text-[9px] font-black animate-pulse mt-5 uppercase tracking-widest">Local Computing...</p>}
              {!isAiThinking && (
                 <p className="text-slate-400 text-[9px] font-black mt-5 uppercase tracking-widest">
                   Waiting for {isXNext ? (playerX?.name || 'X') : (playerO?.name || 'O')}
                 </p>
              )}
            </div>
          )}
        </div>

        {/* // Game Result Overlay (Displayed on Win/Loss/Draw) */}
        {status !== GameStatus.PLAYING && (
          <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-md z-20 flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-[3.5rem] shadow-2xl border border-slate-100 p-10 flex flex-col items-center text-center">
               {/* // Outcome Icon */}
               <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg ${status === GameStatus.DRAW ? 'bg-slate-100 text-slate-400' : (gameMode === 'Single Player' ? (winner === userSymbol ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600') : 'bg-indigo-100 text-indigo-600')}`}>
                  {status === GameStatus.DRAW ? (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14" /></svg>
                  ) : (winner === userSymbol || gameMode === 'Two Player') ? (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  )}
               </div>

               <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter mb-1">
                 {status === GameStatus.DRAW ? "Arena Draw" : (gameMode === 'Single Player' ? (winner === userSymbol ? "Victory!" : "Defeat!") : `${(winner === 'X' ? playerX : playerO)?.name} Wins!`)}
               </h2>
               
               <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-10">
                 {status === GameStatus.DRAW 
                   ? "+20 POINTS FOR ALL" 
                   : (gameMode === 'Single Player' 
                      ? (winner === userSymbol 
                        ? "POINTS AWARDED" 
                        : "POINTS DEDUCTED") 
                      : "+100 POINTS AWARDED")}
               </p>

               {/* // Action Buttons Post-Game */}
               <div className="w-full space-y-3">
                 <button 
                  onClick={() => startGame(userSymbol!)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl active:scale-95 transition-all"
                 >
                   Rematch
                 </button>
                 <button 
                  onClick={onBackToMenu}
                  className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold uppercase tracking-widest text-sm active:scale-95 transition-all"
                 >
                   Exit Arena
                 </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameView;
