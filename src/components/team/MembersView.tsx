import { Avatar } from '../ui/Avatar';

export function MembersView({ members, tickets, onClose }: any) {
  return (
    <div style={{ padding: "24px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Team Members</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 14, color: "#4F46E5", cursor: "pointer", fontWeight: 600 }}>← Back to Board</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {members.map((m: any) => {
          const myTickets = tickets.filter((t: any) => t.assignee === m.id);
          const inProgress = myTickets.filter((t: any) => t.column === "inprogress").length;
          const done = myTickets.filter((t: any) => t.column === "done").length;
          const critical = myTickets.filter((t: any) => t.priority === "critical" && t.column !== "done").length;
          return (
            <div key={m.id} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <Avatar member={m} size={46} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>{m.role}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[["Total", myTickets.length, "#6B7280"], ["Active", inProgress, "#F59E0B"], ["Done", done, "#10B981"]].map(([label, val, color]) => (
                  <div key={label as string} style={{ textAlign: "center", padding: "10px 4px", background: "#F9FAFB", borderRadius: 8 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: color as string }}>{val as number}</div>
                    <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{label as string}</div>
                  </div>
                ))}
              </div>
              {critical > 0 && <div style={{ marginTop: 10, fontSize: 11, color: "#DC2626", background: "#FEF2F2", borderRadius: 6, padding: "4px 10px", fontWeight: 600 }}>⚠ {critical} critical ticket{critical > 1 ? "s" : ""} open</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
