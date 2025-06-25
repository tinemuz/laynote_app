import {useEditorEventCallback} from "@handlewithcare/react-prosemirror";
import {toggleMark} from "prosemirror-commands";
import {redo, undo} from "prosemirror-history";
import React from "react";
import { schema as basicSchema } from 'prosemirror-schema-basic';


const mySchema = basicSchema;

export const Toolbar = () => {
    const handleBold = useEditorEventCallback((view) => {
        if (!view) return;
        toggleMark(mySchema.marks.strong)(view.state, view.dispatch);
        view.focus();
    });

    const handleItalic = useEditorEventCallback((view) => {
        if (!view) return;
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
        <div className={"bg-slate-100 border-slate-400 border-b gap-2 flex p-1 px-2"}>
            <button onClick={handleBold}>Bold</button>
            <button onClick={handleItalic}>Italic</button>
            <button onClick={handleUndo}>Undo</button>
            <button onClick={handleRedo}>Redo</button>
        </div>
    );
};