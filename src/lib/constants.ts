import { Member, BoardColumn, Ticket } from '../types';

export const COLORS = ["#4F46E5","#0891B2","#059669","#D97706","#DC2626","#7C3AED","#DB2777","#2563EB","#65A30D","#EA580C"];

export const INIT_MEMBERS: Member[] = [
  { id: "u1", name: "Alex Rivera", initials: "AR", color: COLORS[0], role: "Engineering" },
  { id: "u2", name: "Sam Chen", initials: "SC", color: COLORS[1], role: "Design" },
  { id: "u3", name: "Jordan Park", initials: "JP", color: COLORS[2], role: "Product" },
  { id: "u4", name: "Morgan Lee", initials: "ML", color: COLORS[3], role: "Engineering" },
  { id: "u5", name: "Casey Wu", initials: "CW", color: COLORS[4], role: "QA" },
];

export const INIT_COLUMNS: BoardColumn[] = [
  { id: "backlog", title: "Backlog", color: "#6B7280" },
  { id: "todo", title: "To Do", color: "#3B82F6" },
  { id: "inprogress", title: "In Progress", color: "#F59E0B" },
  { id: "review", title: "In Review", color: "#8B5CF6" },
  { id: "done", title: "Done", color: "#10B981" },
];

export const PRIORITIES = [
  { id: "critical", label: "Critical", color: "#DC2626", bg: "#FEF2F2" },
  { id: "high", label: "High", color: "#EA580C", bg: "#FFF7ED" },
  { id: "medium", label: "Medium", color: "#D97706", bg: "#FFFBEB" },
  { id: "low", label: "Low", color: "#059669", bg: "#F0FDF4" },
];

export const LABEL_OPTIONS = ["Bug","Feature","Enhancement","Documentation","Design","Testing","DevOps","Security","Performance","Research"];
export const LABEL_COLORS: Record<string, string> = { Bug:"#DC2626", Feature:"#4F46E5", Enhancement:"#7C3AED", Documentation:"#2563EB", Design:"#DB2777", Testing:"#059669", DevOps:"#0891B2", Security:"#EA580C", Performance:"#D97706", Research:"#6B7280" };

export const INIT_TICKETS: Ticket[] = [
  { id: "TEAM-001", title: "Set up CI/CD pipeline", description: "Configure GitHub Actions for automated testing and deployment.", column: "done", priority: "high", assignee: "u1", labels: ["DevOps"], created: "2026-03-10", due: "2026-03-15", comments: [{ id: "c1", author: "u3", text: "Great work on this!", time: "2026-03-15T10:00:00" }] },
  { id: "TEAM-002", title: "Redesign onboarding flow", description: "Improve new user experience by simplifying the 5-step onboarding into 3 steps.", column: "review", priority: "high", assignee: "u2", labels: ["Design","Feature"], created: "2026-03-12", due: "2026-03-25", comments: [] },
  { id: "TEAM-003", title: "Fix login bug on Safari", description: "Users report they cannot log in on Safari 17. Token not being stored correctly.", column: "inprogress", priority: "critical", assignee: "u4", labels: ["Bug"], created: "2026-03-18", due: "2026-03-22", comments: [{ id: "c2", author: "u5", text: "Reproduced on Safari 17.2. Looks like localStorage issue.", time: "2026-03-19T09:30:00" }] },
  { id: "TEAM-004", title: "Write API documentation", description: "Document all REST endpoints for external developers.", column: "inprogress", priority: "medium", assignee: "u3", labels: ["Documentation"], created: "2026-03-15", due: "2026-03-28", comments: [] },
  { id: "TEAM-005", title: "Add dark mode support", description: "Implement system-aware dark mode across the entire application.", column: "todo", priority: "medium", assignee: "u2", labels: ["Feature","Design"], created: "2026-03-20", due: "2026-04-05", comments: [] },
  { id: "TEAM-006", title: "Performance audit", description: "Run Lighthouse audit and fix issues scoring below 90.", column: "todo", priority: "low", assignee: "u1", labels: ["Performance"], created: "2026-03-20", due: "2026-04-10", comments: [] },
  { id: "TEAM-007", title: "Security penetration test", description: "Hire third-party firm to perform pen test before v2.0 launch.", column: "backlog", priority: "high", assignee: null, labels: ["Security"], created: "2026-03-21", due: "2026-04-20", comments: [] },
  { id: "TEAM-008", title: "User research interviews", description: "Conduct 10 user interviews to gather feedback on the new dashboard.", column: "backlog", priority: "medium", assignee: "u3", labels: ["Research"], created: "2026-03-21", due: null, comments: [] },
];
