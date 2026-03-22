"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
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

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F3F4F6", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ background: "#fff", padding: "40px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", width: "100%", maxWidth: "400px", boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="4" height="14" rx="1.5" fill="white" opacity="0.9"/><rect x="7" y="1" width="4" height="10" rx="1.5" fill="white" opacity="0.7"/><rect x="13" y="1" width="2" height="7" rx="1" fill="white" opacity="0.5"/></svg>
          </div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#111827" }}>TeamFlow</h1>
          <p style={{ margin: "8px 0 0", color: "#6B7280", fontSize: "14px" }}>{isLogin ? "Sign in to your workspace" : "Create a new workspace account"}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {error && <div style={{ padding: "12px", background: "#FEF2F2", color: "#DC2626", borderRadius: "8px", fontSize: "13px", fontWeight: 500 }}>{error}</div>}
          
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #D1D5DB", outline: "none", boxSizing: "border-box", fontSize: "14px" }} />
          </div>
          
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #D1D5DB", outline: "none", boxSizing: "border-box", fontSize: "14px" }} />
          </div>
          
          <button disabled={loading} type="submit" style={{ width: "100%", padding: "12px", background: "#4F46E5", color: "#fff", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: loading ? "wait" : "pointer", marginTop: "8px" }}>
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
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
