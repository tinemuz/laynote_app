'use client'

import {EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {useEffect} from "react";

interface Note {
    id: number;
    title: string;
    content: string;
}

const Tiptap = ({note}: { note: Note | null }) => {
    const editor = useEditor({
        extensions: [StarterKit.configure({
            heading: {
                levels: [1, 2, 3],
            },
        })],
        content: '<p>New note ...</p>',

        editorProps: {
            attributes: {
                class: "overflow-y-auto",
            },
        },
    })

    useEffect(() => {
        if (note) {
            editor?.commands.setContent(note.content);
        } else {
            editor?.commands.setContent('<p>Select a note to view its content</p>');
        }
    }, [note, editor]);

    return <EditorContent editor={editor}/>
}

export default Tiptap