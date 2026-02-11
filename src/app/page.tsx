
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export default function HomePage() {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (role) {
        router.push(`/dashboard/${role}`);
      } else if (user && !role) {
        // Logged in but no role assigned/found yet. 
        // Redirect to login to allow the auto-repair/initialization logic to run
        router.push("/login");
      }
    }
  }, [user, role, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Initializing LexConnect...</p>
      </div>
    </div>
  );
}
