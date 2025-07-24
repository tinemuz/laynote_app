'use client';

import { Sidebar } from "@/components/sidebar/Sidebar";
import Tiptap from "@/components/Tiptap/Tiptap";
import { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function NotesDashboard() {
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const { isSignedIn, isLoaded } = useAuth();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            window.location.href = '/';
        }
    }, [isLoaded, isSignedIn]);

    const handleNoteUpdate = (updatedNote: Note) => {
        setSelectedNote(updatedNote);
    };

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

    return (
        <div className="flex w-full h-screen bg-gray-50">
            <Sidebar 
                onSelectNote={setSelectedNote} 
                selectedNote={selectedNote} 
                onNoteUpdate={handleNoteUpdate} 
            />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-6">
                    <Tiptap 
                        note={selectedNote} 
                        onNoteUpdate={handleNoteUpdate} 
                    />
                </div>
            </div>
        </div>
    );
}

