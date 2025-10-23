import { getAllCourses } from "@/app/data/course/get-all-courses";
import { MainCourseCard, MainCourseCardSkeleton } from "../_components/mainCourseCard";
import { Suspense } from "react";

export default function MainCoursesPage() {
    return (
        <>
            <div className="mt-5">
                <div className=" flex flex-col space-y-2 mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Explore courses</h1>
                    <p className="text-muted-foreground">Discover Our Wiede rang desigined to help you achieve your learning goals</p>
                </div>
            </div>

            <Suspense fallback={<LoadingSkeletonLayout />}>
                <RenderCourses />
            </Suspense>
        </>
    );
}

async function RenderCourses() {
    const courses = await getAllCourses();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <MainCourseCard key={course.id} data={course} />
            ))}
        </div>
    );
}

function LoadingSkeletonLayout() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
                <MainCourseCardSkeleton key={index} />
            ))}
        </div>
    );
}
