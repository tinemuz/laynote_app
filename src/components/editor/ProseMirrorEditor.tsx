'use client'

import React, { useState } from 'react';
import { EditorState } from 'prosemirror-state';

import { schema as basicSchema } from 'prosemirror-schema-basic';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';

import { baseKeymap, toggleMark } from 'prosemirror-commands';
import {
    ProseMirror,
    ProseMirrorDoc,
    reactKeys,

} from '@handlewithcare/react-prosemirror';
import {Toolbar} from "@/components/editor/Toolbar";

const mySchema = basicSchema;


export const ProseMirrorEditor = () => {
    const [editorState, setEditorState] = useState(
        EditorState.create({
            schema: mySchema,
            plugins: [
                history(),
                keymap({
                    'Mod-z': undo,
                    'Mod-y': redo,
                    'Mod-b': toggleMark(mySchema.marks.strong),
                    'Mod-i': toggleMark(mySchema.marks.em),
                    'Mod-v': () => false,
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
            <div className={"flex flex-col h-screen"}>
                <Toolbar />
                <div className={"flex flex-col flex-grow outline-none overflow-y-auto p-5"}>
                    <ProseMirrorDoc />
                </div>
            </div>

        </ProseMirror>
    );
};