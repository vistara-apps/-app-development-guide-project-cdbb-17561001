"use client";

import { useState } from "react";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  ResponsiveContainer, Tooltip, Legend, CartesianGrid 
} from "recharts";

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

type ChartType = "pie" | "bar" | "merchant";
type TimeRange = "all" | "week" | "month" | "year";

export function ChartDisplay({ transactions }: ChartDisplayProps) {
  const [activeChart, setActiveChart] = useState<ChartType>("pie");
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  
  // Filter transactions by time range
  const filteredTransactions = transactions.filter(transaction => {
    if (timeRange === "all") return true;
    
    const transactionDate = new Date(transaction.date);
    const now = new Date();
    
    if (timeRange === "week") {
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      return transactionDate >= oneWeekAgo;
    }
    
    if (timeRange === "month") {
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);
      return transactionDate >= oneMonthAgo;
    }
    
    if (timeRange === "year") {
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      return transactionDate >= oneYearAgo;
    }
    
    return true;
  });

  // Process data for spending by category (only negative amounts)
  const spendingData = filteredTransactions
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

  const pieData = Object.entries(spendingData)
    .map(([category, amount]) => {
      const total = Object.values(spendingData).reduce((a, b) => a + b, 0);
      return {
        category,
        amount,
        percentage: ((amount / total) * 100).toFixed(1)
      };
    })
    .sort((a, b) => b.amount - a.amount); // Sort by amount descending

  // Process data for merchant spending
  const merchantSpending = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((acc, transaction) => {
      const merchant = transaction.merchant;
      const amount = Math.abs(transaction.amount);
      
      if (acc[merchant]) {
        acc[merchant] += amount;
      } else {
        acc[merchant] = amount;
      }
      
      return acc;
    }, {} as Record<string, number>);

  // Get top 5 merchants by spending
  const merchantData = Object.entries(merchantSpending)
    .map(([merchant, amount]) => ({ merchant, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Process data for daily/weekly/monthly spending
  const timeGroupedSpending = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((acc, transaction) => {
      let dateFormat: string;
      const transactionDate = new Date(transaction.date);
      
      if (timeRange === "week" || timeRange === "all" && filteredTransactions.length <= 10) {
        // Daily format for week view
        dateFormat = transactionDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      } else if (timeRange === "month") {
        // Group by day of month for month view
        dateFormat = transactionDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      } else {
        // Group by month for year view
        dateFormat = transactionDate.toLocaleDateString('en-US', { 
          month: 'short',
          year: 'numeric'
        });
      }
      
      const amount = Math.abs(transaction.amount);
      
      if (acc[dateFormat]) {
        acc[dateFormat] += amount;
      } else {
        acc[dateFormat] = amount;
      }
      
      return acc;
    }, {} as Record<string, number>);

  const barData = Object.entries(timeGroupedSpending)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => {
      // Sort dates chronologically
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

  const COLORS = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
    '#06b6d4', // cyan
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
    '#6366f1'  // indigo
  ];

  const totalSpending = Object.values(spendingData).reduce((a, b) => a + b, 0);
  const totalIncome = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netSavings = totalIncome - totalSpending;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  // Custom tooltip components
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-lg rounded-md border border-gray-200">
          <p className="font-medium">{data.category}</p>
          <p className="text-sm text-text-secondary">${data.amount.toFixed(2)}</p>
          <p className="text-xs text-text-tertiary">{data.percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-md border border-gray-200">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-text-secondary">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="card">
          <h3 className="text-sm font-medium text-text-secondary mb-1">Income</h3>
          <p className="display text-success">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-text-secondary mb-1">Spending</h3>
          <p className="display text-error">${totalSpending.toFixed(2)}</p>
        </div>
        <div className="card col-span-2 sm:col-span-1">
          <h3 className="text-sm font-medium text-text-secondary mb-1">Savings Rate</h3>
          <p className={`display ${savingsRate >= 0 ? 'text-success' : 'text-error'}`}>
            {savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <div className="bg-surface rounded-lg p-1 shadow-sm inline-flex">
          <button
            onClick={() => setActiveChart("pie")}
            className={`py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${
              activeChart === "pie" ? "bg-primary text-white" : "text-text hover:bg-gray-100"
            }`}
            aria-pressed={activeChart === "pie"}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveChart("bar")}
            className={`py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${
              activeChart === "bar" ? "bg-primary text-white" : "text-text hover:bg-gray-100"
            }`}
            aria-pressed={activeChart === "bar"}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveChart("merchant")}
            className={`py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${
              activeChart === "merchant" ? "bg-primary text-white" : "text-text hover:bg-gray-100"
            }`}
            aria-pressed={activeChart === "merchant"}
          >
            Merchants
          </button>
        </div>
        
        <div className="bg-surface rounded-lg p-1 shadow-sm inline-flex">
          <button
            onClick={() => setTimeRange("all")}
            className={`py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${
              timeRange === "all" ? "bg-primary text-white" : "text-text hover:bg-gray-100"
            }`}
            aria-pressed={timeRange === "all"}
          >
            All
          </button>
          <button
            onClick={() => setTimeRange("week")}
            className={`py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${
              timeRange === "week" ? "bg-primary text-white" : "text-text hover:bg-gray-100"
            }`}
            aria-pressed={timeRange === "week"}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${
              timeRange === "month" ? "bg-primary text-white" : "text-text hover:bg-gray-100"
            }`}
            aria-pressed={timeRange === "month"}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange("year")}
            className={`py-1.5 px-3 text-sm font-medium rounded-md transition-colors ${
              timeRange === "year" ? "bg-primary text-white" : "text-text hover:bg-gray-100"
            }`}
            aria-pressed={timeRange === "year"}
          >
            Year
          </button>
        </div>
      </div>

      {/* Chart Display */}
      <div className="card">
        <h3 className="heading mb-4">
          {activeChart === "pie" && "Spending by Category"}
          {activeChart === "bar" && "Spending Over Time"}
          {activeChart === "merchant" && "Top Merchants"}
        </h3>
        
        {/* No Data State */}
        {(activeChart === "pie" && pieData.length === 0) || 
         (activeChart === "bar" && barData.length === 0) || 
         (activeChart === "merchant" && merchantData.length === 0) ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-text-secondary mb-2">No data available for the selected time range</p>
              <button 
                onClick={() => setTimeRange("all")}
                className="text-primary text-sm font-medium hover:text-primary/80"
              >
                View All Data
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Pie Chart */}
            {activeChart === "pie" && (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="amount"
                      labelLine={false}
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = 25 + innerRadius + (outerRadius - innerRadius);
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        
                        return percent > 0.05 ? (
                          <text 
                            x={x} 
                            y={y} 
                            fill="#333" 
                            textAnchor={x > cx ? 'start' : 'end'} 
                            dominantBaseline="central"
                            className="text-xs"
                          >
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        ) : null;
                      }}
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          stroke="white"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {/* Bar Chart */}
            {activeChart === "bar" && (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis 
                      dataKey="date" 
                      angle={-45} 
                      textAnchor="end" 
                      height={60} 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${value}`} 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Bar 
                      dataKey="amount" 
                      fill="#3b82f6" 
                      radius={[4, 4, 0, 0]} 
                      animationDuration={500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {/* Merchant Chart */}
            {activeChart === "merchant" && (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={merchantData} 
                    layout="vertical" 
                    margin={{ top: 10, right: 10, left: 80, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.2} />
                    <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                    <YAxis 
                      type="category" 
                      dataKey="merchant" 
                      tick={{ fontSize: 12 }}
                      width={80}
                    />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Bar 
                      dataKey="amount" 
                      fill="#10b981" 
                      radius={[0, 4, 4, 0]} 
                      animationDuration={500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
        
        {/* Legend for Pie Chart */}
        {activeChart === "pie" && pieData.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pieData.map((item, index) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium truncate">{item.category}</span>
                </div>
                <span className="text-sm text-text-secondary">${item.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
