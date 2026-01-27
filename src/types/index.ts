// Core types for the legal management system

export interface Office {
  id: string;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'lawyer' | 'assistant' | 'financial';
  officeId: string;
  status: 'active' | 'vacation' | 'inactive';
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: 'whatsapp' | 'website' | 'referral' | 'other';
  status: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed' | 'lost';
  caseType?: string;
  urgency: 'low' | 'medium' | 'high';
  probability: number;
  assignedTo?: string;
  officeId: string;
  createdAt: Date;
  updatedAt: Date;
  lastContactAt?: Date;
  notes?: string;
  aiClassification?: {
    intent: string;
    sentiment: string;
    suggestedActions: string[];
  };
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  cpf?: string;
  address?: string;
  officeId: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  leadId?: string;
}

export interface Process {
  id: string;
  clientId: string;
  processNumber?: string;
  type: string;
  status: 'intake' | 'documentation' | 'analysis' | 'filing' | 'ongoing' | 'awaiting' | 'completed';
  description: string;
  assignedTo: string;
  officeId: string;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  processId?: string;
  clientId?: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  officeId: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Contract {
  id: string;
  clientId: string;
  serviceId: string;
  status: 'draft' | 'pending_signature' | 'active' | 'completed' | 'cancelled';
  value: number;
  createdAt: Date;
  signedAt?: Date;
  officeId: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  officeId: string;
}

export interface Payment {
  id: string;
  contractId: string;
  clientId: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  paidAt?: Date;
  method?: 'pix' | 'boleto' | 'credit_card' | 'transfer';
  officeId: string;
}

export interface Message {
  id: string;
  leadId?: string;
  clientId?: string;
  content: string;
  sender: 'user' | 'client' | 'ai';
  timestamp: Date;
  attachments?: string[];
}

export interface Notification {
  id: string;
  type: 'task' | 'payment' | 'process' | 'lead' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  officeId: string;
}

// Dashboard metrics
export interface DashboardMetrics {
  totalLeads: number;
  newLeadsToday: number;
  conversionRate: number;
  activeClients: number;
  pendingTasks: number;
  overdueTasks: number;
  monthlyRevenue: number;
  pendingPayments: number;
  overduePayments: number;
}
