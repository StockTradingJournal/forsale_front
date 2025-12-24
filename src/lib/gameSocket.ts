import { io, Socket } from 'socket.io-client';

class GameSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect() {
    if (this.socket) {
      return this.socket;
    }

    this.socket = io('http://localhost:8000', {
      transports: ['polling', 'websocket'],
      upgrade: true,
      rememberUpgrade: false,
      timeout: 20000,
      forceNew: true,
      withCredentials: false,
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to game server, socket ID:', this.socket?.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from game server, reason:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔥 Connection error:', error);
    });

    this.socket.on('room:error', (error) => {
      console.error('Room error:', error);
      alert(error.message || '오류가 발생했습니다.');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  createRoom(nickname: string): Promise<{ roomId: string }> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      console.log('📤 Sending create_room event:', { nickname });
      this.socket.emit('create_room', { nickname });

      const timeout = setTimeout(() => {
        this.socket?.off('room:created', handleSuccess);
        this.socket?.off('room:error', handleError);
        reject(new Error('방 생성 시간 초과'));
      }, 10000);

      const handleSuccess = (data: any) => {
        console.log('📥 Received room:created:', data);
        clearTimeout(timeout);
        this.socket?.off('room:error', handleError);
        resolve(data);
      };

      const handleError = (error: any) => {
        console.log('📥 Received room:error:', error);
        clearTimeout(timeout);
        this.socket?.off('room:created', handleSuccess);
        reject(new Error(error.message));
      };

      this.socket.once('room:created', handleSuccess);
      this.socket.once('room:error', handleError);
    });
  }

  joinRoom(roomId: string, nickname: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      console.log('📤 Sending join_room event:', { roomId, nickname });
      this.socket.emit('join_room', { roomId, nickname });

      const timeout = setTimeout(() => {
        this.socket?.off('room:joined', handleJoined);
        this.socket?.off('room:state', handleState);
        this.socket?.off('room:error', handleError);
        reject(new Error('방 참가 시간 초과'));
      }, 10000);

      const handleJoined = (data: any) => {
        console.log('📥 Received room:joined:', data);
        clearTimeout(timeout);
        this.socket?.off('room:state', handleState);
        this.socket?.off('room:error', handleError);
        resolve();
      };

      const handleState = (state: any) => {
        console.log('📥 Received room:state:', state);
        clearTimeout(timeout);
        this.socket?.off('room:joined', handleJoined);
        this.socket?.off('room:error', handleError);
        resolve();
      };

      const handleError = (error: any) => {
        console.log('📥 Received room:error:', error);
        clearTimeout(timeout);
        this.socket?.off('room:joined', handleJoined);
        this.socket?.off('room:state', handleState);
        reject(new Error(error.message));
      };

      this.socket.once('room:joined', handleJoined);
      this.socket.once('room:state', handleState);
      this.socket.once('room:error', handleError);
    });
  }

  setPlayerReady(ready: boolean) {
    if (this.socket) {
      this.socket.emit('player_ready', { ready });
    }
  }

  startGame() {
    if (this.socket) {
      this.socket.emit('start_game', {});
    }
  }

  placeBid(amount: number) {
    if (this.socket) {
      this.socket.emit('place_bid', { amount });
    }
  }

  passTurn() {
    if (this.socket) {
      this.socket.emit('pass_turn', {});
    }
  }

  playCard(cardId: string) {
    if (this.socket) {
      this.socket.emit('play_card', { cardId });
    }
  }

  leaveRoom() {
    if (this.socket) {
      this.socket.emit('leave_room', {});
    }
  }

  onRoomState(callback: (state: any) => void) {
    if (this.socket) {
      this.socket.on('room:state', callback);
    }
  }

  offRoomState(callback: (state: any) => void) {
    if (this.socket) {
      this.socket.off('room:state', callback);
    }
  }

  onRoomDestroyed(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('room:destroyed', callback);
    }
  }

  offRoomDestroyed(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.off('room:destroyed', callback);
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected;
  }
}

export const gameSocket = new GameSocketService();