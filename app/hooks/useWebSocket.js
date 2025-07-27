'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNotifications } from './useNotifications';

export const useWebSocket = (url, options = {}) => {
  const {
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatInterval = 30000,
    onOpen = null,
    onMessage = null,
    onClose = null,
    onError = null,
    autoConnect = true
  } = options;

  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [lastMessage, setLastMessage] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  
  const websocketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const heartbeatTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  
  const notifications = useNotifications();

  // Conectar WebSocket
  const connect = useCallback(() => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      setConnectionStatus('Connecting');
      
      // Simular WebSocket para demo (en producción usar real WebSocket)
      const mockWebSocket = {
        readyState: WebSocket.OPEN,
        send: (data) => {
          console.log('Mock WebSocket sending:', data);
          // Simular eco del mensaje
          setTimeout(() => {
            handleMockMessage({
              type: 'echo',
              data: JSON.parse(data),
              timestamp: new Date().toISOString()
            });
          }, 100);
        },
        close: () => {
          setConnectionStatus('Disconnected');
          onClose?.();
        }
      };

      websocketRef.current = mockWebSocket;
      setConnectionStatus('Connected');
      reconnectAttemptsRef.current = 0;

      onOpen?.(mockWebSocket);
      notifications.showConnectionRestored();

      // Configurar heartbeat
      setupHeartbeat();

      // Simular mensajes periódicos
      startMockMessages();

    } catch (error) {
      console.error('WebSocket connection error:', error);
      setConnectionStatus('Error');
      onError?.(error);
      notifications.showConnectionError();
      scheduleReconnect();
    }
  }, [onOpen, onError, notifications]);

  // Manejar mensaje mock
  const handleMockMessage = useCallback((message) => {
    setLastMessage(message);
    setMessageHistory(prev => [...prev.slice(-49), message]); // Mantener últimos 50 mensajes
    onMessage?.(message);
  }, [onMessage]);

  // Configurar heartbeat
  const setupHeartbeat = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current);
    }

    heartbeatTimeoutRef.current = setInterval(() => {
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        sendMessage({ type: 'heartbeat', timestamp: Date.now() });
      }
    }, heartbeatInterval);
  }, [heartbeatInterval]);

  // Programar reconexión
  const scheduleReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current < reconnectAttempts) {
      reconnectAttemptsRef.current++;
      
      notifications.showWarning(
        `Reconectando... (${reconnectAttemptsRef.current}/${reconnectAttempts})`,
        { duration: reconnectInterval }
      );

      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, reconnectInterval);
    } else {
      notifications.showError('No se pudo restablecer la conexión después de varios intentos');
    }
  }, [reconnectAttempts, reconnectInterval, connect, notifications]);

  // Enviar mensaje
  const sendMessage = useCallback((message) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      const messageToSend = typeof message === 'string' ? message : JSON.stringify(message);
      websocketRef.current.send(messageToSend);
      return true;
    } else {
      notifications.showError('No hay conexión WebSocket activa');
      return false;
    }
  }, [notifications]);

  // Desconectar
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current);
    }

    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }

    setConnectionStatus('Disconnected');
  }, []);

  // Simular mensajes de prueba
  const startMockMessages = useCallback(() => {
    const messageTypes = [
      { type: 'message_sent', data: { messageId: Math.random(), status: 'sent', groupCount: 12 }},
      { type: 'message_failed', data: { messageId: Math.random(), error: 'Network timeout' }},
      { type: 'message_scheduled', data: { messageId: Math.random(), scheduledFor: new Date(Date.now() + 3600000).toISOString() }},
      { type: 'system_notification', data: { message: 'Sistema actualizado', priority: 'info' }}
    ];

    const sendRandomMessage = () => {
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        const randomMessage = messageTypes[Math.floor(Math.random() * messageTypes.length)];
        handleMockMessage({
          ...randomMessage,
          timestamp: new Date().toISOString(),
          id: Math.random().toString(36).substr(2, 9)
        });
      }
    };

    // Enviar mensaje inicial después de 2 segundos
    setTimeout(sendRandomMessage, 2000);
    
    // Enviar mensajes aleatorios cada 10-30 segundos
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% de probabilidad
        sendRandomMessage();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [handleMockMessage]);

  // Conectar automáticamente al montar
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (heartbeatTimeoutRef.current) {
        clearInterval(heartbeatTimeoutRef.current);
      }
    };
  }, []);

  return {
    connectionStatus,
    lastMessage,
    messageHistory,
    connect,
    disconnect,
    sendMessage,
    isConnected: connectionStatus === 'Connected'
  };
};

export const useRealTimeUpdates = (entityType = 'messages') => {
  const [updates, setUpdates] = useState([]);
  const notifications = useNotifications();

  const websocket = useWebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080', {
    onMessage: (message) => {
      handleRealtimeUpdate(message);
    },
    autoConnect: true
  });

  const handleRealtimeUpdate = useCallback((message) => {
    if (message.type.startsWith(entityType)) {
      setUpdates(prev => [...prev.slice(-9), message]); // Últimas 10 actualizaciones

      // Mostrar notificaciones según el tipo
      switch (message.type) {
        case `${entityType}_sent`:
          notifications.showMessageSent(
            message.data.groupCount || 1,
            message.data.groupCount || 1
          );
          break;
        case `${entityType}_failed`:
          notifications.showMessageFailed(message.data.error);
          break;
        case `${entityType}_scheduled`:
          notifications.showInfo('Nuevo mensaje programado');
          break;
        default:
          break;
      }
    }
  }, [entityType, notifications]);

  const subscribeToEntity = useCallback((id) => {
    websocket.sendMessage({
      type: 'subscribe',
      entity: entityType,
      id
    });
  }, [websocket, entityType]);

  const unsubscribeFromEntity = useCallback((id) => {
    websocket.sendMessage({
      type: 'unsubscribe',
      entity: entityType,
      id
    });
  }, [websocket, entityType]);

  return {
    ...websocket,
    updates,
    subscribeToEntity,
    unsubscribeFromEntity
  };
};
