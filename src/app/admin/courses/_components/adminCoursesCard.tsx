import { AdminCoursesType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useConstractUrl } from "@/hooks/use-constract-url";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ArrowRight, Eye, MoreVertical, Pencil, School, TimerIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


interface iAppProps {
    data: AdminCoursesType;
}
export function AdminCourseCard({ data }: iAppProps) {

    const thumbnailUrl = useConstractUrl(data.fileKey);
    return (
        <Card className="group relative py-0 gap-0">
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon">
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem asChild>
                            <Link
                                href={`/admin/courses/${data.id}/edit`}
                            >
                                <Pencil className="size-4 mr-2" />
                                Edit Course
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={`/courses/${data.slug}`}
                            >
                                <Eye className="size-4 mr-2" />
                                Preview
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link
                                href={`/admin/courses/${data.id}/delete`}
                            >
                                <Trash2 className="size-4 mr-2 text-destructive" />
                                Delete
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
            <Image
                src={thumbnailUrl}
                alt="thumbnail"
                width={200}
                height={200}
                className="w-full rounded-t-lg aspect-video h-full object-cover"
            />

            <CardContent className="p-4">
                <Link
                    href={`/admin/courses/${data.id}/edit`}
                    className="font-medium text-xl line-clamp-2 hover:underline group-hover:text-primary transition-colors"
                >
                    {data.title}
                </Link>

                <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">{data.smallDescription}</p>

                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex  items-center gap-x-2">
                        <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                        <p className="text-sm text-muted-foreground">{data.duration}h</p>
                    </div>
                    <div className="flex  items-center gap-x-2">
                        <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                        <p className="text-sm text-muted-foreground">{data.level}</p>
                    </div>
                </div>

                <Link
                    className={buttonVariants({ className: "w-full mt-4" })}
                    href={`/admin/courses/${data.id}/edit`}
                >
                    Edit Course
                    <ArrowRight className="size-4 ml-1" />
                </Link>
            </CardContent>
        </Card>
    )
}
