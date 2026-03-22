import { TicketCard } from './TicketCard';
import { BoardColumn as ColType, Ticket, Member } from '../../types';

interface Props {
  col: ColType;
  tickets: Ticket[];
  members: Member[];
  onTicketClick: (t: Ticket) => void;
  onDragStart: (e: any, id: string) => void;
  onDragEnd: () => void;
  onDrop: (e: any, colId: string) => void;
  onDragOver: (colId: string) => void;
  dragOver: string | null;
  draggingId: string | null;
  onAddTicket: (colId: string) => void;
  onEdit: (t: Ticket) => void;
  onDelete: (id: string) => void;
}

export function Column({ col, tickets, members, onTicketClick, onDragStart, onDragEnd, onDrop, onDragOver, dragOver, draggingId, onAddTicket, onEdit, onDelete }: Props) {
  return (
    <div
      onDrop={e => onDrop(e, col.id)}
      onDragOver={e => { e.preventDefault(); onDragOver(col.id); }}
      style={{
        background: dragOver === col.id ? "#F0F9FF" : "#F9FAFB",
        border: dragOver === col.id ? `2px dashed ${col.color}` : "2px solid transparent",
        borderRadius: 14, padding: "0 0 12px", display: "flex", flexDirection: "column",
        minWidth: 250, width: 270, flexShrink: 0, maxHeight: "calc(100vh - 160px)",
        transition: "border 0.15s, background 0.15s"
      }}
    >
      <div style={{ padding: "14px 16px 12px", position: "sticky", top: 0, background: "inherit", borderRadius: "14px 14px 0 0", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: col.color }} />
            <span style={{ fontWeight: 600, fontSize: 13, color: "#374151" }}>{col.title}</span>
            <span style={{ background: "#E5E7EB", color: "#6B7280", fontSize: 11, fontWeight: 600, borderRadius: 10, padding: "1px 7px" }}>{tickets.length}</span>
          </div>
          <button onClick={() => onAddTicket(col.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 20, lineHeight: 1, padding: "0 2px" }} title="Add ticket">+</button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 10px", overflowY: "auto", flex: 1 }}>
        {tickets.map((t: Ticket) => (
          <TicketCard key={t.id} ticket={t} members={members} onClick={onTicketClick} onDragStart={onDragStart} onDragEnd={onDragEnd} isDragging={draggingId === t.id} onEdit={onEdit} onDelete={onDelete} />
        ))}
        {tickets.length === 0 && (
          <div style={{ textAlign: "center", padding: "24px 0", color: "#D1D5DB", fontSize: 13 }}>Drop tickets here</div>
        )}
      </div>
    </div>
  );
}
