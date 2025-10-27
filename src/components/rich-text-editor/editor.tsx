'use client';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Menubar } from './menuBar';
import { useState } from 'react';
import TextAlign from '@tiptap/extension-text-align';

export function RichTextEditor({ field }: { field: any }) {
  const [initialContent] = useState(() => {
    if (!field?.value) return 'Hello World!';
    try { return JSON.parse(field.value); }
    catch (e) { console.warn('Failed to parse field.value', e); return 'Hello World!'; }
  });

  const editor = useEditor({
    extensions: [StarterKit, TextAlign.configure({ types: ['heading','paragraph'] })],
    editorProps: { attributes: { class: 'min-h-[300px] p-4 focus:outline-none prose-sm ...' } },
    onUpdate: ({ editor }) => field?.onChange(JSON.stringify(editor.getJSON())),
    immediatelyRender: false,
    content: initialContent,
  });

  if (!editor) return null;

  return (
    <div className="...">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
