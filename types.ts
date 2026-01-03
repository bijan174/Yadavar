
export type HabitCategory = 'Learning' | 'Health' | 'Work' | 'Personal' | 'Other';

export interface Habit {
  id: string;
  name: string;
  weeklyGoal: number; // times per week
  estimatedDuration: number; // minutes
  category: HabitCategory;
  completions: string[]; // ISO date strings
}

export type EventType = 'Webinar' | 'Class' | 'Exam' | 'Meeting';

export interface FixedEvent {
  id: string;
  name: string;
  type: EventType;
  dateTime: string; // ISO string
  url?: string;
  isDone: boolean;
}

export interface Folder {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  folderId: string;
  content: string;
  updatedAt: string;
}

export type View = 'dashboard' | 'review' | 'notes' | 'finance';

// Finance Types
export type AccountType = 'Bank' | 'Gold' | 'Fund' | 'Cash';
export type TransactionType = 'Income' | 'Expense' | 'Transfer';

export interface FinanceAccount {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  toAccountId?: string; // for Transfers
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  note?: string;
}

export interface Loan {
  id: string;
  name: string;
  totalAmount: number;
  monthlyInstallment: number;
  paidInstallments: number;
  totalInstallments: number;
}
