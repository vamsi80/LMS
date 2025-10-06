"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button"; // your UI imports
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/auth"; // Better Auth client

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token"); // read token from URL

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid or expired token");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    // try {
    //   const result = await auth.resetPassword({
    //     token,
    //     newPassword: password,
    //   });

    //   if (result?.error) {
    //     setError(result.error.message);
    //   } else {
    //     router.push("/sign-in"); // redirect after success
    //   }
    // } catch (err) {
    //   console.error(err);
    //   setError("Failed to reset password. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <form onSubmit={handleReset} className="max-w-md mx-auto p-6">
      <Label>New Password</Label>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Label>Confirm Password</Label>
      <Input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      {error && <p className="text-destructive">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}
