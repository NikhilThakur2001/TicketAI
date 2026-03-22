import { PRIORITIES, LABEL_OPTIONS } from '../../lib/constants';
import { Member } from '../../types';

interface ToolbarProps {
  search: string; setSearch: (v: string) => void;
  filterAssignee: string; setFilterAssignee: (v: string) => void;
  filterPriority: string; setFilterPriority: (v: string) => void;
  filterLabel: string; setFilterLabel: (v: string) => void;
  members: Member[];
  onNewTicket: () => void;
}

export function Toolbar({ search, setSearch, filterAssignee, setFilterAssignee, filterPriority, setFilterPriority, filterLabel, setFilterLabel, members, onNewTicket }: ToolbarProps) {
  return (
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
        <button onClick={onNewTicket} style={{ height: 34, padding: "0 16px", background: "#4F46E5", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ New Ticket</button>
      </div>
    </div>
  );
}
