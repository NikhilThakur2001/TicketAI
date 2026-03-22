import { Avatar } from '../ui/Avatar';
import { Member, Ticket } from '../../types';
import { auth } from "../../lib/firebase/config";

interface HeaderProps {
  selectedProject: string;
  setSelectedProject: (proj: string) => void;
  view: string;
  setView: (v: string) => void;
  tickets: Ticket[];
  members: Member[];
}

export function Header({ selectedProject, setSelectedProject, view, setView, tickets, members }: HeaderProps) {
  const total = tickets.length;
  const inProg = tickets.filter(t => t.column === "inprogress").length;
  const done = tickets.filter(t => t.column === "done").length;
  const critical = tickets.filter(t => t.priority === "critical" && t.column !== "done").length;

  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 28px", display: "flex", alignItems: "center", gap: 0, height: 56, position: "sticky", top: 0, zIndex: 100 }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 32 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="4" height="14" rx="1.5" fill="white" opacity="0.9"/><rect x="7" y="1" width="4" height="10" rx="1.5" fill="white" opacity="0.7"/><rect x="13" y="1" width="2" height="7" rx="1" fill="white" opacity="0.5"/></svg>
        </div>
        <span style={{ fontWeight: 800, fontSize: 15, color: "#111827", letterSpacing: "-0.3px" }}>TeamFlow</span>
        <span style={{ fontSize: 11, color: "#9CA3AF", background: "#F3F4F6", padding: "2px 7px", borderRadius: 6, fontWeight: 600 }}>v1.0</span>
      </div>

      {/* Navigation (Project Dropdown + View Toggles) */}
      <div style={{ display: "flex", gap: 12, marginRight: "auto", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} style={{ padding: "6px 28px 6px 14px", borderRadius: 7, border: "1px solid #E5E7EB", background: "#fff", color: "#374151", fontWeight: 600, cursor: "pointer", fontSize: 13, appearance: "none", outline: "none" }}>
            <option value="StratAI">Project: StratAI</option>
            <option value="VibeCapAI">Project: VibeCapAI</option>
          </select>
          <svg style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", pointerEvents: "none" }} width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
        </div>
        
        <div style={{ width: 1, height: 20, background: "#E5E7EB" }} /> {/* Divider */}
        
        <div style={{ display: "flex", gap: 2 }}>
          {[["board", "Board"], ["members", "Team"]].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "6px 14px", borderRadius: 7, border: "none", background: view === v ? "#EEF2FF" : "none", color: view === v ? "#4F46E5" : "#6B7280", fontWeight: view === v ? 600 : 400, cursor: "pointer", fontSize: 13, transition: "all 0.15s" }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ display: "flex", gap: 20, marginRight: 24, fontSize: 12 }}>
        {[["Total", total, "#6B7280"], ["Active", inProg, "#F59E0B"], ["Done", done, "#10B981"], ["Critical", critical, "#DC2626"]].map(([l, v, c]) => (
          <div key={l as string} style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: c as string }}>{v as number}</div>
            <div style={{ color: "#9CA3AF", fontSize: 10 }}>{l as string}</div>
          </div>
        ))}
      </div>

      {/* Members & User Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: -8 }}>
        {members.slice(0, 5).map((m: any, i) => (
          <div key={m.id} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 5 - i }}>
            <Avatar member={m} size={28} />
          </div>
        ))}
      </div>
      
      <button onClick={() => auth.signOut()} style={{ marginLeft: 20, background: "none", border: "1px solid #E5E7EB", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#4B5563", cursor: "pointer", transition: "all 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = "#F9FAFB"; e.currentTarget.style.color = "#111827"; }} onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#4B5563"; }}>Sign Out</button>
    </div>
  );
}
