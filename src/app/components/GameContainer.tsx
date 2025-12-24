'use client';

import { useState, useEffect } from 'react';
import { GameScreen } from './GameScreen';
import { GameState, Player } from '../../lib/socket-types';

interface GameContainerProps {
  gameState: GameState;
  currentPlayerId: string;
  onBid: (amount: number) => void;
  onPass: () => void;
}

export function GameContainer({ gameState, currentPlayerId, onBid, onPass }: GameContainerProps) {
  // Transform the game state data for the GameScreen component
  const transformedPlayers: Player[] = gameState.players.map(player => ({
    ...player,
    avatar: '👤', // Default avatar
  }));

  return (
    <GameScreen
      players={transformedPlayers}
      currentPlayerId={currentPlayerId}
      currentProperties={gameState.currentProperties}
      currentBid={gameState.currentBid}
      currentHighBidder={gameState.currentHighBidder}
      roundNumber={gameState.roundNumber}
      onBid={onBid}
      onPass={onPass}
    />
  );
}