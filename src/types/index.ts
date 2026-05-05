import { Timestamp } from 'firebase/firestore';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: Timestamp;
  description: string;
  receiptUrl?: string;
  type: 'expense' | 'income';
  createdAt: Timestamp;
}

export interface ExpenseFormData {
  amount: number;
  category: string;
  date: string;
  description: string;
  receiptUrl?: string;
  type: 'expense' | 'income';
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
}

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health & Fitness',
  'Travel',
  'Education',
  'Personal Care',
  'Gifts & Donations',
  'Investments',
  'Other',
] as const;

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investments',
  'Rental',
  'Refund',
  'Other',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
