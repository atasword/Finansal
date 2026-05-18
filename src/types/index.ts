export type TransactionType = 'income' | 'expense';
export type PaymentMethod = 'cash' | 'card' | 'transfer';
export type RecurringPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type BudgetPeriod = 'monthly' | 'yearly';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string;
  description?: string;
  paymentMethod?: PaymentMethod;
  isRecurring?: boolean;
  recurringPeriod?: RecurringPeriod;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  isDefault: boolean;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string;
}

export interface AppSettings {
  currency: string;
  darkMode: 'system' | 'light' | 'dark';
}
