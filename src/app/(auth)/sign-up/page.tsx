"use client";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { useRouter } from "next/navigation";

export default function signUpPage() {
  const router = useRouter();
  
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignUpForm />
      </div>
    </div>
  );
}
