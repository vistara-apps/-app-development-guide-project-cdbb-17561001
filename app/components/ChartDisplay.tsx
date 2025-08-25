
"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface Transaction {
  transactionId: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  merchant: string;
}

interface ChartDisplayProps {
  transactions: Transaction[];
}

export function ChartDisplay({ transactions }: ChartDisplayProps) {
  // Process data for spending by category (only negative amounts)
  const spendingData = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, transaction) => {
      const category = transaction.category;
      const amount = Math.abs(transaction.amount);
      
      if (acc[category]) {
        acc[category] += amount;
      } else {
        acc[category] = amount;
      }
      
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(spendingData).map(([category, amount]) => ({
    category,
    amount,
    percentage: ((amount / Object.values(spendingData).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
  }));

  // Process data for daily spending
  const dailySpending = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      const amount = Math.abs(transaction.amount);
      
      if (acc[date]) {
        acc[date] += amount;
      } else {
        acc[date] = amount;
      }
      
      return acc;
    }, {} as Record<string, number>);

  const barData = Object.entries(dailySpending).map(([date, amount]) => ({
    date,
    amount
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const totalSpending = Object.values(spendingData).reduce((a, b) => a + b, 0);
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Income</h3>
          <p className="display text-green-600">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Spending</h3>
          <p className="display text-red-600">${totalSpending.toFixed(2)}</p>
        </div>
      </div>

      {/* Spending by Category */}
      <div className="card">
        <h3 className="heading mb-4">Spending by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="amount"
                label={({ category, percentage }) => `${category}: ${percentage}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4 space-y-2">
          {pieData.map((item, index) => (
            <div key={item.category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium">{item.category}</span>
              </div>
              <span className="text-sm text-gray-600">${item.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Spending */}
      <div className="card">
        <h3 className="heading mb-4">Daily Spending</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
