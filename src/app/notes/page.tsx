'use client';

import { Sidebar } from "@/components/sidebar/Sidebar";
import Tiptap from "@/components/Tiptap/Tiptap";
import { WebSocketStatus } from "@/components/WebSocketStatus";
import { useState, useEffect } from "react";
import { useAuth, useUser } from '@clerk/nextjs';
import { config } from '@/lib/config';

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function NotesDashboard() {
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const { isSignedIn, isLoaded } = useAuth();
    const { user } = useUser();
    
    const websocketUrl = config.websocket.url;
    
    const getUserId = () => {
        if (!user?.id) return 1;
        
        let hash = 0;
        for (let i = 0; i < user.id.length; i++) {
            const char = user.id.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    };
    
    const userId = getUserId();

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500">Redirecting to sign in...</div>
            </div>
        );
    }

    const handleSelectNote = (note: Note) => {
        setSelectedNote(note);
    };

    const handleNoteUpdate = (updatedNote: Note) => {
        setSelectedNote(updatedNote);
    };

    return (
        <div className="flex w-full h-screen bg-gray-50">
            <Sidebar 
                onSelectNote={handleSelectNote} 
                selectedNote={selectedNote} 
            />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-6">
                    <div className="mb-4">
                        <WebSocketStatus 
                            userId={userId}
                            websocketUrl={websocketUrl}
                        />
                    </div>
                    <Tiptap 
                        note={selectedNote} 
                        onNoteUpdate={handleNoteUpdate}
                        userId={userId}
                        websocketUrl={websocketUrl}
                    />
                </div>
            </div>
        </div>
    );
}

