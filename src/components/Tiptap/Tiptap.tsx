'use client'

import {EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {useEffect, useCallback} from "react";

interface Note {
    id: number;
    title: string;
    content: string;
}

const Tiptap = ({note, onNoteUpdate}: { 
    note: Note | null;
    onNoteUpdate?: (updatedNote: Note) => void;
}) => {
    const editor = useEditor({
        extensions: [StarterKit.configure({
            heading: {
                levels: [1, 2, 3],
            },
        })],
        content: '<p>Start writing your note...</p>',
        editorProps: {
            attributes: {
                class: "prose prose-lg max-w-none focus:outline-none min-h-[500px] p-6",
            },
        },
    })

    // Save content changes
    const saveContent = useCallback(async () => {
        if (!note || !editor) return;
        
        const content = editor.getHTML();
        if (content === note.content) return; // No changes

        try {
            const response = await fetch(`/api/notes/${note.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                const updatedNote = await response.json();
                onNoteUpdate?.(updatedNote);
            } else if (response.status === 401) {
                window.location.href = '/';
            } else {
                console.error('Failed to save note');
            }
        } catch (error) {
            console.error('Failed to save note:', error);
        }
    }, [note, editor, onNoteUpdate]);

    // Auto-save on content change (debounced)
    useEffect(() => {
        if (!editor) return;

        const timeoutId = setTimeout(saveContent, 1000);
        return () => clearTimeout(timeoutId);
    }, [editor?.getHTML(), saveContent]);

    useEffect(() => {
        if (note) {
            editor?.commands.setContent(note.content || '<p>Start writing...</p>');
        } else {
            editor?.commands.setContent('<p>Select a note to view its content or create a new one</p>');
        }
    }, [note, editor]);

    if (!editor) {
        return <div className="flex items-center justify-center h-64 text-gray-500">Loading editor...</div>;
    }

    return (
        <div className="w-full h-full bg-white rounded-lg border border-gray-200 shadow-sm">
            {note && (
                <div className="border-b border-gray-200 p-6">
                    <input
                        type="text"
                        value={note.title}
                        onChange={async (e) => {
                            const newTitle = e.target.value;
                            try {
                                const response = await fetch(`/api/notes/${note.id}`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ title: newTitle }),
                                });
                                if (response.ok) {
                                    const updatedNote = await response.json();
                                    onNoteUpdate?.(updatedNote);
                                } else if (response.status === 401) {
                                    window.location.href = '/';
                                } else {
                                    console.error('Failed to update title');
                                }
                            } catch (error) {
                                console.error('Failed to update title:', error);
                            }
                        }}
                        className="text-3xl font-bold w-full bg-transparent border-none outline-none focus:ring-0 text-gray-900"
                        placeholder="Note title..."
                    />
                </div>
            )}
            
            {/* Toolbar */}
            {note && (
                <div className="border-b border-gray-200 p-3 flex gap-1 flex-wrap">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded-md transition-colors ${
                            editor.isActive('bold') 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'hover:bg-gray-100 text-gray-700'
                        }`}
                        title="Bold (Ctrl+B)"
                    >
                        <strong className="text-sm">B</strong>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded-md transition-colors ${
                            editor.isActive('italic') 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'hover:bg-gray-100 text-gray-700'
                        }`}
                        title="Italic (Ctrl+I)"
                    >
                        <em className="text-sm">I</em>
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`p-2 rounded-md transition-colors ${
                            editor.isActive('heading', { level: 1 }) 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'hover:bg-gray-100 text-gray-700'
                        }`}
                        title="Heading 1"
                    >
                        <span className="text-sm font-bold">H1</span>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`p-2 rounded-md transition-colors ${
                            editor.isActive('heading', { level: 2 }) 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'hover:bg-gray-100 text-gray-700'
                        }`}
                        title="Heading 2"
                    >
                        <span className="text-sm font-bold">H2</span>
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded-md transition-colors ${
                            editor.isActive('bulletList') 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'hover:bg-gray-100 text-gray-700'
                        }`}
                        title="Bullet List"
                    >
                        <span className="text-sm">•</span>
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-2 rounded-md transition-colors ${
                            editor.isActive('orderedList') 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'hover:bg-gray-100 text-gray-700'
                        }`}
                        title="Numbered List"
                    >
                        <span className="text-sm">1.</span>
                    </button>
                </div>
            )}
            
            <div className="flex-1 overflow-y-auto">
                <EditorContent editor={editor}/>
            </div>
        </div>
    )
}

export default Tiptap