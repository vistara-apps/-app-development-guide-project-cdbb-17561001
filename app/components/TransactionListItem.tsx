
"use client";

import { Transaction } from '../types';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TransactionListItemProps {
  transaction: Transaction;
  variant?: 'default' | 'withCategoryTag';
}

export function TransactionListItem({ transaction, variant = 'default' }: TransactionListItemProps) {
  const isIncome = transaction.amount > 0;
  const formattedAmount = Math.abs(transaction.amount).toFixed(2);
  const formattedDate = transaction.date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-sm border-b border-border last:border-b-0"
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className={`p-2 rounded-full ${isIncome ? 'bg-accent/10' : 'bg-red-50'}`}>
          {isIncome ? (
            <ArrowUpRight className="h-4 w-4 text-accent" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-body truncate">{transaction.description}</p>
            {variant === 'withCategoryTag' && (
              <span className="category-tag">{transaction.category}</span>
            )}
          </div>
          <div className="flex items-center space-x-2 text-muted">
            <span>{formattedDate}</span>
            {transaction.merchant && (
              <>
                <span>•</span>
                <span className="truncate">{transaction.merchant}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <p className={`text-body font-medium ${isIncome ? 'text-accent' : 'text-red-600'}`}>
          {isIncome ? '+' : '-'}${formattedAmount}
        </p>
      </div>
    </motion.div>
  );
}
