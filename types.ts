
export type Player = 'X' | 'O' | null;
export type GameSymbol = 'X' | 'O';
export type Difficulty = 
  | 'Easy' | 'Average' | 'Advanced' | 'Superstar' | 'Elite' | 'Strategist' 
  | 'Grandmaster' | 'Warlord' | 'Titan' | 'Legend' | 'Immortal' | 'Ascendant' | 'Demigod';

export interface User {
  name: string;
  score: number;
  avatar: 'male' | 'female';
  preferredDifficulty: Difficulty;
  lossesCount?: number;
  drawsCount?: number;
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  WON = 'WON',
  DRAW = 'DRAW'
}

export type GameMode = 'Single Player' | 'Two Player';

export interface GameState {
  board: Player[];
  isXNext: boolean;
  status: GameStatus;
  winner: Player;
  gameMode: GameMode;
}
