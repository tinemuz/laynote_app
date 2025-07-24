
"use client";

import { useState, useEffect } from 'react';

interface Note {
  id: number;
  title: string;
  content: string;
}

export function NoteList({ onSelectNote, selectedNote }: { onSelectNote: (note: Note) => void, selectedNote: Note | null }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch('/api/notes');
        if (!res.ok) {
          throw new Error('Failed to fetch notes');
        }
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const createNote = async () => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'New Note' }),
      });
      if (!res.ok) {
        throw new Error('Failed to create note');
      }
      const newNote = await res.json();
      setNotes([...notes, newNote]);
      onSelectNote(newNote);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={createNote}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          New Note
        </button>
      </div>
      <ul className="flex-grow overflow-y-auto">
        {notes.map((note) => (
          <li
            key={note.id}
            onClick={() => onSelectNote(note)}
            className={`p-2 cursor-pointer hover:bg-gray-200 ${
              selectedNote?.id === note.id ? 'bg-gray-300' : ''
            }`}
          >
            {note.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
