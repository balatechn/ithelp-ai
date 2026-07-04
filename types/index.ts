export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: Attachment[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  pinned?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  status: "open" | "in-progress" | "resolved" | "closed";
  category: string;
  department: string;
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
  slaDeadline?: Date;
  comments?: TicketComment[];
}

export interface TicketComment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  isInternal?: boolean;
}

export interface Device {
  id: string;
  name: string;
  type: "pc" | "server" | "printer" | "router" | "switch" | "firewall" | "nas" | "ap" | "other";
  ip?: string;
  mac?: string;
  os?: string;
  ram?: string;
  cpu?: string;
  storage?: string;
  status: "online" | "offline" | "warning";
  lastSeen?: Date;
  assignedTo?: string;
  location?: string;
  warrantyExpiry?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "engineer" | "user";
  department?: string;
  avatar?: string;
  status: "active" | "inactive";
  lastLogin?: Date;
}

export interface KBArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  rating: number;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stats {
  resolvedToday: number;
  openTickets: number;
  avgResponseTime: string;
  aiSuccessRate: number;
}
