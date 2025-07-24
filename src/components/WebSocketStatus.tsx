'use client'

import { useWebSocket } from '@/hooks/useWebSocket';

interface WebSocketStatusProps {
  userId: number;
  websocketUrl: string;
}

export function WebSocketStatus({ userId, websocketUrl }: WebSocketStatusProps) {
  const { isConnected, error } = useWebSocket({ userId, websocketUrl });

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-md">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span>WebSocket Error: {error}</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 px-3 py-2 rounded-md">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>Real-time sync enabled</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-yellow-600 text-sm bg-yellow-50 px-3 py-2 rounded-md">
      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
      <span>Connecting to real-time server...</span>
    </div>
  );
} 