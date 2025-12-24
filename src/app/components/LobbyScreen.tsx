import { useState } from 'react';
import { Menu, Settings, CheckCircle2, Crown } from 'lucide-react';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface Player {
  id: string;
  nickname: string;
  avatar: string;
  isReady: boolean;
  isHost: boolean;
}

interface LobbyScreenProps {
  roomCode: string;
  players: Player[];
  currentPlayerId: string;
  onReady: () => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

export function LobbyScreen({ roomCode, players, currentPlayerId, onReady, onStartGame, onLeaveRoom }: LobbyScreenProps) {
  const [chatMessages] = useState([
    { player: '유저A', message: '안녕하세요!' },
    { player: '유저C', message: '준비 완료!' },
    { player: '유저D', message: '같이 하세요!' }
  ]);

  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const maxPlayers = 6;
  const emptySlots = maxPlayers - players.length;

  return (
    <div className="min-h-screen bg-sky-400 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">🏠</div>
        <div className="absolute top-32 right-16 text-5xl">💰</div>
        <div className="absolute bottom-40 left-20 text-5xl">🏡</div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between mb-4">
          <button className="w-12 h-12 bg-sky-500 rounded-2xl border-3 border-sky-700 flex items-center justify-center shadow-md">
            <Menu className="w-6 h-6 text-white" />
          </button>
          
          <div className="flex-1 mx-4 bg-gray-700 rounded-2xl px-6 py-3 border-3 border-gray-900">
            <span className="text-white font-black">게임 대기실 - 방 번호: {roomCode}</span>
          </div>
          
          <button className="w-12 h-12 bg-sky-500 rounded-2xl border-3 border-sky-700 flex items-center justify-center shadow-md">
            <Settings className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Room Info */}
        <div className="bg-gray-600 rounded-2xl px-6 py-2 inline-block border-3 border-gray-800 mb-6">
          <span className="text-white font-black">모드: 일반 게임 | 인원: {players.length}/{maxPlayers}</span>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {players.map((player) => (
            <div key={player.id} className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 bg-sky-300 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl">
                  {player.avatar}
                </div>
                {player.isHost && (
                  <div className="absolute -top-2 -left-2">
                    <Crown className="w-8 h-8 text-yellow-400 drop-shadow-lg" />
                  </div>
                )}
                {player.isReady && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div className="mt-2 bg-gray-600 rounded-full px-4 py-1 border-2 border-gray-800">
                <span className="text-white font-black">{player.nickname}</span>
              </div>
            </div>
          ))}
          
          {/* Empty slots */}
          {Array.from({ length: emptySlots }).map((_, index) => (
            <div key={`empty-${index}`} className="flex flex-col items-center">
              <div className="w-24 h-24 border-4 border-dashed border-white/50 rounded-full flex items-center justify-center">
                <div className="text-white/50 text-5xl">+</div>
              </div>
              <div className="mt-2 bg-gray-500/50 rounded-full px-4 py-1 border-2 border-gray-700/50">
                <span className="text-white/50 font-black">대기 중...</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Box */}
        <div className="bg-amber-50 rounded-2xl p-4 border-4 border-gray-800 shadow-lg mb-6">
          <div className="space-y-2 h-24 overflow-y-auto">
            {chatMessages.map((msg, index) => (
              <div key={index} className="text-sm">
                <span className="font-black text-blue-600">{msg.player}:</span>{' '}
                <span className="text-gray-700">{msg.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section - Player Info & Controls */}
        <div className="bg-amber-50 rounded-2xl p-4 border-4 border-gray-800 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Current Player Info */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-sky-300 rounded-full border-4 border-white shadow-md flex items-center justify-center text-3xl">
                {currentPlayer?.avatar || '👤'}
              </div>
              <div className="flex flex-col items-center">
                <span className="font-black text-gray-700">{currentPlayer?.nickname || '나'}</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    <span className="text-2xl">💰</span>
                    <span className="ml-1 text-sm">내 자본:</span>
                  </div>
                  <span className="font-black text-red-600">12,000</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {currentPlayer?.isHost ? (
                <Button
                  onClick={onStartGame}
                  disabled={players.length < 3 || !players.filter(p => !p.isHost).every(p => p.isReady)}
                  className="h-14 px-8 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-2xl border-3 border-green-700 text-white font-black"
                >
                  시작
                  <div className="text-xs">(호스트)</div>
                </Button>
              ) : (
                <Button
                  onClick={onReady}
                  className="h-14 px-8 bg-blue-500 hover:bg-blue-600 rounded-2xl border-3 border-blue-700 text-white font-black"
                >
                  준비
                  <div className="text-xs">{currentPlayer?.isReady ? '준비 완료' : '준비 대기'}</div>
                </Button>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-12 bg-gray-600 hover:bg-gray-700 rounded-2xl border-3 border-gray-800 text-white font-black"
                >
                  초대하기
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 h-12 bg-red-500 hover:bg-red-600 rounded-2xl border-3 border-red-700 text-white font-black"
                    >
                      나가기
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>방 나가기</AlertDialogTitle>
                      <AlertDialogDescription>
                        {currentPlayer?.isHost 
                          ? '호스트가 나가면 방이 파괴됩니다. 정말 나가시겠습니까?'
                          : '정말 방을 나가시겠습니까?'
                        }
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction onClick={onLeaveRoom}>나가기</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
