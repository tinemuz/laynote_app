# Laynote - Simple Note Taking App

A simplified note-taking application with real-time collaboration using WebSockets.

## Features

- **Simple WebSocket Implementation**: Clean and straightforward WebSocket client
- **Real-time Collaboration**: Multiple users can edit notes simultaneously
- **Auto-save**: Notes are automatically saved as you type
- **Rich Text Editor**: Powered by Tiptap with basic formatting
- **Authentication**: Built with Clerk for user management

## WebSocket Architecture

The WebSocket implementation has been simplified to focus on core functionality:

### Key Components

1. **SimpleWebSocketClient** (`src/lib/websocket.ts`)
   - Basic WebSocket connection management
   - Simple event system for real-time updates
   - No complex reconnection logic or request/response handling

2. **useWebSocket Hook** (`src/hooks/useWebSocket.ts`)
   - Simple connection status management
   - Basic error handling
   - Automatic connection on mount

3. **Real-time Features**
   - Auto-save content changes (debounced)
   - Real-time title updates
   - Live collaboration between users

### WebSocket Messages

The app uses a simple message format:

```typescript
interface WebSocketMessage {
    action: string;
    noteId?: string;
    content?: string;
    title?: string;
    userId?: number;
}
```

### Supported Actions

- `UPDATE_CONTENT`: Save note content changes
- `UPDATE_TITLE`: Save note title changes
- `NOTE_CREATED`: New note created
- `ERROR`: Error messages

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   NEXT_PUBLIC_WEBSOCKET_URL=wss://laynote-websocket.fly.dev/notes
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

- Create new notes with the "New Note" button or Ctrl+N
- Edit notes in real-time with automatic saving
- Multiple users can collaborate on the same note
- WebSocket status is shown in the top-right corner

## Troubleshooting

### WebSocket Connection Issues

If you see "Connecting to real-time server..." indefinitely:

1. **Check if the Java WebSocket server is running** at `wss://laynote-websocket.fly.dev`

2. **Verify the WebSocket URL** in your environment variables:
   ```env
   NEXT_PUBLIC_WEBSOCKET_URL=wss://laynote-websocket.fly.dev/notes
   ```

3. **Check browser console** for WebSocket connection errors

4. **Alternative**: If you don't need real-time features, the app will still work for basic note-taking without WebSocket connection

### Title Updates Not Working

- Make sure the Java WebSocket server is running and accessible
- Check that the `onNoteUpdate` callback is properly passed to the Tiptap component
- Verify that the note ID is being sent correctly in WebSocket messages
- Ensure your Java server handles the `UPDATE_TITLE` action properly

## Architecture Benefits

- **Simplified Codebase**: Removed complex reconnection logic and request/response handling
- **Easier Debugging**: Clear separation of concerns and simple event flow
- **Better Performance**: Reduced overhead from complex WebSocket management
- **Maintainable**: Straightforward code that's easy to understand and modify
- **Graceful Degradation**: App works even without WebSocket connection