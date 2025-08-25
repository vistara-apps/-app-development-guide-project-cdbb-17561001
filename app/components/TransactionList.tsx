
"use client";

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
}

export function TransactionList({ transactions }: TransactionListProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Groceries": "bg-green-100 text-green-800",
      "Transportation": "bg-blue-100 text-blue-800",
      "Income": "bg-purple-100 text-purple-800",
      "Dining": "bg-orange-100 text-orange-800",
      "Utilities": "bg-yellow-100 text-yellow-800",
      "Entertainment": "bg-pink-100 text-pink-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
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

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => {
        const { formatted, isNegative } = formatAmount(transaction.amount);
        
        return (
          <div 
            key={transaction.transactionId}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="body font-medium text-text truncate">
                  {transaction.description}
                </p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(transaction.category)}`}>
                  {transaction.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{transaction.merchant}</span>
                <span>•</span>
                <span>{formatDate(transaction.date)}</span>
              </div>
            </div>
            
            <div className="ml-4">
              <p className={`body font-semibold ${
                isNegative ? "text-red-600" : "text-green-600"
              }`}>
                {isNegative ? "-" : "+"}{formatted}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
