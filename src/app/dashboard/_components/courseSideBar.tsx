import { Play } from "lucide-react";

interface iAppProps {

}

export function CourseSideBar() {
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-3">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Play className=" size-5 text-primary" />
                </div>
                <div className=" flex-1 min-w-0">
                    <h1></h1>
                </div>
            </div>
        </div>
    );
}
