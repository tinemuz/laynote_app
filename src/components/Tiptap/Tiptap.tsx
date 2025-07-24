'use client'

import {EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {useEffect, useCallback, useRef} from "react";
import { useWebSocket } from '@/hooks/useWebSocket';

interface Note {
    id: number;
    title: string;
    content: string;
}

const Tiptap = ({note, onNoteUpdate, userId, websocketUrl}: { 
    note: Note | null;
    onNoteUpdate?: (updatedNote: Note) => void;
    userId: number;
    websocketUrl: string;
}) => {
    const lastSavedContent = useRef<string>('');
    const lastSavedTitle = useRef<string>('');
    
    const { wsClient, isConnected } = useWebSocket({ userId, websocketUrl });

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

    const saveContent = useCallback(async () => {
        if (!note || !editor || !isConnected) return;
        
        // Get the HTML content directly
        const htmlContent = editor.getHTML();
        
        if (htmlContent === lastSavedContent.current) return;

        try {
            wsClient?.updateContent(note.id.toString(), htmlContent);
            lastSavedContent.current = htmlContent;
            
            if (onNoteUpdate) {
                onNoteUpdate({ ...note, content: htmlContent });
            }
        } catch (error) {
            console.error('Failed to save note:', error);
        } finally {
            // Clear the timeout reference
            saveTimeoutRef.current = null;
        }
    }, [note, editor, wsClient, isConnected, onNoteUpdate]);

    // Use a ref to track the last content for comparison
    const contentRef = useRef<string>('');
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitializingRef = useRef<boolean>(false);
    
    const handleUpdate = useCallback(() => {
        // Skip updates during initialization
        if (isInitializingRef.current) return;
        
        // Get the HTML content directly
        const htmlContent = editor?.getHTML();
        
        if (htmlContent) {
            if (htmlContent !== contentRef.current) {
                contentRef.current = htmlContent;
                
                // Clear any existing timeout
                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }
                
                // Set new timeout
                saveTimeoutRef.current = setTimeout(saveContent, 1000);
            }
        }
    }, [editor, saveContent]);
    
    useEffect(() => {
        if (!editor) return;

        // Listen to editor changes
        editor.on('update', handleUpdate);
        
        return () => {
            editor.off('update', handleUpdate);
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [editor, handleUpdate]);

    useEffect(() => {
        if (!wsClient || !note) return;

        const handleNoteUpdate = (data: any) => {
            if (data.noteId === note.id.toString()) {
                if (data.action === 'UPDATE_CONTENT' && data.content) {
                    // Only update if the content is different from what we last saved
                    // This prevents cursor position resets when we receive our own updates
                    if (data.content !== lastSavedContent.current) {
                        // Use the content directly as HTML
                        editor?.commands.setContent(data.content, false);
                        lastSavedContent.current = data.content;
                        
                        if (onNoteUpdate) {
                            onNoteUpdate({ ...note, content: data.content });
                        }
                    }
                } else if (data.action === 'UPDATE_TITLE' && data.title) {
                    lastSavedTitle.current = data.title;
                    
                    if (onNoteUpdate) {
                        onNoteUpdate({ ...note, title: data.title });
                    }
                }
            }
        };

        wsClient.on('noteUpdated', handleNoteUpdate);

        return () => {
            wsClient.off('noteUpdated', handleNoteUpdate);
        };
    }, [wsClient, note, editor, onNoteUpdate]);

    useEffect(() => {
        if (note) {
            isInitializingRef.current = true;
            
            let contentToLoad = '<p>Start writing...</p>';
            
            if (note.content) {
                contentToLoad = note.content;
            }
            
            editor?.commands.setContent(contentToLoad);
            lastSavedContent.current = note.content || '';
            lastSavedTitle.current = note.title;
            isInitializingRef.current = false;
        } else {
            isInitializingRef.current = true;
            editor?.commands.setContent('<p>Select a note to view its content or create a new one</p>');
            isInitializingRef.current = false;
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
                            if (newTitle === lastSavedTitle.current) return;
                            
                            try {
                                wsClient?.updateTitle(note.id.toString(), newTitle);
                                lastSavedTitle.current = newTitle;
                                
                                if (onNoteUpdate) {
                                    onNoteUpdate({ ...note, title: newTitle });
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