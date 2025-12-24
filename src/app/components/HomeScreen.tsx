import { useState } from 'react';
import { Home, LogIn, Settings, HelpCircle, BarChart3, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface HomeScreenProps {
  onCreateRoom: (nickname: string) => void;
  onJoinRoom: (nickname: string, roomCode: string) => void;
}

export function HomeScreen({ onCreateRoom, onJoinRoom }: HomeScreenProps) {
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleCreateRoom = () => {
    if (nickname.trim()) {
      onCreateRoom(nickname);
    }
  };

  const handleJoinRoom = () => {
    if (nickname.trim() && roomCode.trim()) {
      onJoinRoom(nickname, roomCode);
    }
  };

  return (
    <div className="min-h-screen bg-sky-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl">🏠</div>
        <div className="absolute top-32 right-16 text-5xl">💰</div>
        <div className="absolute bottom-40 left-20 text-5xl">🏡</div>
        <div className="absolute top-1/2 right-10 text-6xl">💼</div>
        <div className="absolute bottom-20 right-1/4 text-5xl">🏠</div>
        <div className="absolute top-20 left-1/3 text-4xl">💰</div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <h1 className="text-6xl font-black text-orange-400 [text-shadow:_4px_4px_0_#8B4513,_-2px_-2px_0_#FFF,_2px_-2px_0_#FFF,_-2px_2px_0_#FFF,_2px_2px_0_#FFF] tracking-wider">
              FOR SALE
            </h1>
            <h2 className="text-4xl font-black text-yellow-300 [text-shadow:_3px_3px_0_#8B4513,_-2px_-2px_0_#FFF,_2px_-2px_0_#FFF,_-2px_2px_0_#FFF,_2px_2px_0_#FFF] -mt-2">
              모바일
            </h2>
            {/* Floating coins */}
            <div className="absolute -top-4 -left-8 text-4xl animate-bounce">💰</div>
            <div className="absolute -top-2 -right-8 text-3xl animate-bounce delay-100">🪙</div>
          </div>
        </div>

        {/* Nickname Input Section */}
        <div className="bg-amber-50 rounded-3xl p-6 mb-6 border-4 border-gray-800 shadow-lg">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-sky-300 rounded-full border-4 border-white shadow-md flex items-center justify-center text-4xl">
                👤
              </div>
              <span className="mt-2 font-black text-gray-700">나</span>
            </div>
            
            {/* Input with edit button */}
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="닉네임 입력"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="h-14 pl-4 pr-14 rounded-2xl border-3 border-gray-400 bg-gray-100 text-gray-700 placeholder:text-gray-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center border-2 border-sky-700">
                <Edit className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Create Room Button */}
        <Button
          onClick={handleCreateRoom}
          className="w-full h-20 bg-green-500 hover:bg-green-600 rounded-2xl border-4 border-green-700 shadow-lg mb-6 text-white text-2xl font-black"
        >
          <Home className="w-8 h-8 mr-2" />
          방 만들기
        </Button>

        {/* Join Room Section */}
        <div className="bg-amber-50 rounded-3xl p-4 border-4 border-gray-800 shadow-lg">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="방 코드 6자리 입력"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              maxLength={6}
              className="flex-1 h-14 px-4 rounded-2xl border-3 border-gray-400 bg-gray-100 text-gray-700 placeholder:text-gray-500"
            />
            <Button
              onClick={handleJoinRoom}
              className="h-14 px-8 bg-sky-500 hover:bg-sky-600 rounded-2xl border-3 border-sky-700 text-white font-black"
            >
              <LogIn className="w-5 h-5 mr-2" />
              참가
            </Button>
          </div>
        </div>

        {/* Bottom Icons */}
        <div className="flex justify-center gap-4 mt-8">
          <button className="w-14 h-14 bg-sky-400 hover:bg-sky-500 rounded-2xl border-3 border-sky-600 flex items-center justify-center shadow-md">
            <Settings className="w-7 h-7 text-white" />
          </button>
          <button className="w-14 h-14 bg-sky-400 hover:bg-sky-500 rounded-2xl border-3 border-sky-600 flex items-center justify-center shadow-md">
            <HelpCircle className="w-7 h-7 text-white" />
          </button>
          <button className="w-14 h-14 bg-sky-400 hover:bg-sky-500 rounded-2xl border-3 border-sky-600 flex items-center justify-center shadow-md">
            <BarChart3 className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
