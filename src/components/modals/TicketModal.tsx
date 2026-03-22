import { useState } from 'react';
import { Avatar } from '../ui/Avatar';
import { INIT_COLUMNS, PRIORITIES, LABEL_OPTIONS, LABEL_COLORS } from '../../lib/constants';
import { Member } from '../../types';

function getMember(id: string | null | undefined, members: Member[]) { return members.find(m => m.id === id); }

export function TicketModal({ ticket, members, columns, onClose, onSave, onDelete }: any) {
  const [form, setForm] = useState({ ...ticket });
  const [newComment, setNewComment] = useState("");
  const [tab, setTab] = useState("details");

  function handleSave() { onSave(form); onClose(); }
  function addComment() {
    if (!newComment.trim()) return;
    const comment = { id: `c${Date.now()}`, author: members[0]?.id || "u1", text: newComment.trim(), time: new Date().toISOString() };
    setForm((f: any) => ({ ...f, comments: [...f.comments, comment] }));
    setNewComment("");
  }
  function toggleLabel(l: string) {
    setForm((f: any) => ({ ...f, labels: f.labels.includes(l) ? f.labels.filter((x: string) => x !== l) : [...f.labels, l] }));
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 720, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}>
        {/* Header */}
        <div style={{ padding: "20px 24px 0", borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "monospace", fontWeight: 600 }}>{ticket.id}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { if (window.confirm("Delete this ticket?")) { onDelete(ticket.id); onClose(); } }} style={{ fontSize: 12, color: "#DC2626", border: "1px solid #FCA5A5", background: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer" }}>Delete</button>
              <button onClick={handleSave} style={{ fontSize: 12, color: "#fff", border: "none", background: "#4F46E5", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontWeight: 600 }}>Save</button>
              <button onClick={onClose} style={{ fontSize: 18, color: "#9CA3AF", border: "none", background: "none", cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>
          </div>
          <input value={form.title} onChange={e => setForm((f: any) => ({...f, title: e.target.value}))} style={{ width: "100%", border: "none", fontSize: 20, fontWeight: 700, color: "#111827", outline: "none", marginBottom: 14, boxSizing: "border-box" }} placeholder="Ticket title..." />
          <div style={{ display: "flex", gap: 20, fontSize: 13 }}>
            {["details","comments"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0 10px", fontWeight: tab === t ? 600 : 400, color: tab === t ? "#4F46E5" : "#6B7280", borderBottom: tab === t ? "2px solid #4F46E5" : "2px solid transparent", transition: "all 0.15s", textTransform: "capitalize" }}>
                {t === "comments" ? `Comments (${form.comments.length})` : t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Main */}
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {tab === "details" && (
              <>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Description</label>
                <textarea value={form.description} onChange={e => setForm((f: any) => ({...f, description: e.target.value}))} rows={5} style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px 12px", fontSize: 14, color: "#374151", resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.6 }} placeholder="Add a description..." />
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#6B7280", margin: "20px 0 8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Labels</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {LABEL_OPTIONS.map(l => {
                    const active = form.labels.includes(l);
                    const color = LABEL_COLORS[l] || "#6B7280";
                    return (
                      <button key={l} onClick={() => toggleLabel(l)} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 12, border: `1.5px solid ${active ? color : "#E5E7EB"}`, background: active ? `${color}18` : "#fff", color: active ? color : "#6B7280", cursor: "pointer", fontWeight: active ? 600 : 400, transition: "all 0.1s" }}>{l}</button>
                    );
                  })}
                </div>
              </>
            )}
            {tab === "comments" && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
                  {form.comments.length === 0 && <p style={{ color: "#9CA3AF", fontSize: 14 }}>No comments yet.</p>}
                  {form.comments.map((c: any) => {
                    const author = getMember(c.author, members);
                    return (
                      <div key={c.id} style={{ display: "flex", gap: 10 }}>
                        <Avatar member={author} size={30} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 4 }}>
                            <span style={{ fontWeight: 600, fontSize: 13 }}>{author?.name || "Unknown"}</span>
                            <span style={{ fontSize: 11, color: "#9CA3AF" }}>{new Date(c.time).toLocaleDateString()}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: 13.5, color: "#374151", lineHeight: 1.5 }}>{c.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Avatar member={members[0]} size={30} />
                  <div style={{ flex: 1 }}>
                    <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={2} placeholder="Add a comment..." style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 8, padding: "8px 12px", fontSize: 13.5, resize: "none", outline: "none", boxSizing: "border-box" }} onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addComment(); }} />
                    <button onClick={addComment} style={{ marginTop: 6, fontSize: 12, background: "#4F46E5", color: "#fff", border: "none", borderRadius: 6, padding: "5px 14px", cursor: "pointer", fontWeight: 600 }}>Comment</button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ width: 220, borderLeft: "1px solid #F3F4F6", padding: "20px 16px", overflowY: "auto", background: "#FAFAFA", display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { label: "Status", content: (
                <select value={form.column} onChange={e => setForm((f: any) => ({...f, column: e.target.value}))} style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 6, padding: "5px 8px", fontSize: 12, background: "#fff" }}>
                  {INIT_COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              )},
              { label: "Priority", content: (
                <select value={form.priority} onChange={e => setForm((f: any) => ({...f, priority: e.target.value}))} style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 6, padding: "5px 8px", fontSize: 12, background: "#fff" }}>
                  {PRIORITIES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
              )},
              { label: "Assignee", content: (
                <select value={form.assignee || ""} onChange={e => setForm((f: any) => ({...f, assignee: e.target.value || null}))} style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 6, padding: "5px 8px", fontSize: 12, background: "#fff" }}>
                  <option value="">Unassigned</option>
                  {members.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              )},
              { label: "Due Date", content: (
                <input type="date" value={form.due || ""} onChange={e => setForm((f: any) => ({...f, due: e.target.value || null}))} style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 6, padding: "5px 8px", fontSize: 12, background: "#fff", boxSizing: "border-box" }} />
              )},
              { label: "Story Points", content: (
                <input type="number" min="0" value={form.storyPoints || ""} onChange={e => setForm((f: any) => ({...f, storyPoints: e.target.value ? parseInt(e.target.value, 10) : null}))} style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 6, padding: "5px 8px", fontSize: 12, background: "#fff", boxSizing: "border-box" }} placeholder="Points" />
              )},
              { label: "Created", content: <span style={{ fontSize: 12, color: "#6B7280" }}>{form.created}</span> },
            ].map(({ label, content }) => (
              <div key={label}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 6 }}>{label}</div>
                {content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
