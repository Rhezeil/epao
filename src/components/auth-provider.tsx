
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuth as useFirebaseAuth, useFirestore } from "@/firebase";
import { useRouter, usePathname } from "next/navigation";

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setLoading(true);
        try {
          // Check roleAdmin
          const adminDoc = await getDoc(doc(db, "roleAdmin", firebaseUser.uid));
          if (adminDoc.exists()) {
            setRole("admin");
          } else {
            // Check roleLawyer
            const lawyerDoc = await getDoc(doc(db, "roleLawyer", firebaseUser.uid));
            if (lawyerDoc.exists()) {
              setRole("lawyer");
            } else {
              // Check standard users (Clients)
              const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
              if (userDoc.exists()) {
                setRole("client");
              } else {
                // If logged in but no role found, it might be in transition/initialization
                setRole(null);
              }
            }
          }
        } catch (error) {
          console.error("Auth role detection error:", error);
          setRole(null);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  // Redirect Logic
  useEffect(() => {
    const publicPaths = ["/login", "/register", "/"];
    if (!loading) {
      if (!user && !publicPaths.includes(pathname)) {
        router.push("/login");
      } else if (user && role && (pathname === "/login" || pathname === "/register")) {
        router.push(`/dashboard/${role}`);
      }
    }
  }, [user, role, loading, pathname, router]);

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
