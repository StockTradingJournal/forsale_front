'use client';

import { useState } from 'react';

// 임시 타입 정의
interface Player {
  id: string;
  nickname: string;
  money: number;
}

interface PropertyCard {
  id: string;
  value: number;
}

interface PublicState {
  players: Player[];
  currentTurn?: string;
  currentPropertyCard?: PropertyCard;
  phase: string;
  bids: Record<string, number>;
}

interface PrivateState {
  playerId: string;
  money: number;
  propertyCards: PropertyCard[];
}

// 임시 훅
const useGameStore = () => ({
  publicState: null as PublicState | null,
  privateState: null as PrivateState | null
});

const useSocket = (roomId: string) => ({
  emit: (event: string, data: any) => console.log(event, data)
});

interface GameScreenProps {
  roomId: string;
}

export const GameScreen = ({ roomId }: GameScreenProps) => {
  const { publicState, privateState } = useGameStore();
  const { emit } = useSocket(roomId);
  const [selectedBid, setSelectedBid] = useState(0);

  if (!publicState || !privateState) return <div>Loading...</div>;

  const isMyTurn = publicState.currentTurn === privateState.playerId;
  const currentProperty = publicState.currentPropertyCard;

  const handleBid = () => {
    if (selectedBid > 0 && isMyTurn) {
      emit('place_bid', { amount: selectedBid });
    }
  };

  const handlePass = () => {
    if (isMyTurn) {
      emit('pass_turn');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4">
      {/* Top Players Row */}
      <div className="flex justify-between mb-6">
        {publicState.players.slice(0, 6).map((player) => (
          <div 
            key={player.id}
            className={`relative w-16 h-16 rounded-full border-4 ${
              player.id === publicState.currentTurn 
                ? 'border-yellow-400 shadow-lg' 
                : 'border-white'
            }`}
          >
            <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">{player.nickname.slice(0, 2)}</span>
            </div>
            {publicState.bids[player.id] === 0 && (
              <div className="absolute inset-0 bg-red-500 bg-opacity-80 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">PASS</span>
              </div>
            )}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded px-1">
              <span className="text-xs">${player.money}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
        {Array.from({ length: 6 }, (_, index) => (
          <div 
            key={index}
            className={`aspect-[3/4] rounded-lg border-2 flex items-center justify-center ${
              index === 0 && currentProperty
                ? 'bg-yellow-200 border-yellow-400'
                : 'bg-white border-gray-300'
            }`}
          >
            {index === 0 && currentProperty ? (
              <span className="text-2xl font-bold">{currentProperty.value}</span>
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            )}
          </div>
        ))}
      </div>

      {/* Bidding Controls */}
      {publicState.phase === 'phase1' && (
        <div className="bg-white rounded-lg p-4 mx-auto max-w-md">
          <div className="grid grid-cols-5 gap-2 mb-4">
            {Array.from({ length: Math.min(privateState.money + 1, 21) }, (_, i) => (
              <button
                key={i}
                className={`p-2 rounded border-2 ${
                  selectedBid === i 
                    ? 'border-blue-500 bg-blue-100' 
                    : 'border-gray-300'
                }`}
                onClick={() => setSelectedBid(i)}
              >
                {i}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              className={`flex-1 py-3 rounded-lg font-bold ${
                isMyTurn && selectedBid > 0
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-500'
              }`}
              onClick={handleBid}
              disabled={!isMyTurn || selectedBid === 0}
            >
              BID ${selectedBid}
            </button>
            
            <button
              className={`flex-1 py-3 rounded-lg font-bold ${
                isMyTurn
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-300 text-gray-500'
              }`}
              onClick={handlePass}
              disabled={!isMyTurn}
            >
              PASS
            </button>
          </div>
        </div>
      )}

      {/* My Cards */}
      <div className="mt-6">
        <h3 className="text-white text-center mb-2">My Cards</h3>
        <div className="flex justify-center gap-2">
          {privateState.propertyCards.map((card) => (
            <div 
              key={card.id}
              className="w-12 h-16 bg-white rounded border flex items-center justify-center"
            >
              <span className="text-sm font-bold">{card.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};