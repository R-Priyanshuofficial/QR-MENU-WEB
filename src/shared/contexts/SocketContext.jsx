import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { 
  requestNotificationPermission, 
  showNotificationWithSound,
  getNotificationPermission 
} from '@shared/utils/pushNotifications';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Request browser notification permission on mount
    requestNotificationPermission().then(granted => {
      if (granted) {
        console.log('✅ Browser notification permission granted');
      } else {
        console.log('❌ Browser notification permission denied');
      }
    });

    // Connect socket for both authenticated users and customers
    // Customers will join order rooms even without authentication

    // Create socket connection (adaptive): use current page host for LAN access
    const { protocol, hostname } = window.location;
    const envApi = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
    const derivedBase = `${protocol}//${hostname}:5000`;
    const baseUrl = (!isLocalHost && envApi.includes('localhost'))
      ? derivedBase
      : envApi.replace('/api', '');
    console.log('🔌 Connecting to Socket.io:', baseUrl);
    
    const socketInstance = io(baseUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected successfully!');
      console.log('   Socket ID:', socketInstance.id);
      console.log('   Transport:', socketInstance.io.engine.transport.name);
      setConnected(true);
      
      // Show success toast
      toast.success('Connected to server! 🎉', {
        duration: 2000,
        position: 'bottom-right',
      });
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected. Reason:', reason);
      setConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        socketInstance.connect();
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      console.error('   Make sure backend is running on:', baseUrl);
      setConnected(false);
    });

    socketInstance.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log(`✅ Reconnected after ${attemptNumber} attempts!`);
      toast.success('Reconnected! 🎉', { duration: 2000, position: 'bottom-right' });
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('❌ Failed to reconnect to server');
      toast.error('Cannot connect to server. Please check if backend is running.', {
        duration: 5000,
      });
    });

    // Handle notifications
    socketInstance.on('notification', (notification) => {
      console.log('📢 Notification received:', notification);
      
      // Show toast notification (in-app)
      if (notification.type === 'new_order') {
        toast.success(notification.message, {
          duration: 5000,
          icon: '🎉',
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });

        // Show BROWSER push notification (works even when tab is closed!)
        showNotificationWithSound(notification.title || 'New Order! 🎉', {
          body: notification.message,
          icon: '/favicon.ico',
          tag: 'new-order',
          data: notification.data,
        });
      } else if (notification.type === 'order_ready') {
        toast.success(notification.message, {
          duration: 5000,
          icon: '🎉',
          style: {
            background: '#3B82F6',
            color: '#fff',
          },
        });

        // Show BROWSER push notification
        showNotificationWithSound(notification.title || 'Order Ready! 🎉', {
          body: notification.message,
          icon: '/favicon.ico',
          tag: 'order-ready',
          data: notification.data,
          requireInteraction: true, // Keeps notification visible
        });
      } else if (notification.type === 'order_status') {
        toast.info(notification.message, {
          duration: 4000,
        });

        // Show BROWSER push notification
        showNotificationWithSound(notification.title || 'Order Update', {
          body: notification.message,
          icon: '/favicon.ico',
          tag: 'order-status',
          data: notification.data,
        });
      } else if (notification.type === 'test') {
        // Test notifications
        toast.success(notification.message, {
          duration: 4000,
        });

        showNotificationWithSound(notification.title || 'Test', {
          body: notification.message,
          icon: '/favicon.ico',
        });
      }
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []); // Only initialize once on mount

  // Join owner room when authenticated
  useEffect(() => {
    if (socket && connected && isAuthenticated && user?.id) {
      socket.emit('owner:join', user.id);
      console.log('👨‍💼 Owner joined room:', user.id);
    }
  }, [socket, connected, isAuthenticated, user]);

  const joinOrderRoom = (orderId, phone) => {
    if (socket && connected) {
      socket.emit('customer:join', { orderId, phone });
      console.log('👤 Customer joined order room:', orderId);
    }
  };

  const value = {
    socket,
    connected,
    joinOrderRoom,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
