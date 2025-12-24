export interface SocketEmits {
  'room:create': (data: { nickname: string }) => void;
  'room:join': (data: { roomId: string; nickname: string }) => void;
  'room:ready': () => void;
  'game:start': () => void;
  'place_bid': (data: { amount: number }) => void;
  'pass_turn': () => void;
  'p1:chooseProperty': (data: { propertyCardId: string }) => void;
  'p2:submitProperty': (data: { propertyCardId: string }) => void;
}

export interface GameState {
  roomId: string;
  gameState: 'lobby' | 'playing';
  phase: string;
  players: Player[];
  currentProperties: number[];
  currentCheques: number[];
  currentBid: number;
  currentHighBidder: string | null;
  currentTurn: string | null;
  roundNumber: number;
}

export interface Player {
  id: string;
  nickname: string;
  avatar: string;
  isReady: boolean;
  isHost: boolean;
  coins: number;
  propertyCount: number;
  chequeCount: number;
  currentBid: number;
  hasPassed: boolean;
  isCurrentTurn: boolean;
}