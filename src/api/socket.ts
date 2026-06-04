import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const getSocketUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) return 'http://localhost:9005';

  try {
    const url = new URL(apiUrl);
    return url.origin; // Trích xuất origin để tránh coi '/api/v1' là namespace
  } catch (e) {
    // Nếu là đường dẫn tương đối (như '/api/v1'), trả về chuỗi rỗng
    // để Socket.io dùng chính origin của trang hiện tại
    return '';
  }
};

export const connectSocket = (token: string): Socket => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(getSocketUrl(), {
    auth: {
      token: `Bearer ${token}`
    },
    transports: ['polling', 'websocket'], // Start with polling then upgrade
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected successfully');
  });

  socket.on('disconnect', (reason: string) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('connect_error', (error: Error) => {
    console.error('⚠️ Socket connection error:', error);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => {
  return socket;
};
