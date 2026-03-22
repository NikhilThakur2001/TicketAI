import { useState, useRef, useEffect } from 'react';
import { Ticket, Member } from '../../types';
import { Avatar } from '../ui/Avatar';
import { PriorityBadge } from '../ui/PriorityBadge';
import { LabelTag } from '../ui/LabelTag';

function getMember(id: string | null | undefined, members: Member[]) { return members.find(m => m.id === id); }

interface Props {
  ticket: Ticket;
  members: Member[];
  onClick: (t: Ticket) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  onEdit: (t: Ticket) => void;
  onDelete: (id: string) => void;
}

export function TicketCard({ ticket, members, onClick, onDragStart, onDragEnd, isDragging, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const assignee = getMember(ticket.assignee, members);
  const isOverdue = ticket.due && new Date(ticket.due) < new Date() && ticket.column !== "done";
  
  return (
    <div
      draggable
      onDragStart={e => { setMenuOpen(false); onDragStart(e, ticket.id); }}
      onDragEnd={onDragEnd}
      onClick={(e) => {
        if (menuRef.current?.contains(e.target as Node)) return;
        onClick(ticket);
      }}
      style={{
        background: "#fff", borderRadius: 10, boxShadow: isDragging ? "0 10px 20px rgba(0,0,0,0.1)" : "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
        border: "1px solid #E5E7EB", cursor: isDragging ? "grabbing" : "grab", opacity: isDragging ? 0.7 : 1,
        transform: isDragging ? "scale(1.02) rotate(2deg)" : "none", transition: "transform 0.15s, box-shadow 0.15s",
        transformOrigin: "center center", display: "flex", flexDirection: "column"
      }}
    >
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
            {ticket.labels.map(l => <LabelTag key={l} label={l} />)}
          </div>
          
          <div ref={menuRef} style={{ position: "relative", marginLeft: 8 }}>
            <button 
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }} 
              style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: menuOpen ? "#4B5563" : "#9CA3AF", borderRadius: 4 }}
              onMouseOver={e => e.currentTarget.style.color = "#4B5563"}
              onMouseOut={e => { if(!menuOpen) e.currentTarget.style.color = "#9CA3AF"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
            </button>
            
            {menuOpen && (
              <div style={{ position: "absolute", right: 0, top: 24, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", zIndex: 10, minWidth: 100, overflow: "hidden" }}>
                <button 
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit(ticket); }} 
                  style={{ width: "100%", padding: "8px 12px", border: "none", background: "none", textAlign: "left", fontSize: 13, cursor: "pointer", color: "#374151" }}
                  onMouseOver={e => e.currentTarget.style.background = "#F3F4F6"}
                  onMouseOut={e => e.currentTarget.style.background = "none"}
                >
                  Edit
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(ticket.id); }} 
                  style={{ width: "100%", padding: "8px 12px", border: "none", background: "none", textAlign: "left", fontSize: 13, cursor: "pointer", color: "#DC2626" }}
                  onMouseOver={e => e.currentTarget.style.background = "#FEF2F2"}
                  onMouseOut={e => e.currentTarget.style.background = "none"}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#111827", lineHeight: 1.4, marginBottom: 12 }}>{ticket.title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 11, color: "#6B7280" }}>{ticket.id}</span>
            <PriorityBadge priority={ticket.priority} />
          </div>
          <Avatar member={assignee} size={24} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {ticket.due && (
            <span style={{ fontSize: 10.5, color: isOverdue ? "#DC2626" : "#9CA3AF", fontWeight: isOverdue ? 600 : 400 }}>
              {isOverdue ? "⚠ " : ""}{ticket.due}
            </span>
          )}
          {ticket.storyPoints != null && (
            <span style={{ fontSize: 10, background: "#E5E7EB", color: "#4B5563", padding: "2px 6px", borderRadius: 10, fontWeight: 600 }}>
              {ticket.storyPoints}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
