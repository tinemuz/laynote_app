'use client'

import React, { useState } from 'react';
import { EditorState } from 'prosemirror-state';
// The schema now needs to be imported to access mark types
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
// We now import toggleMark
import { baseKeymap, toggleMark } from 'prosemirror-commands';
import {
    ProseMirror,
    ProseMirrorDoc,
    reactKeys,
    useEditorEventCallback,
} from '@handlewithcare/react-prosemirror';

// It's good practice to assign the schema to a variable we can reference
const mySchema = basicSchema;

// --- Toolbar Component (remains the same) ---
const Toolbar = () => {
    const handleBold = useEditorEventCallback((view) => {
        if (!view) return;
        // Use the schema to get the 'strong' (bold) mark type
        toggleMark(mySchema.marks.strong)(view.state, view.dispatch);
        view.focus();
    });

    const handleItalic = useEditorEventCallback((view) => {
        if (!view) return;
        // Use the schema to get the 'em' (italic) mark type
        toggleMark(mySchema.marks.em)(view.state, view.dispatch);
        view.focus();
    });

    const handleUndo = useEditorEventCallback((view) => {
        if (!view) return;
        undo(view.state, view.dispatch);
    });

    const handleRedo = useEditorEventCallback((view) => {
        if (!view) return;
        redo(view.state, view.dispatch);
    });

    return (
        <div>
            <button onClick={handleBold}>Bold</button>
            <button onClick={handleItalic}>Italic</button>
            <button onClick={handleUndo}>Undo</button>
            <button onClick={handleRedo}>Redo</button>
        </div>
    );
};


// --- Editor Component (Corrected) ---
export const ProseMirrorEditor = () => {
    const [editorState, setEditorState] = useState(
        EditorState.create({
            schema: mySchema,
            plugins: [
                history(),
                keymap({
                    'Mod-z': undo,
                    'Mod-y': redo,
                    // --- ADDED LINES ---
                    // When Ctrl+B is pressed, toggle the 'strong' mark
                    'Mod-b': toggleMark(mySchema.marks.strong),
                    // When Ctrl+I is pressed, toggle the 'em' mark
                    'Mod-i': toggleMark(mySchema.marks.em),
                    // --- END ADDED LINES ---
                    ...baseKeymap,
                }),
                reactKeys(),
            ],
        })
    );

    return (
        <ProseMirror
            state={editorState}
            dispatchTransaction={(tr) => {
                setEditorState((prevState) => prevState.apply(tr));
            }}
        >
            <Toolbar />
            <div style={{ border: '1px solid black', padding: '0 10px', marginTop: '10px' }}>
                <ProseMirrorDoc />
            </div>
        </ProseMirror>
    );
};