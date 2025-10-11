"use client";

import { useEditor } from '@tiptap/react'
import StarterKit from "@tiptap/starter-kit"
import { Menubar } from './menuBar';
import { useEffect, useState } from 'react';
import TextAlign from "@tiptap/extension-text-align"

export function RichTextEditor() {

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const editor = useEditor({
        extensions: [StarterKit, TextAlign],
        // IMPORTANT: avoid immediate HTML render on the server — prevents hydration mismatch
        immediatelyRender: false,
        // optional safe defaults:
        content: "<p>Hello World! 🌎️</p>",
    });

    if (!mounted) return null;

    return (
        <div>
            <Menubar editor={editor} />
        </div>
    )
}
