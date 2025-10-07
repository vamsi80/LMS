// app/(auth)/reset-password/page.tsx  (or wherever your component lives)
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ResetPassword } from "@/lib/actions/auth-actions";

export default function ResetPasswordPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleReset = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Invalid or expired token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await ResetPassword({ token, newPassword: password });
      // On success you can redirect to login or show message
      setSuccess("Password reset successful. Redirecting to sign in...");
      setTimeout(() => router.push("/sign-in"), 1200);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={handleReset}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Reset your password</h1>
                    <p className="text-muted-foreground text-balance">
                      start your journey with SkilSome
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="New-Password">New Password</Label>
                    <Input
                      id="New-Password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="Confirm-Password">Confirm Password</Label>
                    <Input
                      id="Confirm-Password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  {error && (
                    <div className="text-destructive text-sm text-center">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="text-green-600 text-sm text-center">
                      {success}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Resetting…" : "Reset Password"}
                  </Button>
                </div>
              </form>

              <div className="bg-muted relative hidden md:block">
                <Image
                  src="/sign-up.svg"
                  alt="Reset Image"
                  className="absolute inset-0 h-full w-auto object-cover dark:brightness-[0.2] dark:grayscale"
                  width={400}
                  height={400}
                />
              </div>
            </CardContent>
          </Card>

          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By signing up, you agree to our{" "}
            <a onClick={() => router.push("/Terms_And_Services")} className="cursor-pointer">
              Terms of Service
            </a>{" "}
            and{" "}
            <a onClick={() => router.push("/Privacy_And_Policy")} className="cursor-pointer">
              Privacy Policy
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
