"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DndContext, DragEndEvent, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { act, useEffect, useState } from "react";
import { CSS } from '@dnd-kit/utilities';
import { AdminCourseType } from "@/app/data/admin/admin-get-course";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, FileText, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { reorderChapters, reorderLessons } from "../actions";
import { NewChapterModel } from "./newChapterModel";

interface iAppProps {
    data: AdminCourseType;
}

interface SortableItemProps {
    id: string;
    children: (listeners: DraggableSyntheticListeners) => React.ReactNode;
    className?: string;
    data?: {
        type: "chapter" | "lesson";
        chapterId?: string;
        lessonId?: string;
    }
}

export function CourseStracture({ data }: iAppProps) {

    const initialItems = data.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen: true,
        lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position
        }))
    })) || [];

    const [items, setItems] = useState(initialItems);

    useEffect(() => {
        setItems(prevItems => {
            const updatedItems = data.chapters.map((chapter) => ({
                id: chapter.id,
                title: chapter.title,
                order: chapter.position,
                isOpen: prevItems.find(item => item.id === chapter.id)?.isOpen || true,
                lessons: chapter.lessons.map((lesson) => ({
                    id: lesson.id,
                    title: lesson.title,
                    order: lesson.position
                }))
            })) || [];
            return updatedItems;
        });
    }, [data]);

    function SortableItem({ children, id, className, data }: SortableItemProps) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id: id, data: data });

        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
        };

        return (
            <div ref={setNodeRef}
                style={style} {...attributes}
                className={cn("touch-none", className, isDragging ? 'z-10 opacity-80' : '')}
            >
                {children(listeners)}
            </div>
        );
    }
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }
        const activeaId = active.id;
        const overId = over.id;
        const activeType = active.data.current?.type as "chapter" | "lesson";
        const overType = over.data.current?.type as "chapter" | "lesson";
        const courseId = data.id;
        if (activeType === "chapter") {

            let targetChapterId = null;

            if (overType === "chapter") {
                targetChapterId = overId;

            } else if (overType === "lesson") {
                targetChapterId = over.data.current?.chapterId ?? null;
            }

            if (!targetChapterId) {
                toast.error("Could not determine the chapter for reordering. Please try again.");
                return;
            }

            const oldIndex = items.findIndex((item) => item.id === activeaId);
            const newIndex = items.findIndex((item) => item.id === targetChapterId);

            if (oldIndex === -1 || newIndex === -1) {
                toast.error("Could not determine the chapter for reordering. Please try again.");
                return;
            }

            const newItems = arrayMove(items, oldIndex, newIndex);

            const updatedChapterForState = newItems.map((chapter, index) => ({
                ...chapter,
                order: index + 1,
            }));
            const previousItems = [...items];

            setItems(updatedChapterForState);

            if (courseId) {
                const chaptersToUpdate = updatedChapterForState.map((chapter) => ({
                    id: chapter.id,
                    position: chapter.order
                }));

                const reorderPromise = () => reorderChapters(chaptersToUpdate, courseId);
                toast.promise(reorderPromise(), {
                    loading: "Reordering chapters...",
                    success: (result) => {
                        if (result.status === "success") {
                            return result.message;
                        }
                        throw new Error(result.message);
                    },
                    error: () => {
                        setItems(previousItems);
                        return "Failed to reorder chapters.";
                    },
                });
            }
            return;
        }

        if (activeType === "lesson" && overType === "lesson") {
            const chapterId = active.data.current?.chapterId;
            const overChapterId = over.data.current?.chapterId;

            if (!chapterId || chapterId !== overChapterId) {
                toast.error("Lesson move between different chapters or invalid chapter ID is not allowed. Please try again.");
                return;
            }

            const chapterIndex = items.findIndex((item) => item.id === chapterId);

            if (chapterIndex === -1) {
                toast.error("Could not determine the chapter for reordering. Please try again.");
                return;
            }

            const chapterToUpdate = items[chapterIndex];

            const oldLessonIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id === activeaId);
            const newLessonIndex = chapterToUpdate.lessons.findIndex((lesson) => lesson.id === overId);

            if (oldLessonIndex === -1 || newLessonIndex === -1) {
                toast.error("Could not find lessons for reordering. Please try again.");
                return;
            }

            const reorderedLessons = arrayMove(chapterToUpdate.lessons, oldLessonIndex, newLessonIndex);

            const updatedLessonForState = reorderedLessons.map((lesson, index) => ({
                ...lesson,
                order: index + 1,
            }));


            const newItems = [...items];

            newItems[chapterIndex] = {
                ...chapterToUpdate,
                lessons: updatedLessonForState,
            }

            const previousItems = [...items];

            setItems(newItems);

            if (courseId) {
                const lessonToUpdate = updatedLessonForState.map((lesson) => ({
                    id: lesson.id,
                    position: lesson.order
                }));
                const reorderedLessonsPromise = () => reorderLessons(chapterId, lessonToUpdate, courseId);
                toast.promise(reorderedLessonsPromise(), {
                    loading: "Reordering lessons...",
                    success: (result) => {
                        if (result.status === "success") {
                            return result.message;
                            throw new Error(result.message);
                        }
                    },
                    error: () => {
                        setItems(previousItems);
                        return "Failed to reorder lessons.";
                    }
                });

            }
            return;
        }
    }


    function toggleChapter(chapterId: string) {
        setItems((items) => {
            return items.map((chapter) => {
                if (chapter.id === chapterId) {
                    return {
                        ...chapter,
                        isOpen: !chapter.isOpen
                    }
                }
                return chapter;
            });
        });
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <div className="flex flex-col gap-5">
            <DndContext
                collisionDetection={rectIntersection}
                onDragEnd={handleDragEnd}
                sensors={sensors}
            >
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle>Chapters</CardTitle>
                        <NewChapterModel courseId={data.id} />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <SortableContext
                            items={items}
                            strategy={verticalListSortingStrategy}
                        >
                            {items.map((item) => (
                                <SortableItem
                                    id={item.id}
                                    data={{ type: "chapter" }}
                                    key={item.id}
                                >
                                    {(listeners) => (
                                        <Card>
                                            <Collapsible open={item.isOpen} onOpenChange={() => toggleChapter(item.id)}>
                                                <div className=" flex items-center justify-between p-3 border-b border-border">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            {...listeners}
                                                        >
                                                            <GripVertical className="w-4 h-4" />
                                                        </Button>

                                                        <CollapsibleTrigger asChild>
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="flex items-center"
                                                            >
                                                                {item.isOpen ? (
                                                                    <ChevronDown className="w-4 h-4" />
                                                                ) : (
                                                                    <ChevronRight className="w-4 h-4" />
                                                                )}
                                                            </Button>
                                                        </CollapsibleTrigger>
                                                        <p className="cursor-pointer hover:text-primary">{item.title}</p>
                                                    </div>
                                                    <Button size="icon" variant="outline">
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                                <CollapsibleContent>
                                                    <div className="p-1">
                                                        <SortableContext
                                                            items={item.lessons.map((lesson) => lesson.id)}
                                                            strategy={verticalListSortingStrategy}
                                                        >
                                                            {item.lessons.map((lesson) => (
                                                                <SortableItem
                                                                    key={lesson.id}
                                                                    id={lesson.id}
                                                                    data={{ type: "lesson", chapterId: item.id }}
                                                                >

                                                                    {(lessonListeners) => (
                                                                        <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                                                            <div className="flex items-center gap-2">
                                                                                <Button
                                                                                    size="icon"
                                                                                    variant="ghost"
                                                                                    {...lessonListeners}
                                                                                >
                                                                                    <GripVertical className="size-4" />
                                                                                </Button>
                                                                                <FileText className="size-4" />
                                                                                <Link
                                                                                    href={`/admin/courses/${data.id}/edit/chapters/${item.id}/lessons/${lesson.id}`}
                                                                                    className="cursor-pointer hover:text-primary">{lesson.title}</Link>
                                                                            </div>
                                                                            <Button size="icon" variant="outline">
                                                                                <Trash2 className="size-4" />
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </SortableItem>
                                                            ))}
                                                        </SortableContext>
                                                        <div className="p-2">
                                                            <Button className="w-full">
                                                                Create New lesson
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </Card>
                                    )}
                                </SortableItem>
                            ))}
                        </SortableContext>
                    </CardContent>
                </Card>
            </DndContext>
        </div>
    )
}
