"use client";

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from "@tiptap/starter-kit"
import { Menubar } from './menuBar';
import { useEffect, useState } from 'react';
import TextAlign from "@tiptap/extension-text-align"

export function RichTextEditor({field}: {field:any}) {

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ["heading", "paragraph"]
            })
        ],

        editorProps: {
            attributes: {
                class: "min-h-[300px] p-4 focus:outline-none prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert w-full !max-w-none",
            },
        },

        onUpdate:   ({editor}) => {
            field.onChange(JSON.stringify(editor.getJSON))
        },
        // IMPORTANT: avoid immediate HTML render on the server — prevents hydration mismatch
        immediatelyRender: false,
        // optional safe defaults:
        content: "<p>Hello World! 🌎️</p>",
    });

    if (!mounted) return null;

    return (
        <div className='w-full border border-input rounded-lg overflow-hidden
        dark:bg-input/30'>
            <Menubar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}
