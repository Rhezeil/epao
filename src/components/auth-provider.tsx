
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth as useFirebaseAuth, useFirestore } from "@/firebase";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export type UserRole = "admin" | "lawyer" | "client" | null;

interface AuthContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const auth = useFirebaseAuth();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let unsubAuth: () => void = () => {};
    let unsubs: (() => void)[] = [];

    unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      // Clear existing listeners
      unsubs.forEach(unsub => unsub());
      unsubs = [];

      if (firebaseUser) {
        setLoading(true);
        
        // Parallel role checking
        let foundRole = false;

        const checkAdmin = onSnapshot(doc(db, "admins", firebaseUser.uid), (snap) => {
          if (snap.exists() && !foundRole) {
            setRole("admin");
            foundRole = true;
            setLoading(false);
          }
        }, () => {});

        const checkLawyer = onSnapshot(doc(db, "roleLawyer", firebaseUser.uid), (snap) => {
          if (snap.exists() && !foundRole) {
            setRole("lawyer");
            foundRole = true;
            setLoading(false);
          }
        }, () => {});

        const checkClient = onSnapshot(doc(db, "users", firebaseUser.uid), (snap) => {
          if (snap.exists() && !foundRole) {
            setRole("client");
            foundRole = true;
            setLoading(false);
          }
        }, () => {});

        unsubs = [checkAdmin, checkLawyer, checkClient];

        // Fallback timeout to stop loading if no role is found within reasonable time
        const timer = setTimeout(() => {
          if (!foundRole) setLoading(false);
        }, 3000);
        unsubs.push(() => clearTimeout(timer));

      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      unsubs.forEach(unsub => unsub());
    };
  }, [auth, db]);

  // Redirect Logic with Path Preservation
  useEffect(() => {
    const publicPaths = ["/login", "/register", "/", "/case-navigator", "/about", "/book-appointment", "/manage-appointment"];
    
    if (!loading) {
      if (!user && !publicPaths.includes(pathname)) {
        const currentParams = searchParams.toString();
        const fullPath = currentParams ? `${pathname}?${currentParams}` : pathname;
        const encodedRedirect = encodeURIComponent(fullPath);
        router.push(`/login?redirect=${encodedRedirect}`);
      } else if (user && role && (pathname === "/login" || pathname === "/register")) {
        const redirectParam = searchParams.get('redirect');
        if (!redirectParam) {
          router.push(`/dashboard/${role}`);
        }
      }
    }
  }, [user, role, loading, pathname, router, searchParams]);

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
    setRole(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
