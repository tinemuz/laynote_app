export interface WebSocketMessage {
    action: string;
    noteId?: string;
    content?: string;
    title?: string;
    userId?: number;
}

export interface NoteDto {
    id: string;
    title: string;
    content: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export class SimpleWebSocketClient {
    private ws: WebSocket | null = null;
    private url: string;
    private userId: number;
    private listeners: Map<string, Set<(data: any) => void>> = new Map();
    private isConnecting = false;

    constructor(url: string, userId: number) {
        this.url = url;
        this.userId = userId;
    }

    public isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.ws?.readyState === WebSocket.OPEN) {
                resolve();
                return;
            }

            if (this.isConnecting) {
                const checkConnection = () => {
                    if (this.ws?.readyState === WebSocket.OPEN) {
                        resolve();
                    } else if (!this.isConnecting) {
                        reject(new Error('Connection failed'));
                    } else {
                        setTimeout(checkConnection, 100);
                    }
                };
                checkConnection();
                return;
            }

            this.isConnecting = true;

            try {
                this.ws = new WebSocket(this.url);

                this.ws.onopen = () => {
                    this.isConnecting = false;
                    this.emit('connected', null);
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        this.handleMessage(data);
                    } catch (error) {
                        console.error('[SimpleWebSocketClient] Error parsing message:', error);
                    }
                };

                this.ws.onclose = (event) => {
                    this.isConnecting = false;
                    this.emit('disconnected', null);
                };

                this.ws.onerror = (error) => {
                    console.error('[SimpleWebSocketClient] Connection error:', error);
                    this.isConnecting = false;
                    this.emit('error', 'Failed to connect to WebSocket server');
                    reject(new Error('WebSocket connection failed'));
                };

                setTimeout(() => {
                    if (this.isConnecting) {
                        this.isConnecting = false;
                        this.emit('error', 'Connection timeout');
                        reject(new Error('Connection timeout'));
                    }
                }, 5000);

            } catch (error) {
                console.error('[SimpleWebSocketClient] Connection instantiation error:', error);
                this.isConnecting = false;
                this.emit('error', 'Failed to create WebSocket connection');
                reject(error);
            }
        });
    }

    private handleMessage(data: any) {
        if (data.action === 'NOTE_CREATED') {
            this.emit('noteCreated', data);
        } else if (data.action === 'UPDATE_CONTENT' || data.action === 'UPDATE_TITLE') {
            this.emit('noteUpdated', data);
        } else if (data.action === 'ERROR') {
            this.emit('error', data.message || 'Unknown error');
        }
    }

    private send(message: WebSocketMessage) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            this.connect().then(() => {
                if (this.ws?.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify(message));
                }
            }).catch(err => {
                console.error('[SimpleWebSocketClient] Failed to reconnect:', err);
            });
        }
    }

    updateContent(noteId: string, content: string): void {
        this.send({
            action: 'UPDATE_CONTENT',
            noteId,
            content,
            userId: this.userId,
        });
    }

    updateTitle(noteId: string, title: string): void {
        this.send({
            action: 'UPDATE_TITLE',
            noteId,
            title,
            userId: this.userId,
        });
    }

    on(event: string, callback: (data: any) => void): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)!.add(callback);
    }

    off(event: string, callback: (data: any) => void): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.delete(callback);
        }
    }

    private emit(event: string, data: any): void {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }

    disconnect(): void {
        if (this.ws) {
            this.isConnecting = false;
            this.ws.close();
            this.ws = null;
        }
    }
}

let wsClient: SimpleWebSocketClient | null = null;

export function getWebSocketClient(url: string, userId: number): SimpleWebSocketClient {
    if (!wsClient) {
        wsClient = new SimpleWebSocketClient(url, userId);
    }
    return wsClient;
}

export function disconnectWebSocket(): void {
    if (wsClient) {
        wsClient.disconnect();
        wsClient = null;
    }
} 