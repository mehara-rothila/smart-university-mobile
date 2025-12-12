import { useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WS_BASE_URL } from '../utils/constants';

/**
 * WebSocket Hook using STOMP
 * Connects to backend WebSocket for real-time notifications
 */
export const useWebSocket = (userId, onMessageReceived) => {
  const clientRef = useRef(null);
  const isConnectedRef = useRef(false);

  const connect = useCallback(() => {
    if (!userId || isConnectedRef.current) return;

    try {
      // Create SockJS instance
      const socket = new SockJS(WS_BASE_URL.replace('wss://', 'https://').replace('ws://', 'http://'));

      // Create STOMP client
      const stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          console.log('STOMP:', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      // On connect
      stompClient.onConnect = () => {
        console.log('WebSocket connected');
        isConnectedRef.current = true;

        // Subscribe to user-specific notifications
        stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
          if (message.body) {
            try {
              const notification = JSON.parse(message.body);
              onMessageReceived(notification);
            } catch (error) {
              console.error('Error parsing notification:', error);
            }
          }
        });

        // Subscribe to broadcast notifications
        stompClient.subscribe('/topic/notifications', (message) => {
          if (message.body) {
            try {
              const notification = JSON.parse(message.body);
              onMessageReceived(notification);
            } catch (error) {
              console.error('Error parsing notification:', error);
            }
          }
        });
      };

      // On disconnect
      stompClient.onDisconnect = () => {
        console.log('WebSocket disconnected');
        isConnectedRef.current = false;
      };

      // On error
      stompClient.onStompError = (frame) => {
        console.error('STOMP error:', frame);
        isConnectedRef.current = false;
      };

      // Activate connection
      stompClient.activate();
      clientRef.current = stompClient;
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }, [userId, onMessageReceived]);

  const disconnect = useCallback(() => {
    if (clientRef.current && isConnectedRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
      isConnectedRef.current = false;
      console.log('WebSocket manually disconnected');
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected: isConnectedRef.current,
    disconnect,
    reconnect: connect,
  };
};

export default useWebSocket;
