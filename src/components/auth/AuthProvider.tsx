"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../lib/firebase/config";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      if (!user && pathname !== "/login") {
        router.push("/login");
      } else if (user && pathname === "/login") {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: "#6B7280" }}>Loading TeamFlow...</div>;
  }

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
