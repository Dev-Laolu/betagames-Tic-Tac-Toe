// ==========================================
// GAME LOGIC SERVICES
// ==========================================

import { Player, Difficulty } from '../types';

// // LEVEL HIERARCHY AND THRESHOLDS
// // Used for progression tracking and UI display
export const LEVEL_THRESHOLDS: { label: Difficulty; score: number }[] = [
  { label: 'Demigod', score: 6000 },
  { label: 'Ascendant', score: 5500 },
  { label: 'Immortal', score: 5000 },
  { label: 'Legend', score: 4500 },
  { label: 'Titan', score: 4000 },
  { label: 'Warlord', score: 3500 },
  { label: 'Grandmaster', score: 3000 },
  { label: 'Strategist', score: 2500 },
  { label: 'Elite', score: 2000 },
  { label: 'Superstar', score: 1500 },
  { label: 'Advanced', score: 500 },
  { label: 'Easy', score: 0 },
];

/**
 * // Returns the Difficulty level based on the current score.
 * // Iterates through thresholds to find the highest matched rank.
 */
export const getLevel = (score: number): Difficulty => {
  const level = LEVEL_THRESHOLDS.find((threshold) => score >= threshold.score);
  return level ? level.label : 'Easy';
};
/**
 * // Calculates the winner of the Tic-Tac-Toe game.
 * // Checks all possible winning lines (horizontal, vertical, diagonal).
 */
export const calculateWinner = (squares: Player[]): Player => {
  // // Define all possible winning combinations
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  // // Iterate through each line to check if all three positions have the same player symbol
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // // Return the symbol of the winner ('X' or 'O')
      return squares[a];
    }
  }

  // // Return null if no winner is found
  return null;
};

/**
 * // Retrieves a list of available (null) move indices on the board.
 */
export const getAvailableMoves = (squares: Player[]): number[] => {
  // // Map through squares and collect indices where the value is null
  return squares.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null) as number[];
};

/**
 * // EASY AI: Logic for making a random move.
 * // Selects a random index from the available moves.
 */
export const getEasyMove = (squares: Player[]): number => {
  // // Get list of all available move positions
  const moves = getAvailableMoves(squares);
  // // Return a randomly selected move from the list
  return moves[Math.floor(Math.random() * moves.length)];
};

/**
 * // ADVANCED AI: Logic for making an optimal move using the Minimax Algorithm.
 * // Aims to maximize the AI's score and minimize the opponent's.
 */
export const getAdvancedMove = (squares: Player[], aiSymbol: Player): number => {
  let bestScore = -Infinity;
  let move = -1;
  // // Create a copy of the current board state
  const board = [...squares];
  // // Identify the opponent's symbol
  const opponentSymbol = aiSymbol === 'X' ? 'O' : 'X';

  // // Loop through all positions on the board
  for (let i = 0; i < 9; i++) {
    // // If the position is empty, simulate a move
    if (board[i] === null) {
      board[i] = aiSymbol; // // Use the provided AI symbol
      // // Calculate the score for this move using Minimax
      const score = minimax(board, 0, false, aiSymbol, opponentSymbol);
      // // Reset the position to null after evaluation (backtracking)
      board[i] = null;
      // // If this score is better than the previous best, update the move
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  // // Return the best possible move discovered
  return move;
};

// // Score mapping for Minimax outcomes
const scores: Record<string, number> = {
  WIN: 10,
  LOSS: -10,
  TIE: 0
};

/**
 * // Recursive Minimax function to evaluate board states.
 * // Considers all possible future moves to determine the optimal current move.
 */
function minimax(
  board: Player[], 
  depth: number, 
  isMaximizing: boolean, 
  aiSymbol: Player, 
  opponentSymbol: Player
): number {
  // // Check if the game has reached an end state (win/lose/draw)
  const result = calculateWinner(board);
  if (result === aiSymbol) return scores.WIN - depth; // // AI wins: Prioritize faster wins
  if (result === opponentSymbol) return scores.LOSS + depth; // // Opponent wins: Prioritize delaying loss
  if (getAvailableMoves(board).length === 0) return scores.TIE; // // Draw scenario

  // // MAXIMIZING PLAYER (AI)
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = aiSymbol; // // Try a move for AI
        const score = minimax(board, depth + 1, false, aiSymbol, opponentSymbol);
        board[i] = null; // // Backtrack
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } 
  // // MINIMIZING PLAYER (Human)
  else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = opponentSymbol; // // Try a move for opponent
        const score = minimax(board, depth + 1, true, aiSymbol, opponentSymbol);
        board[i] = null; // // Backtrack
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}
