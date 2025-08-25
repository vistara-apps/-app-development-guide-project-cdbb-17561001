
export interface User {
  userId: string;
  farcasterId?: string;
  email?: string;
  subscriptionTier: 'free' | 'pro';
}

export interface Statement {
  statementId: string;
  userId: string;
  fileName: string;
  uploadTimestamp: Date;
  processedTimestamp?: Date;
  status: 'uploading' | 'processing' | 'completed' | 'error';
}

export interface Transaction {
  transactionId: string;
  statementId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  merchant?: string;
}

export interface FinancialInsight {
  type: 'recommendation' | 'warning' | 'info';
  title: string;
  description: string;
  amount?: number;
  category?: string;
}

export interface SpendingCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}
