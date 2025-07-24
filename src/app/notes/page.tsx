'use client';

import { Sidebar } from "@/components/sidebar/Sidebar";
import Tiptap from "@/components/Tiptap/Tiptap";
import { useState } from "react";

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function NotesDashboard() {
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    return (
        <div className={"flex flex-row h-screen w-full"}>
            <Sidebar onSelectNote={setSelectedNote} selectedNote={selectedNote} />
            <div className={"flex-grow flex justify-center overflow-y-scroll pt-7"}>
                <div className={"max-w-[640px] w-full"}>
                    <Tiptap note={selectedNote} />
                </div>
            </div>
        </div>
    );
}

