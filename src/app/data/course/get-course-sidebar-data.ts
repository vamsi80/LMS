import prisma from "@/lib/db";
import "server-only";
import { requireUser } from "../user/require-user";
import { sl } from "zod/v4/locales";
import { notFound } from "next/navigation";

export async function getCourseSidebarData(slug: string) {

    const user = await requireUser();

    const course = await prisma.course.findUnique({
        where: {
            slug: slug,
        },
        select: {
            id: true,
            title: true,
            duration: true,
            level: true,
            fileKey: true,
            slug: true,
            category: true,
            chapters: {
                orderBy: {
                    position: "asc",
                },
                select: {
                    id: true,
                    title: true,
                    position: true,
                    lessons: {
                        orderBy: {
                            position: "asc",
                        },
                        select: {
                            id: true,
                            title: true,
                            position: true,
                            description: true,
                        },
                    },
                },
            },
        },
    });

    if (!course) {

        return notFound();
    };

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId: user.id,
                courseId: course.id
            },
        },
        select: {
            status: true,
        },
    });

    if(!enrollment || enrollment.status !== "Active") {
        return notFound();
    }

    return course;
}

export type CourseSidebarDataType = Awaited<ReturnType<typeof getCourseSidebarData>>
