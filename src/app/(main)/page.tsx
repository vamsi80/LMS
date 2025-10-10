"use client";

import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ui/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {

  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center justify-center text-center space-x-6">
          <Badge variant={"outline"}>Welcome to Tusker Learning</Badge>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Elevate your Learning Experiance
          </h1>
          <p className="max-w-[700px] mt-6 text-lg text-gray-600">
            Discover a world of knowledge with our interactive learning platform. Explore courses, track your progress, and achieve your goals with ease.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link
              className={buttonVariants({ size: "lg" })}
              href="/courses"
            >
              Explore Course
            </Link>
            <Link
              className={buttonVariants({ 
                size: "lg", 
                variant: "outline"
              })}
              href="/sign-up"
            >
              sign up
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
