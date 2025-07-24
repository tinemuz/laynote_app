
"use client";

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';

interface Note {
  id: number;
  title: string;
  content: string;
}

// Helper function to extract preview text from note content
const getPreviewText = (content: string): string => {
  if (!content) return '';
  
  // Strip HTML tags to get plain text
  return content.replace(/<[^>]*>/g, '');
};

export function NoteList({ 
    onSelectNote, 
    selectedNote
}: { 
    onSelectNote: (note: Note) => void;
    selectedNote: Note | null;
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/';
          return;
        }
        throw new Error('Failed to fetch notes');
      }
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchNotes();
    } else if (isLoaded && !isSignedIn) {
      window.location.href = '/';
    }
  }, [isLoaded, isSignedIn]);

  const createNote = async () => {
    setIsCreating(true);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'New Note' }),
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/';
          return;
        }
        throw new Error('Failed to create note');
      }
      
      const newNote = await res.json();
      setNotes([...notes, newNote]);
      onSelectNote(newNote);
    } catch (err) {
      console.error("Error creating note:", err);
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        createNote();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [notes]);

  useEffect(() => {
    if (selectedNote) {
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === selectedNote.id ? selectedNote : note
        )
      );
    }
  }, [selectedNote]);

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-gray-500">Please sign in to view notes</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={createNote}
          disabled={isCreating}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
        >
          {isCreating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Note
            </>
          )}
        </button>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Press Ctrl+N to create a new note
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p className="font-medium">No notes yet</p>
            <p className="text-sm mt-1">Create your first note to get started</p>
          </div>
        ) : (
          <div className="px-4">
            {notes.map((note) => {
              const previewText = getPreviewText(note.content);
              return (
                <div
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  className={`p-4 cursor-pointer rounded-lg transition-colors ${
                    selectedNote?.id === note.id 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-900 truncate">{note.title}</div>
                  {previewText && (
                    <div className="text-sm text-gray-500 truncate mt-1">
                      {previewText.substring(0, 60)}
                      {previewText.length > 60 && '...'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
