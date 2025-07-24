import { UserPie } from "@/components/sidebar/UserPie";
import { NoteList } from "@/components/sidebar/NoteList";

interface Note {
  id: number;
  title: string;
  content: string;
}

export function Sidebar({ onSelectNote, selectedNote }: { onSelectNote: (note: Note) => void, selectedNote: Note | null }) {
    return (
        <div className={"w-80 h-full bg-gray-50 flex flex-col p-4 justify-between"}>
            <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-4">Notes</h2>
                <NoteList onSelectNote={onSelectNote} selectedNote={selectedNote} />
            </div>
            <UserPie />
        </div>
    );
}