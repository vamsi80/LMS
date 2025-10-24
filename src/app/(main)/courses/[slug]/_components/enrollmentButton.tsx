"use client";

import { useTransition } from "react";
import { enrollInCourseAction } from "../actions";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function EnrollmentButton({ courseId }: { courseId: string }) {

    const [Pending, startTransition] = useTransition();

    function onSubmit() {

        startTransition(async () => {
            const { data: result, error } = await tryCatch(enrollInCourseAction(courseId));
            console.log("results", { result });

            if (error) {
                toast.error("An Error Occured. Please Try Again.");
                console.error(error);
                return;
            }

            if (result.status === "success") {
                toast.success(result.message);
            } else (
                toast.error(result.message)
            )
        });
    }

    return (
        <Button onClick={onSubmit} disabled={Pending} className="w-full" >

            {Pending ? (
                <>
                    <Loader2 className="size-4 animate-spin" />
                    Loading...
                </>
            ) : (
                "Enroll Now"
            )}
        </Button>
    );
}