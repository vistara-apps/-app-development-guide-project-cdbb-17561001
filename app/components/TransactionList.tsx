"use client";

import { useState } from "react";

interface Transaction {
  transactionId: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  merchant: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
  showSearch?: boolean;
}

export function TransactionList({ 
  transactions, 
  limit,
  showSearch = false 
}: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Groceries": "bg-green-100 text-green-800",
      "Transportation": "bg-blue-100 text-blue-800",
      "Income": "bg-purple-100 text-purple-800",
      "Dining": "bg-orange-100 text-orange-800",
      "Utilities": "bg-yellow-100 text-yellow-800",
      "Entertainment": "bg-pink-100 text-pink-800",
      "Shopping": "bg-indigo-100 text-indigo-800",
      "Healthcare": "bg-red-100 text-red-800",
      "Transfer": "bg-gray-100 text-gray-800",
      "Other": "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Groceries": "🛒",
      "Transportation": "🚗",
      "Income": "💰",
      "Dining": "🍽️",
      "Utilities": "💡",
      "Entertainment": "🎬",
      "Shopping": "🛍️",
      "Healthcare": "⚕️",
      "Transfer": "↔️",
      "Other": "📋",
    };
    return icons[category] || "📋";
  };

  const formatAmount = (amount: number) => {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    return {
      formatted: `$${absAmount.toFixed(2)}`,
      isNegative
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleSort = (field: "date" | "amount") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder(field === "date" ? "desc" : "desc");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedTransaction(expandedTransaction === id ? null : id);
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(searchLower) ||
        transaction.merchant.toLowerCase().includes(searchLower) ||
        transaction.category.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
    });

  // Apply limit if provided
  const displayedTransactions = limit 
    ? filteredTransactions.slice(0, limit) 
    : filteredTransactions;

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
              aria-label="Search transactions"
            />
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex space-x-4">
              <button 
                onClick={() => toggleSort("date")}
                className={`flex items-center space-x-1 ${sortBy === "date" ? "text-primary font-medium" : "text-text-secondary"}`}
                aria-label={`Sort by date ${sortOrder === "asc" ? "ascending" : "descending"}`}
              >
                <span>Date</span>
                {sortBy === "date" && (
                  <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </button>
              
              <button 
                onClick={() => toggleSort("amount")}
                className={`flex items-center space-x-1 ${sortBy === "amount" ? "text-primary font-medium" : "text-text-secondary"}`}
                aria-label={`Sort by amount ${sortOrder === "asc" ? "ascending" : "descending"}`}
              >
                <span>Amount</span>
                {sortBy === "amount" && (
                  <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </button>
            </div>
            
            {searchTerm && (
              <span className="text-text-secondary">
                {filteredTransactions.length} results
              </span>
            )}
          </div>
        </div>
      )}
      
      {displayedTransactions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-text-secondary">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayedTransactions.map((transaction) => {
            const { formatted, isNegative } = formatAmount(transaction.amount);
            const isExpanded = expandedTransaction === transaction.transactionId;
            
            return (
              <div 
                key={transaction.transactionId}
                className={`bg-surface border border-gray-200 rounded-lg overflow-hidden transition-all ${
                  isExpanded ? "shadow-md" : "hover:shadow-sm"
                }`}
              >
                <div 
                  className="flex items-center justify-between p-3 cursor-pointer"
                  onClick={() => toggleExpand(transaction.transactionId)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      toggleExpand(transaction.transactionId);
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isNegative ? "bg-red-100" : "bg-green-100"
                    }`}>
                      <span role="img" aria-label={transaction.category}>
                        {getCategoryIcon(transaction.category)}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="body font-medium text-text truncate">
                        {transaction.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <span className="truncate">{transaction.merchant}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{formatDate(transaction.date)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end ml-4">
                    <p className={`body font-semibold ${
                      isNegative ? "text-error" : "text-success"
                    }`}>
                      {isNegative ? "-" : "+"}{formatted}
                    </p>
                    <span className="sm:hidden text-xs text-text-tertiary">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-gray-100 bg-gray-50 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-text-tertiary mb-1">Date</p>
                        <p className="text-sm">{new Date(transaction.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary mb-1">Category</p>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(transaction.category)}`}>
                          {transaction.category}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary mb-1">Merchant</p>
                        <p className="text-sm">{transaction.merchant}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary mb-1">Transaction ID</p>
                        <p className="text-sm text-text-secondary">{transaction.transactionId}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {limit && transactions.length > limit && (
        <div className="text-center pt-2">
          <button className="text-primary text-sm font-medium hover:text-primary/80 transition-colors">
            View All ({transactions.length})
          </button>
        </div>
      )}
    </div>
  );
}
