"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../lib/firebase/config";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F3F4F6", fontFamily: "system-ui, sans-serif", padding: 20 }}>
      <div style={{ background: "#fff", padding: "40px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", width: "100%", maxWidth: "420px", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="4" height="14" rx="1.5" fill="white" opacity="0.9"/><rect x="7" y="1" width="4" height="10" rx="1.5" fill="white" opacity="0.7"/><rect x="13" y="1" width="2" height="7" rx="1" fill="white" opacity="0.5"/></svg>
          </div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#111827" }}>TeamFlow</h1>
          <p style={{ margin: "8px 0 0", color: "#6B7280", fontSize: "14px" }}>{isLogin ? "Sign in to your workspace" : "Create a new workspace account"}</p>
        </div>

        {error && <div style={{ padding: "12px", background: "#FEF2F2", color: "#DC2626", borderRadius: "8px", fontSize: "13px", fontWeight: 500, marginBottom: "16px" }}>{error}</div>}

        <button onClick={handleGoogleSignIn} disabled={loading} style={{ width: "100%", padding: "12px", background: "#fff", color: "#374151", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ height: "1px", background: "#E5E7EB", flex: 1 }}></div>
          <span style={{ fontSize: "12px", color: "#9CA3AF", textTransform: "uppercase" }}>or</span>
          <div style={{ height: "1px", background: "#E5E7EB", flex: 1 }}></div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #D1D5DB", outline: "none", boxSizing: "border-box", fontSize: "14px" }} />
          </div>
          
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #D1D5DB", outline: "none", boxSizing: "border-box", fontSize: "14px" }} />
          </div>
          
          <button disabled={loading} type="submit" style={{ width: "100%", padding: "12px", background: "#4F46E5", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: loading ? "wait" : "pointer", marginTop: "4px" }}>
            {loading ? "Please wait..." : (isLogin ? "Sign in with Email" : "Create Account with Email")}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: "none", border: "none", color: "#4F46E5", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
