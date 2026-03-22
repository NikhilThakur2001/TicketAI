import { Ticket, Member } from '../../types';
import { Avatar } from '../ui/Avatar';
import { PriorityBadge } from '../ui/PriorityBadge';
import { LabelTag } from '../ui/LabelTag';

function getMember(id: string | null | undefined, members: Member[]) { return members.find(m => m.id === id); }

export function TicketCard({ ticket, members, onClick, onDragStart, onDragEnd, isDragging }: any) {
  const assignee = getMember(ticket.assignee, members);
  const isOverdue = ticket.due && new Date(ticket.due) < new Date() && ticket.column !== "done";
  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, ticket.id)}
      onDragEnd={onDragEnd}
      onClick={() => onClick(ticket)}
      style={{
        background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 14px", cursor: "pointer",
        opacity: isDragging ? 0.4 : 1, transition: "box-shadow 0.15s, transform 0.1s",
        boxShadow: isDragging ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
        userSelect: "none",
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600, fontFamily: "monospace" }}>{ticket.id}</span>
        <PriorityBadge priority={ticket.priority as string} />
      </div>
      <p style={{ margin: "0 0 10px", fontSize: 13.5, fontWeight: 500, color: "#111827", lineHeight: 1.4 }}>{ticket.title}</p>
      {ticket.labels.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
          {ticket.labels.map((l: string) => <LabelTag key={l} label={l} />)}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Avatar member={assignee} size={24} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {ticket.comments.length > 0 && (
            <span style={{ fontSize: 11, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 3 }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M14 1H2a1 1 0 00-1 1v8a1 1 0 001 1h3l3 3 3-3h3a1 1 0 001-1V2a1 1 0 00-1-1z" stroke="#9CA3AF" strokeWidth="1.5" fill="none"/></svg>
              {ticket.comments.length}
            </span>
          )}
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
