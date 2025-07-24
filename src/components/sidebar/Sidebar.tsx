import { NoteList } from "@/components/sidebar/NoteList";

interface Note {
  id: number;
  title: string;
  content: string;
}

export function Sidebar({ 
    onSelectNote, 
    selectedNote, 
    onNoteUpdate 
}: { 
    onSelectNote: (note: Note) => void;
    selectedNote: Note | null;
    onNoteUpdate?: (updatedNote: Note) => void;
}) {
    return (
        <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
            </div>
            <div className="flex-1 overflow-hidden">
                <NoteList 
                    onSelectNote={onSelectNote} 
                    selectedNote={selectedNote} 
                    onNoteUpdate={onNoteUpdate}
                />
            </div>
        </div>
    );
}