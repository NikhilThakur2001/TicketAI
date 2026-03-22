export type TicketPriority = "low" | "medium" | "high" | "critical";

export type ColumnId = "todo" | "inprogress" | "review" | "done";

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
  storyPoints?: number | null;
}

export interface Member {
  id: string;
  name: string;
  initials: string;
  color: string;
  email?: string;
  role?: string;
}

export interface BoardColumn {
  id: ColumnId | string;
  title: string;
  color: string;
}
