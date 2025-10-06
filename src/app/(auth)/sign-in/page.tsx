"use client";

import { LoginForm } from "@/components/auth/sign-in-form";
import { useRouter } from "next/navigation";

export default function signInPage() {
  const router = useRouter();
 
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
