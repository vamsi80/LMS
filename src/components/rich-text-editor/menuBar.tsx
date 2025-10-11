"use client";

import { useEffect, useState } from "react";
import { type Editor } from "@tiptap/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Heading1, Heading2, Heading3, Italic, List, ListOrdered, Redo, Strikethrough, Undo } from "lucide-react";
import { cn } from "@/lib/utils";
import TextAlign from "@tiptap/extension-text-align";
import { Button } from "../ui/button";

interface iAppProps {
    editor: Editor | null;
}

export function Menubar({ editor }: iAppProps) {
    const [activeMarks, setActiveMarks] = useState<Record<string, boolean>>({});
    const [alignment, setAlignment] = useState<string>("left");

    if (!editor) return null;

    useEffect(() => {
        const updateMarks = () => {
            setActiveMarks({
                bold: editor.isActive("bold"),
                italic: editor.isActive("italic"),
                strike: editor.isActive("strike"),
                heading: editor.isActive("heading"),
                bulletlist: editor.isActive("bulletList"),
                orderedLinst: editor.isActive("orderedList"),
                textAligne: editor.isActive({ TextAlign: "left" })
            });

            if (editor.isActive({ textAlign: "left" })) setAlignment("left");
            else if (editor.isActive({ textAlign: "center" })) setAlignment("center");
            else if (editor.isActive({ textAlign: "right" })) setAlignment("right");
            else if (editor.isActive({ textAlign: "justify" })) setAlignment("justify");
        }

        updateMarks();

        editor.on("selectionUpdate", updateMarks);
        editor.on("transaction", updateMarks);
        editor.on("update", updateMarks);

        return () => {
            editor.off("selectionUpdate", updateMarks);
            editor.off("transaction", updateMarks);
            editor.off("update", updateMarks);
        };
    }, [editor]);

    const toolbarItems = [
        { name: "bold", icon: Bold, tooltip: "Bold", command: () => editor.chain().focus().toggleBold().run() },
        { name: "italic", icon: Italic, tooltip: "Italic", command: () => editor.chain().focus().toggleItalic().run() },
        { name: "strike", icon: Strikethrough, tooltip: "Strike", command: () => editor.chain().focus().toggleStrike().run() },
        { name: "heading", icon: Heading1, tooltip: "Heading1", command: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
        { name: "heading", icon: Heading2, tooltip: "Heading2", command: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
        { name: "heading", icon: Heading3, tooltip: "Heading3", command: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
        { name: "bulletList", icon: List, tooltip: "BulletList", command: () => editor.chain().focus().toggleBulletList().run() },
        { name: "orderedList", icon: ListOrdered, tooltip: "OrderedList", command: () => editor.chain().focus().toggleOrderedList().run() },
    ]

    const alignmentItems = [
        { name: "left", icon: AlignLeft, tooltip: "Align Left", command: () => editor.chain().focus().setTextAlign("left").run() },
        { name: "center", icon: AlignCenter, tooltip: "Align Center", command: () => editor.chain().focus().setTextAlign("center").run() },
        { name: "right", icon: AlignRight, tooltip: "Align Right", command: () => editor.chain().focus().setTextAlign("right").run() },
        // { name: "justify", icon: AlignJustify, tooltip: "Justify", command: () => editor.chain().focus().setTextAlign("justify").run() },
    ];

    const historyItems = [
        { name: "undo", icon: Undo, tooltip: "Undo", command: () => editor.chain().focus().undo().run() },
        { name: "redo", icon: Redo, tooltip: "Redo", command: () => editor.chain().focus().redo().run() },
    ];

    return (
        <div className="border-b border-input rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
            <TooltipProvider>
                {toolbarItems.map(({ name, icon: Icon, tooltip, command }) => (
                    <>
                        <div className="flex flex-wrap gap-1">
                            <Tooltip key={name}>
                                <TooltipTrigger asChild>
                                    <Toggle
                                        size="sm"
                                        pressed={!!activeMarks[name]}
                                        onPressedChange={command}
                                        className={cn(
                                            "transition-colors",
                                            activeMarks[name] && "bg-muted text-muted-foreground"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </Toggle>
                                </TooltipTrigger>
                                <TooltipContent>{tooltip}</TooltipContent>
                            </Tooltip>
                        </div>
                    </>
                ))}
                <div className="flex gap-2 items-center border-l pl-4 ml-2">
                    {alignmentItems.map(({ name, icon: Icon, tooltip, command }) => (
                        <Tooltip key={name}>
                            <TooltipTrigger asChild>
                                <Toggle
                                    size="sm"
                                    pressed={alignment === name}
                                    onPressedChange={command}
                                    className={cn(
                                        "transition-colors",
                                        alignment === name && "bg-muted text-muted-foreground"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>{tooltip}</TooltipContent>
                        </Tooltip>
                    ))}
                </div>
                <div className="flex gap-2 items-center border-l pl-4 ml-2">
                    {historyItems.map(({ name, icon: Icon, tooltip, command }) => (
                        <Tooltip key={name}>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    type="button"
                                    onClick={command}
                                    disabled={!editor.can().undo()}
                                    className="transition-colors"
                                >
                                    <Icon className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>{tooltip}</TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </TooltipProvider>
        </div>
    );
}
