import { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { GameScreen } from './components/GameScreen';
import { gameSocket } from '../lib/gameSocket';

type Screen = 'home' | 'lobby' | 'game';

interface Player {
  id: string;
  nickname: string;
  avatar: string;
  isReady: boolean;
  isHost: boolean;
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [roomCode, setRoomCode] = useState('');
  const [currentPlayerId, setCurrentPlayerId] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<any>(null);

  useEffect(() => {
    // Socket 연결
    gameSocket.connect();

    // 방 상태 업데이트 리스너
    const handleRoomState = (state: any) => {
      console.log('Room state updated:', state);
      setGameState(state);
      if (state.players) {
        setPlayers(state.players);
        
        // 현재 플레이어 ID 설정 (소켓 ID 기반)
        const socketId = gameSocket.getSocket()?.id;
        if (socketId) {
          setCurrentPlayerId(socketId);
        }
      }
      if (state.gameState === 'playing') {
        setCurrentScreen('game');
      }
    };

    // 방 파괴 이벤트 리스너
    const handleRoomDestroyed = (data: any) => {
      alert(data.message || '방이 파괴되었습니다.');
      setCurrentScreen('home');
      setRoomCode('');
      setPlayers([]);
      setCurrentPlayerId('');
    };

    gameSocket.onRoomState(handleRoomState);
    gameSocket.onRoomDestroyed(handleRoomDestroyed);

    return () => {
      gameSocket.offRoomState(handleRoomState);
      gameSocket.offRoomDestroyed(handleRoomDestroyed);
    };
  }, []);

  // Mock data for game screen
  const propertyCards: PropertyCard[] = [
    { id: 1, value: 3, name: 'shack', icon: '🏚️', color: 'bg-amber-200' },
    { id: 2, value: 8, name: 'tent', icon: '⛺', color: 'bg-amber-200' },
    { id: 3, value: 12, name: 'apartment', icon: '🏢', color: 'bg-blue-200' },
    { id: 4, value: 15, name: 'house', icon: '🏠', color: 'bg-red-200' },
    { id: 5, value: 22, name: 'mansion', icon: '🏛️', color: 'bg-purple-200' },
    { id: 6, value: 30, name: 'space station', icon: '🛰️', color: 'bg-gray-700' }
  ];

  const handleCreateRoom = async (nickname: string) => {
    console.log('🔄 방 생성 시도:', { nickname });
    
    if (!gameSocket.isSocketConnected()) {
      console.log('❌ Socket 연결되지 않음');
      alert('서버에 연결되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    try {
      const { roomId } = await gameSocket.createRoom(nickname);
      console.log('✅ 방 생성 성공:', roomId);
      setRoomCode(roomId);
      setCurrentScreen('lobby');
    } catch (error) {
      console.error('❌ 방 생성 오류:', error);
      alert('방 생성에 실패했습니다.');
    }
  };

  const handleJoinRoom = async (nickname: string, code: string) => {
    console.log('🔄 방 참가 시도:', { nickname, code });
    
    if (!gameSocket.isSocketConnected()) {
      console.log('❌ Socket 연결되지 않음');
      alert('서버에 연결되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    
    try {
      console.log('✅ Socket 연결 됨');
      await gameSocket.joinRoom(code, nickname);
      console.log('✅ 방 참가 성공');
      setRoomCode(code);
      setCurrentScreen('lobby');
    } catch (error) {
      console.error('❌ 방 참가 오류:', error);
      alert('방 참가에 실패했습니다. 방 코드를 확인해주세요.');
    }
  };

  const handleReady = () => {
    gameSocket.setPlayerReady(true);
  };

  const handleStartGame = () => {
    gameSocket.startGame();
  };

  const handleBid = (amount: number) => {
    gameSocket.placeBid(amount);
  };

  const handlePass = () => {
    gameSocket.passTurn();
  };

  const handleLeaveRoom = () => {
    gameSocket.leaveRoom();
    setCurrentScreen('home');
    setRoomCode('');
    setPlayers([]);
    setCurrentPlayerId('');
  };

  return (
    <div className="size-full">
      {currentScreen === 'home' && (
        <HomeScreen 
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
      )}
      
      {currentScreen === 'lobby' && (
        <LobbyScreen 
          roomCode={roomCode}
          players={players}
          currentPlayerId={currentPlayerId}
          onReady={handleReady}
          onStartGame={handleStartGame}
          onLeaveRoom={handleLeaveRoom}
        />
      )}
      
      {currentScreen === 'game' && gameState && (
        <GameScreen 
          players={players?.map(p => ({ ...p, avatar: '👤' })) || []}
          currentPlayerId={currentPlayerId}
          propertyCards={gameState.currentProperties?.map((value: number) => ({
            id: value,
            value,
            name: 'Property',
            icon: '🏠',
            color: 'bg-blue-500'
          })) || []}
          currentBid={gameState.currentBid || 0}
          currentBidder={gameState.currentHighBidder ? players.find(p => p.id === gameState.currentHighBidder)?.nickname || 'Unknown' : 'None'}
          roundNumber={gameState.roundNumber || 1}
          timeRemaining="02:30"
          onBid={handleBid}
          onPass={handlePass}
        />
      )}
    </div>
  );
}
