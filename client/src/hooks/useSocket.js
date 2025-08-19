import { useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';
import config from '../config/config';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const socketRef = useRef(null);

  // Conectar ao socket
  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    socketRef.current = io(config.SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Eventos de conexão
    socketRef.current.on('connect', () => {
      console.log('🔌 Conectado ao servidor');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Desconectado do servidor');
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('❌ Erro de conexão:', error);
      setIsConnected(false);
    });

    // Eventos de reconexão
    socketRef.current.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Reconectado após ${attemptNumber} tentativas`);
      setIsConnected(true);
    });

    socketRef.current.on('reconnect_error', (error) => {
      console.error('❌ Erro na reconexão:', error);
    });

    socketRef.current.on('reconnect_failed', () => {
      console.error('❌ Falha na reconexão após todas as tentativas');
    });
  }, []);

  // Desconectar do socket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // Emitir evento
  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
      return true;
    }
    console.warn('⚠️ Socket não conectado');
    return false;
  }, []);

  // Escutar evento
  const on = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, (data) => {
        setLastMessage({ event, data, timestamp: Date.now() });
        callback(data);
      });
    }
  }, []);

  // Parar de escutar evento
  const off = useCallback((event) => {
    if (socketRef.current) {
      socketRef.current.off(event);
    }
  }, []);

  // Conectar automaticamente
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    lastMessage,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
};
