
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
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
    let unsubUser: () => void = () => {};
    let unsubAdmin: () => void = () => {};
    let unsubLawyer: () => void = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      // Clear existing listeners
      unsubUser();
      unsubAdmin();
      unsubLawyer();

      if (firebaseUser) {
        setLoading(true);
        
        // Listen to Admin Role
        unsubAdmin = onSnapshot(doc(db, "roleAdmin", firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            setRole("admin");
            setLoading(false);
          } else {
            // If not admin, check lawyer
            unsubLawyer = onSnapshot(doc(db, "roleLawyer", firebaseUser.uid), (lawyerSnap) => {
              if (lawyerSnap.exists()) {
                setRole("lawyer");
                setLoading(false);
              } else {
                // If not lawyer, check client
                unsubUser = onSnapshot(doc(db, "users", firebaseUser.uid), (userSnap) => {
                  if (userSnap.exists()) {
                    setRole("client");
                  } else {
                    setRole(null);
                  }
                  setLoading(false);
                }, (err) => {
                   console.error("User listener error", err);
                   setLoading(false);
                });
              }
            }, (err) => {
               console.error("Lawyer listener error", err);
               setLoading(false);
            });
          }
        }, (err) => {
           console.error("Admin listener error", err);
           setLoading(false);
        });
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubUser();
      unsubAdmin();
      unsubLawyer();
    };
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
