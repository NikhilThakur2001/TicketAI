export type TicketPriority = "critical" | "high" | "medium" | "low";
export type ColumnId = "backlog" | "todo" | "inprogress" | "review" | "done";

export interface Comment {
  id: string;
  author: string;
  text: string;
  time: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  column: ColumnId | string;
  priority: TicketPriority | string;
  assignee: string | null;
  labels: string[];
  created: string;
  due: string | null;
  comments: Comment[];
}

export interface Member {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: string;
}

export interface BoardColumn {
  id: string;
  title: string;
  color: string;
}
