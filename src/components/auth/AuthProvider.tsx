"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase/config";
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        // Sync user to Firestore
        const COLORS = ["#4F46E5","#0891B2","#059669","#D97706","#DC2626","#7C3AED","#DB2777","#2563EB","#65A30D","#EA580C"];
        const name = user.displayName || user.email?.split("@")[0] || "User";
        const email = user.email || "";
        const initials = name.substring(0, 2).toUpperCase();
        const color = COLORS[Math.floor(Math.abs(user.uid.split("").reduce((a,b)=>a+b.charCodeAt(0),0)) % COLORS.length)];
        
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          name,
          email,
          initials,
          color,
          role: "Member"
        }, { merge: true }).catch(console.error);
      }
      
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
