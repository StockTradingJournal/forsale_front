import { useState } from 'react';
import { Menu, Settings, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

interface Player {
  id: string;
  nickname: string;
  avatar: string;
  coins?: number;
  currentBid?: number;
  hasPassed?: boolean;
  isCurrentTurn?: boolean;
}

interface PropertyCard {
  id: number;
  value: number;
  name: string;
  icon: string;
  color: string;
}

interface GameScreenProps {
  players: Player[];
  currentPlayerId: string;
  propertyCards: PropertyCard[];
  currentBid: number;
  currentBidder: string;
  roundNumber: number;
  timeRemaining: string;
  onBid: (amount: number) => void;
  onPass: () => void;
}

export function GameScreen({ 
  players, 
  currentPlayerId, 
  propertyCards,
  currentBid,
  currentBidder,
  roundNumber,
  timeRemaining,
  onBid,
  onPass
}: GameScreenProps) {
  const [bidAmount, setBidAmount] = useState(currentBid + 1000);
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const otherPlayers = players.filter(p => p.id !== currentPlayerId);
  const playerMoney = currentPlayer?.coins || 18000;
  const playerCurrentBid = currentPlayer?.currentBid || 0;
  
  // Calculate penalty: if no previous bid, penalty is 0. Otherwise, floor(currentBid / 2 / 500) * 500
  const passPenalty = playerCurrentBid === 0 ? 0 : Math.floor(playerCurrentBid / 2 / 500) * 500;

  const handleBidChange = (value: number[]) => {
    setBidAmount(value[0]);
  };

  const addToBid = (amount: number) => {
    setBidAmount(Math.min(bidAmount + amount, playerMoney));
  };

  return (
    <div className="min-h-screen bg-sky-400 flex flex-col relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-4xl">🏠</div>
        <div className="absolute top-32 right-16 text-4xl">💰</div>
        <div className="absolute bottom-40 left-20 text-4xl">🏡</div>
      </div>

      {/* Top Section - Header & Opponents */}
      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button className="w-10 h-10 bg-sky-500 rounded-xl border-3 border-sky-700 flex items-center justify-center shadow-md">
            <Menu className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex-1 mx-3">
            <div className="bg-gray-600 rounded-xl px-4 py-2 border-3 border-gray-800 mb-1">
              <span className="text-white font-black text-sm">라운드 {roundNumber}/4 - 경매 단계</span>
            </div>
            <div className="bg-yellow-400 rounded-xl px-4 py-2 border-3 border-yellow-600 flex items-center justify-center">
              <span className="text-gray-800 font-black text-sm mr-2">⏱️</span>
              <span className="text-gray-800 font-black">{timeRemaining}</span>
            </div>
          </div>
          
          <button className="w-10 h-10 bg-sky-500 rounded-xl border-3 border-sky-700 flex items-center justify-center shadow-md">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Opponents */}
        <div className="flex justify-around gap-2 mb-4">
          {otherPlayers?.map((player) => (
            <div key={player.id} className="flex flex-col items-center">
              <div className={`relative ${player.isCurrentTurn ? 'ring-4 ring-yellow-300 rounded-full' : ''}`}>
                <div className={`w-14 h-14 ${player.hasPassed ? 'bg-gray-400' : 'bg-sky-300'} rounded-full border-3 border-white shadow-md flex items-center justify-center text-xl relative`}>
                  {player.avatar}
                  {player.hasPassed && (
                    <div className="absolute inset-0 bg-red-500/80 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-white font-black text-xs transform -rotate-12">PASS</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-1 bg-gray-600 rounded-full px-2 py-0.5 border-2 border-gray-800">
                <span className="text-white font-black text-xs">{player.nickname}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Section - Game Table */}
      <div className="flex-1 bg-gradient-to-b from-orange-300 to-orange-400 border-t-4 border-b-4 border-orange-600 px-4 py-6 relative">
        {/* Coin stacks decoration */}
        <div className="absolute top-4 left-8 flex gap-1">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col-reverse">
              {Array.from({ length: i + 1 }).map((_, j) => (
                <div key={j} className="w-6 h-2 bg-yellow-400 rounded-full border border-yellow-600 -mb-1" />
              ))}
            </div>
          ))}
        </div>
        <div className="absolute top-4 right-8 flex gap-1">
          {[2, 3, 2].map((count, i) => (
            <div key={i} className="flex flex-col-reverse">
              {Array.from({ length: count }).map((_, j) => (
                <div key={j} className="w-6 h-2 bg-yellow-400 rounded-full border border-yellow-600 -mb-1" />
              ))}
            </div>
          ))}
        </div>

        {/* Property Cards */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {propertyCards?.map((card) => (
            <div key={card.id} className="relative">
              <div className={`bg-white rounded-xl border-3 border-gray-800 shadow-lg overflow-hidden`}>
                <div className={`${card.color} px-2 py-1 border-b-2 border-gray-800`}>
                  <span className="font-black text-xs">{card.value}</span>
                </div>
                <div className="p-2 flex flex-col items-center">
                  <div className="text-3xl mb-1">{card.icon}</div>
                  <span className="text-xs font-black text-gray-700">{card.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Bid Display */}
        <div className="bg-yellow-400 rounded-2xl p-4 border-4 border-yellow-600 shadow-lg relative overflow-hidden">
          {/* Floating coins animation */}
          <div className="absolute right-4 top-2 text-2xl animate-bounce">💰</div>
          <div className="absolute right-12 bottom-2 text-xl animate-bounce delay-100">🪙</div>
          
          <div className="text-center">
            <div className="font-black text-sm text-gray-700 mb-1">현재 최고가:</div>
            <div className="text-4xl font-black text-gray-900">{currentBid.toLocaleString()}</div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-8 h-8 bg-sky-300 rounded-full border-2 border-white flex items-center justify-center text-sm">
                👤
              </div>
              <span className="font-black text-gray-700">{currentBidder}'s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Player Controls */}
      <div className="relative z-10 bg-amber-50 border-t-4 border-gray-800 p-4">
        <div className="flex gap-4">
          {/* Player Info */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-sky-300 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl">
              {currentPlayer?.avatar || '👤'}
            </div>
            <span className="mt-1 font-black text-gray-700">{currentPlayer?.nickname || '나'}</span>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xl">💰</span>
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-600">내 자본:</span>
                <span className="font-black text-red-600">{playerMoney.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1">
            {/* Bid Slider */}
            <div className="mb-3">
              <Slider
                value={[bidAmount]}
                onValueChange={currentPlayer?.isCurrentTurn ? handleBidChange : () => {}}
                min={currentBid + 500}
                max={playerMoney}
                step={500}
                className="mb-2"
                disabled={!currentPlayer?.isCurrentTurn}
              />
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => currentPlayer?.isCurrentTurn && addToBid(-500)}
                  disabled={!currentPlayer?.isCurrentTurn}
                  className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-black text-white ${
                    currentPlayer?.isCurrentTurn 
                      ? 'bg-sky-500 border-sky-700 hover:bg-sky-600' 
                      : 'bg-gray-300 border-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  -
                </button>
                <button
                  onClick={() => currentPlayer?.isCurrentTurn && addToBid(1000)}
                  disabled={!currentPlayer?.isCurrentTurn}
                  className={`flex-1 h-10 rounded-lg border-2 flex items-center justify-center font-black text-white text-sm ${
                    currentPlayer?.isCurrentTurn 
                      ? 'bg-sky-500 border-sky-700 hover:bg-sky-600' 
                      : 'bg-gray-300 border-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  1,000
                </button>
                <button
                  onClick={() => currentPlayer?.isCurrentTurn && addToBid(2000)}
                  disabled={!currentPlayer?.isCurrentTurn}
                  className={`flex-1 h-10 rounded-lg border-2 flex items-center justify-center font-black text-white text-sm ${
                    currentPlayer?.isCurrentTurn 
                      ? 'bg-sky-500 border-sky-700 hover:bg-sky-600' 
                      : 'bg-gray-300 border-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  2,000
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={() => currentPlayer?.isCurrentTurn && onBid(bidAmount)}
                disabled={!currentPlayer?.isCurrentTurn}
                className={`w-full h-14 rounded-2xl border-3 text-white font-black ${
                  currentPlayer?.isCurrentTurn 
                    ? 'bg-green-500 hover:bg-green-600 border-green-700' 
                    : 'bg-gray-300 border-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                BID
                <div className="text-xs">({bidAmount.toLocaleString()} 입찰하기)</div>
              </Button>
              <Button
                onClick={currentPlayer?.isCurrentTurn ? onPass : () => {}}
                className={`w-full h-12 rounded-2xl border-3 text-white font-black ${
                  currentPlayer?.isCurrentTurn 
                    ? 'bg-red-500 hover:bg-red-600 border-red-700' 
                    : 'bg-gray-300 border-gray-400 cursor-not-allowed opacity-50'
                }`}
                disabled={!currentPlayer?.isCurrentTurn}
              >
                PASS
                <div className="text-xs">(패널티: {passPenalty.toLocaleString()})</div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
