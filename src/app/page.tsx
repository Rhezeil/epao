
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth-provider";

export default function LandingPage() {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && role) {
        router.push(`/dashboard/${role}`);
      } else {
        // Guests start at the Case Navigator
        router.push("/case-navigator");
      }
    }
  }, [user, role, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">Welcome to LexConnect...</p>
      </div>
    </div>
  );
}
