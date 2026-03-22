"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, setDoc, deleteDoc, query } from "firebase/firestore";
import { db, auth } from "../lib/firebase/config";
import { INIT_MEMBERS, INIT_COLUMNS, INIT_TICKETS, PRIORITIES, LABEL_OPTIONS } from "../lib/constants";
import { Column } from "../components/board/Column";
import { TicketModal } from "../components/modals/TicketModal";
import { CreateTicketModal } from "../components/modals/CreateTicketModal";
import { MembersView } from "../components/team/MembersView";
import { Avatar } from "../components/ui/Avatar";

export default function App() {
  const loadState = () => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem("kanban_v1");
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  };

  const saved = loadState();
  const [tickets, setTickets] = useState<any[]>(saved?.tickets || INIT_TICKETS);
  const [members] = useState<any[]>(saved?.members || INIT_MEMBERS);
  const [columns] = useState<any[]>(INIT_COLUMNS);
  const [ticketCounter, setTicketCounter] = useState(saved?.counter || 9);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [createFor, setCreateFor] = useState<any>(null);
  const [view, setView] = useState("board");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterLabel, setFilterLabel] = useState("all");

  useEffect(() => {
    try { localStorage.setItem("kanban_v1", JSON.stringify({ members, counter: ticketCounter })); } catch {}
  }, [members, ticketCounter]);

  useEffect(() => {
    const q = query(collection(db, "tickets"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbTickets = snapshot.docs.map(changeDoc => ({ id: changeDoc.id, ...changeDoc.data() }));
      // Seed initial tickets if database is completely empty
      if (dbTickets.length === 0 && tickets === INIT_TICKETS) {
        INIT_TICKETS.forEach(t => setDoc(doc(db, "tickets", t.id), t));
      } else if (dbTickets.length > 0) {
        setTickets(dbTickets);
      }
    });
    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = tickets.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterAssignee !== "all" && t.assignee !== filterAssignee) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterLabel !== "all" && !t.labels.includes(filterLabel)) return false;
    return true;
  });

  function handleDragStart(e: any, ticketId: string) {
    setDraggingId(ticketId);
    e.dataTransfer.effectAllowed = "move";
  }
  function handleDragEnd() { setDraggingId(null); setDragOver(null); }
  function handleDrop(e: any, colId: string) {
    e.preventDefault();
    if (draggingId) {
      setTickets(ts => ts.map(t => t.id === draggingId ? { ...t, column: colId } : t));
      setDoc(doc(db, "tickets", draggingId), { column: colId }, { merge: true });
    }
    setDraggingId(null); setDragOver(null);
  }

  function handleSave(updated: any) { 
    setTickets(ts => ts.map(t => t.id === updated.id ? updated : t)); 
    setDoc(doc(db, "tickets", updated.id), updated, { merge: true });
  }
  function handleDelete(id: string) { 
    setTickets(ts => ts.filter(t => t.id !== id)); 
    deleteDoc(doc(db, "tickets", id));
  }
  function handleCreate(ticket: any) {
    const id = `TEAM-${String(ticketCounter).padStart(3, "0")}`;
    const newTicket = { ...ticket, id };
    setTickets(ts => [...ts, newTicket]);
    setDoc(doc(db, "tickets", id), newTicket);
    setTicketCounter(n => n + 1);
  }

  const total = tickets.length;
  const inProg = tickets.filter(t => t.column === "inprogress").length;
  const done = tickets.filter(t => t.column === "done").length;
  const critical = tickets.filter(t => t.priority === "critical" && t.column !== "done").length;

  return (
    <div style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif", background: "#F3F4F6", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "0 28px", display: "flex", alignItems: "center", gap: 0, height: 56, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 32 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="4" height="14" rx="1.5" fill="white" opacity="0.9"/><rect x="7" y="1" width="4" height="10" rx="1.5" fill="white" opacity="0.7"/><rect x="13" y="1" width="2" height="7" rx="1" fill="white" opacity="0.5"/></svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#111827", letterSpacing: "-0.3px" }}>TeamFlow</span>
          <span style={{ fontSize: 11, color: "#9CA3AF", background: "#F3F4F6", padding: "2px 7px", borderRadius: 6, fontWeight: 600 }}>v1.0</span>
        </div>

        <div style={{ display: "flex", gap: 2, marginRight: "auto" }}>
          {[["board", "Board"], ["members", "Team"]].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "6px 14px", borderRadius: 7, border: "none", background: view === v ? "#EEF2FF" : "none", color: view === v ? "#4F46E5" : "#6B7280", fontWeight: view === v ? 600 : 400, cursor: "pointer", fontSize: 13, transition: "all 0.15s" }}>{label}</button>
          ))}
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

        <div style={{ display: "flex", alignItems: "center", gap: -8 }}>
          {members.slice(0, 5).map((m: any, i) => (
            <div key={m.id} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 5 - i }}>
              <Avatar member={m} size={28} />
            </div>
          ))}
        </div>
        
        <button onClick={() => auth.signOut()} style={{ marginLeft: 20, background: "none", border: "1px solid #E5E7EB", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#4B5563", cursor: "pointer", transition: "all 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = "#F9FAFB"; e.currentTarget.style.color = "#111827"; }} onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#4B5563"; }}>Sign Out</button>
      </div>

      {view === "members" ? (
        <MembersView members={members} tickets={tickets} onClose={() => setView("board")} />
      ) : (
        <>
          {/* Toolbar */}
          <div style={{ padding: "16px 28px 12px", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <svg width="14" height="14" viewBox="0 0 16 16" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} fill="none"><circle cx="7" cy="7" r="5" stroke="#9CA3AF" strokeWidth="1.5"/><path d="M12 12l2.5 2.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..." style={{ paddingLeft: 30, height: 34, border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, outline: "none", background: "#fff", width: 200 }} />
            </div>
            <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)} style={{ height: 34, border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12, padding: "0 10px", background: "#fff", color: filterAssignee !== "all" ? "#4F46E5" : "#374151" }}>
              <option value="all">All assignees</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ height: 34, border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12, padding: "0 10px", background: "#fff", color: filterPriority !== "all" ? "#4F46E5" : "#374151" }}>
              <option value="all">All priorities</option>
              {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
            <select value={filterLabel} onChange={e => setFilterLabel(e.target.value)} style={{ height: 34, border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12, padding: "0 10px", background: "#fff", color: filterLabel !== "all" ? "#4F46E5" : "#374151" }}>
              <option value="all">All labels</option>
              {LABEL_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            {(search || filterAssignee !== "all" || filterPriority !== "all" || filterLabel !== "all") && (
              <button onClick={() => { setSearch(""); setFilterAssignee("all"); setFilterPriority("all"); setFilterLabel("all"); }} style={{ height: 34, padding: "0 12px", border: "1px solid #FCA5A5", background: "#FEF2F2", color: "#DC2626", borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Clear filters</button>
            )}
            <div style={{ marginLeft: "auto" }}>
              <button onClick={() => setCreateFor("todo")} style={{ height: 34, padding: "0 16px", background: "#4F46E5", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ New Ticket</button>
            </div>
          </div>

          {/* Board */}
          <div style={{ display: "flex", gap: 14, padding: "0 28px 28px", overflowX: "auto", flex: 1 }}>
            {columns.map(col => (
              <Column
                key={col.id}
                col={col}
                tickets={filtered.filter(t => t.column === col.id)}
                members={members}
                onTicketClick={setSelectedTicket}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                onDragOver={setDragOver}
                dragOver={dragOver}
                draggingId={draggingId}
                onAddTicket={setCreateFor}
              />
            ))}
          </div>
        </>
      )}

      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          members={members}
          columns={columns}
          onClose={() => setSelectedTicket(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
      {createFor && (
        <CreateTicketModal
          defaultColumn={createFor}
          members={members}
          columns={columns}
          onClose={() => setCreateFor(null)}
          onCreate={handleCreate}
          nextId={`TEAM-${String(ticketCounter).padStart(3, "0")}`}
        />
      )}
    </div>
  );
}
