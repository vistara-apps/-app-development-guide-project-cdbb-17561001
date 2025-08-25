
import { Transaction, FinancialInsight, SpendingCategory } from '../types';

export const mockTransactions: Transaction[] = [
  {
    transactionId: '1',
    statementId: 'stmt_1',
    date: new Date('2024-01-15'),
    description: 'Grocery Store Purchase',
    amount: -85.42,
    category: 'Groceries',
    merchant: 'SuperMart'
  },
  {
    transactionId: '2',
    statementId: 'stmt_1',
    date: new Date('2024-01-14'),
    description: 'Electric Bill Payment',
    amount: -125.30,
    category: 'Utilities',
    merchant: 'PowerCorp'
  },
  {
    transactionId: '3',
    statementId: 'stmt_1',
    date: new Date('2024-01-13'),
    description: 'Salary Deposit',
    amount: 3500.00,
    category: 'Income',
    merchant: 'TechCorp Inc'
  },
  {
    transactionId: '4',
    statementId: 'stmt_1',
    date: new Date('2024-01-12'),
    description: 'Coffee Shop',
    amount: -4.50,
    category: 'Dining',
    merchant: 'Local Cafe'
  },
  {
    transactionId: '5',
    statementId: 'stmt_1',
    date: new Date('2024-01-11'),
    description: 'Gas Station',
    amount: -45.20,
    category: 'Transportation',
    merchant: 'Shell'
  },
  {
    transactionId: '6',
    statementId: 'stmt_1',
    date: new Date('2024-01-10'),
    description: 'Netflix Subscription',
    amount: -15.99,
    category: 'Entertainment',
    merchant: 'Netflix'
  }
];

export const mockInsights: FinancialInsight[] = [
  {
    type: 'recommendation',
    title: 'Reduce Dining Expenses',
    description: 'You spent 15% more on dining out this month. Consider meal prepping to save $120/month.',
    amount: 120,
    category: 'Dining'
  },
  {
    type: 'info',
    title: 'Great Savings Progress',
    description: 'You saved 22% more than last month. Keep up the excellent work!',
  },
  {
    type: 'warning',
    title: 'Utility Bills Increased',
    description: 'Your utility costs went up by $35 this month. Check for energy-saving opportunities.',
    amount: 35,
    category: 'Utilities'
  }
];

export const mockSpendingCategories: SpendingCategory[] = [
  { name: 'Groceries', amount: 425.30, percentage: 35, color: '#3b82f6' },
  { name: 'Utilities', amount: 285.60, percentage: 23, color: '#ef4444' },
  { name: 'Transportation', amount: 180.45, percentage: 15, color: '#f59e0b' },
  { name: 'Dining', amount: 165.20, percentage: 14, color: '#10b981' },
  { name: 'Entertainment', amount: 95.99, percentage: 8, color: '#8b5cf6' },
  { name: 'Other', amount: 62.46, percentage: 5, color: '#6b7280' }
];
