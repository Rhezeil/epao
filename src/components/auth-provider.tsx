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
        
        // Listen to Admin Role (pointing to 'admins' collection)
        unsubAdmin = onSnapshot(doc(db, "admins", firebaseUser.uid), (docSnap) => {
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
                   setLoading(false);
                });
              }
            }, (err) => {
               setLoading(false);
            });
          }
        }, (err) => {
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