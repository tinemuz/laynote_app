'use client'

import { useEffect, useState } from 'react';
import { getWebSocketClient, SimpleWebSocketClient } from '@/lib/websocket';

interface UseWebSocketOptions {
  userId: number;
  websocketUrl: string;
}

interface UseWebSocketReturn {
  wsClient: SimpleWebSocketClient | null;
  isConnected: boolean;
  error: string | null;
}

export function useWebSocket({ userId, websocketUrl }: UseWebSocketOptions): UseWebSocketReturn {
  const [wsClient, setWsClient] = useState<SimpleWebSocketClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !websocketUrl) {
      return;
    }

    const client = getWebSocketClient(websocketUrl, userId);
    setWsClient(client);

    const onConnected = () => {
      setIsConnected(true);
      setError(null);
    };

    const onDisconnected = () => {
      setIsConnected(false);
    };

    const onError = (errorMessage: string) => {
      console.error('[useWebSocket] Error:', errorMessage);
      setIsConnected(false);
      setError(errorMessage);
    };

    client.on('connected', onConnected);
    client.on('disconnected', onDisconnected);
    client.on('error', onError);

    client.connect().then(() => {
      console.log('[useWebSocket] Connection successful');
    }).catch(err => {
      console.error('[useWebSocket] Connection failed:', err);
      setError('Failed to connect to WebSocket server. Real-time features may not work.');
    });

    return () => {
      client.off('connected', onConnected);
      client.off('disconnected', onDisconnected);
      client.off('error', onError);
    };
  }, [userId, websocketUrl]);

  return {
    wsClient,
    isConnected,
    error,
  };
} 