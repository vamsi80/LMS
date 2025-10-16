import { adminGetCourse } from "@/app/data/admin/admin-get-course";

type Params = Promise<{ courseId: string }>
export default async function EditCoursePage({ params }: { params: Params }) {
    const { courseId } = await params;
    const data = await adminGetCourse(courseId);
    return (
        <div>
            <h1></h1>
            edit course
        </div>
    )
}