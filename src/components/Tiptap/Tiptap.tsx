'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = () => {
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

    return <EditorContent editor={editor} />
}

export default Tiptap
