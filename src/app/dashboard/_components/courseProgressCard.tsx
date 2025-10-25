"use client"

import { EnrolledCoursesType } from "@/app/data/user/get-enrolled-courses"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useConstructUrl } from "@/hooks/use-constract-url"
import { useCourseProgress } from "@/hooks/use-course-progress"
import Image from "next/image"
import Link from "next/link"

interface iAppProps {
  data: EnrolledCoursesType;
}

export const CourseProgressCard = ({ data }: iAppProps) => {

  const thumbnailUrl = useConstructUrl(data.Course.fileKey);

  const { completedLessons, totalLessons, progressPercentage } = useCourseProgress({ courseData: data.Course as any });

  return (
    <Card className="group relative py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">{data.Course.level}</Badge>
      <Image
        src={thumbnailUrl}
        alt={data.Course.title}
        width={600}
        height={400}
        className="w-full rounded-t-xl aspect-video h-full object-cover"
      />

      <CardContent className="p-4">
        <Link
          href={`/dashboard/${data.Course.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.Course.title}
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
          {data.Course.smallDescription}
        </p>

        <div className="space-y-4 mt-5">
          <div className="flex justify-between mb-1 text-sm">
            <span>Progress:</span>
            <span className="font-medium"> {progressPercentage}%</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-1.5" 
          /> 
          <p className="text-xs text-muted-foreground mt-1">
            {completedLessons} of  {totalLessons} lessons completed
          </p>
        </div>

        <Link
          href={`/dashboard/${data.Course.slug}`}
          className={buttonVariants({
            className: "mt-4 w-full",
          })}
        >
          Learn more
        </Link>
      </CardContent>
    </Card>
  )
}

export const PublicCourseCardSkeleton = () => {
  return (
    <Card>
      <div className="absolute top-2 right-2 z-10 flex items-center">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-xl aspect-video" />
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>

        <Skeleton className="mt-4 w-full h-10 rounded-md" />
      </CardContent>
    </Card>
  )
}
