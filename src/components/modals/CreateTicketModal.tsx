import { useState } from 'react';
import { PRIORITIES, LABEL_OPTIONS, LABEL_COLORS } from '../../lib/constants';

export function CreateTicketModal({ defaultColumn, members, columns, onClose, onCreate, nextId }: any) {
  const [form, setForm] = useState({ title: "", description: "", column: defaultColumn, priority: "medium", assignee: null, labels: [] as string[], due: null as string | null, storyPoints: "" });
  
  function handleCreate() {
    if (!form.title.trim()) return;
    onCreate({ ...form, id: nextId, created: new Date().toISOString().split("T")[0], comments: [], storyPoints: form.storyPoints || null });
    onClose();
  }
  
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 520, padding: 28, boxShadow: "0 20px 50px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#111827" }}>Create Ticket</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#9CA3AF" }}>×</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input autoFocus value={form.title} onChange={e => setForm((f: any) => ({...f, title: e.target.value}))} placeholder="Ticket title *" style={{ border: "1.5px solid #E5E7EB", borderRadius: 8, padding: "10px 12px", fontSize: 14, fontWeight: 500, outline: "none", width: "100%", boxSizing: "border-box" }} onKeyDown={e => { if (e.key === "Enter") handleCreate(); }} />
          <textarea value={form.description} onChange={e => setForm((f: any) => ({...f, description: e.target.value}))} rows={3} placeholder="Description (optional)" style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px 12px", fontSize: 13.5, resize: "vertical", outline: "none", width: "100%", boxSizing: "border-box" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><label style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4 }}>STATUS</label>
              <select value={form.column} onChange={e => setForm((f: any) => ({...f, column: e.target.value}))} style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 8px", fontSize: 12 }}>
                {columns.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div><label style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4 }}>PRIORITY</label>
              <select value={form.priority} onChange={e => setForm((f: any) => ({...f, priority: e.target.value}))} style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 8px", fontSize: 12 }}>
                {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
            <div><label style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4 }}>ASSIGNEE</label>
              <select value={form.assignee || ""} onChange={e => setForm((f: any) => ({...f, assignee: e.target.value || null}))} style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 8px", fontSize: 12 }}>
                <option value="">Unassigned</option>
                {members.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div><label style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4 }}>DUE DATE</label>
              <input type="date" value={form.due || ""} onChange={e => setForm((f: any) => ({...f, due: e.target.value || null}))} style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 8px", fontSize: 12, boxSizing: "border-box" }} />
            </div>
            <div><label style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 4 }}>STORY POINTS</label>
              <input type="number" min="0" value={form.storyPoints} onChange={e => setForm((f: any) => ({...f, storyPoints: e.target.value ? parseInt(e.target.value, 10) : ""}))} placeholder="Points" style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 6, padding: "6px 8px", fontSize: 12, boxSizing: "border-box" }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 6 }}>LABELS</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {LABEL_OPTIONS.map(l => {
                const active = form.labels.includes(l);
                const color = LABEL_COLORS[l] || "#6B7280";
                return <button key={l} onClick={() => setForm((f: any) => ({ ...f, labels: active ? f.labels.filter((x: string) => x !== l) : [...f.labels, l] }))} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 10, border: `1.5px solid ${active ? color : "#E5E7EB"}`, background: active ? `${color}18` : "#fff", color: active ? color : "#6B7280", cursor: "pointer", fontWeight: active ? 600 : 400 }}>{l}</button>;
              })}
            </div>
          </div>
          <button onClick={handleCreate} style={{ width: "100%", padding: "11px", background: "#4F46E5", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 4 }}>Create Ticket</button>
        </div>
      </div>
    </div>
  );
}
