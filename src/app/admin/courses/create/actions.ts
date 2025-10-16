"use server";


import { auth } from "@/lib/auth";
// import prisma from "@/lib/db";
import { PrismaClient } from "@/generated/prisma";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function createCourse(values: CourseSchemaType): Promise<ApiResponse> {

    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        const validation = courseSchema.safeParse(values);
        if (!validation.success) {
            return {
                status: "error",
                message: "Invalid validation form data"
            }
        }
        const data = await prisma.course.create({
            data: {
                ...validation.data,
                userId: session?.user.id as string,
            },
            
        });

        return {
            status: "success",
            message: "Course created successfully",
        };
    } catch(error) {
        console.error(error);
        return {
            status: "error",
            message: "Error creating course",
        }
    }

}