import { useState } from 'react';
import { Avatar } from '../ui/Avatar';
import { INIT_COLUMNS, PRIORITIES, LABEL_OPTIONS, LABEL_COLORS } from '../../lib/constants';
import { Member, BoardColumn, Ticket } from '../../types';
import { useAuth } from '../auth/AuthProvider';

function getMember(id: string | null | undefined, members: Member[]) { return members.find(m => m.id === id); }

interface Props {
  ticket: Ticket;
  members: Member[];
  columns: BoardColumn[];
  onClose: () => void;
  onSave: (t: Ticket) => void;
}

export function TicketModal({ ticket, members, columns, onClose, onSave }: Props) {
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();
  
  function handleCommentSubmit() {
    if (!newComment.trim()) return;
    
    // Check mentions: triggers email if a comment contains @Firstname-Lastname
    const mentionedMembers = members.filter(m => newComment.toLowerCase().includes(`@${m.name.replace(/\s+/g, '-').toLowerCase()}`));
    
    mentionedMembers.forEach(m => {
      if (m.email) {
        fetch("/api/send-email", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: m.email,
            subject: `You were mentioned in Ticket ${ticket.id}`,
            text: `You were mentioned by ${user?.displayName || "a team member"} in a comment on ticket ${ticket.id} (${ticket.title}):\n\n"${newComment}"`
          })
        }).catch(console.error);
      }
    });

    const c = { id: Date.now().toString(), author: user?.uid || "u1", text: newComment, time: new Date().toISOString() };
    onSave({ ...ticket, comments: [...ticket.comments, c] });
    setNewComment("");
  }

  const assignee = getMember(ticket.assignee, members);
  const column = columns.find(c => c.id === ticket.column);
  const priority = PRIORITIES.find(p => p.id === ticket.priority);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, width: "100%", maxWidth: 620, padding: 28, boxShadow: "0 20px 50px rgba(0,0,0,0.18)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#6B7280" }}>{ticket.id}</span>
              <span style={{ background: "#F3F4F6", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, color: "#4B5563" }}>{column?.title || "Unknown"}</span>
              {priority && <span style={{ background: "#F3F4F6", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, color: "#4B5563" }}>{priority.label}</span>}
              {ticket.storyPoints != null && <span style={{ background: "#EEF2FF", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 700, color: "#4F46E5" }}>{ticket.storyPoints} Points</span>}
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827", lineHeight: 1.3 }}>{ticket.title}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#9CA3AF" }}>×</button>
        </div>

        <div style={{ display: "flex", gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #F3F4F6" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 6 }}>DESCRIPTION</div>
            <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{ticket.description || <span style={{ color: "#D1D5DB", fontStyle: "italic" }}>No description provided.</span>}</div>
            
            {ticket.labels.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 6 }}>LABELS</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {ticket.labels.map(l => {
                    const color = LABEL_COLORS[l] || "#6B7280";
                    return <span key={l} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, border: `1px solid ${color}`, background: `${color}10`, color: color, fontWeight: 600 }}>{l}</span>;
                  })}
                </div>
              </div>
            )}
          </div>
          
          <div style={{ width: 180, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16, background: "#F9FAFB", padding: 16, borderRadius: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 8 }}>ASSIGNEE</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar member={assignee} size={24} />
                <span style={{ fontSize: 13, fontWeight: 600, color: assignee ? "#374151" : "#9CA3AF" }}>{assignee ? assignee.name : "Unassigned"}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 4 }}>DUE DATE</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: ticket.due ? "#374151" : "#9CA3AF" }}>{ticket.due || "None"}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 4 }}>CREATED</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{ticket.created}</div>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
            Activity <span style={{ background: "#F3F4F6", padding: "2px 8px", borderRadius: 10, fontSize: 11, color: "#6B7280" }}>{ticket.comments.length}</span>
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
            {ticket.comments.map(c => {
              const author = getMember(c.author, members);
              return (
                <div key={c.id} style={{ display: "flex", gap: 12 }}>
                  <Avatar member={author} size={32} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{author?.name || 'Unknown'}</span>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>{new Date(c.time).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                    </div>
                    <div style={{ fontSize: 13.5, color: "#374151", background: "#F9FAFB", padding: "10px 14px", borderRadius: "0 12px 12px 12px", border: "1px solid #F3F4F6", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                      {c.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <textarea 
                value={newComment} 
                onChange={e => setNewComment(e.target.value)} 
                placeholder="Write a comment... (use @Name to tag and email someone)" 
                style={{ width: "100%", border: "1px solid #E5E7EB", borderRadius: 8, padding: "12px 14px", fontSize: 13.5, resize: "vertical", minHeight: 80, boxSizing: "border-box", outline: "none", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)" }} 
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleCommentSubmit();
                  }
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>Tip: Press <kbd style={{ background: "#F3F4F6", padding: "1px 4px", borderRadius: 4, border: "1px solid #E5E7EB" }}>Ctrl</kbd> + <kbd style={{ background: "#F3F4F6", padding: "1px 4px", borderRadius: 4, border: "1px solid #E5E7EB" }}>Enter</kbd> to save</span>
                <button 
                  onClick={handleCommentSubmit} 
                  disabled={!newComment.trim()} 
                  style={{ background: newComment.trim() ? "#4F46E5" : "#E5E7EB", color: "#fff", border: "none", padding: "6px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: newComment.trim() ? "pointer" : "default", transition: "background 0.2s" }}
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
