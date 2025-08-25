
"use client";

import { useState, useCallback } from 'react';
import { usePrimaryButton } from '@coinbase/onchainkit/minikit';
import { MiniAppFrame } from './components/MiniAppFrame';
import { FileUploadButton } from './components/FileUploadButton';
import { TransactionListItem } from './components/TransactionListItem';
import { ChartDisplay } from './components/ChartDisplay';
import { InsightCard } from './components/InsightCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { mockTransactions, mockInsights, mockSpendingCategories } from './lib/mockData';
import { Transaction, FinancialInsight, SpendingCategory } from './types';
import { extractTransactionsFromText, categorizeTransaction } from './lib/openai';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Upload, FileText, CreditCard } from 'lucide-react';

type ViewState = 'upload' | 'processing' | 'insights';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('upload');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [spendingData, setSpendingData] = useState<SpendingCategory[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chartType, setChartType] = useState<'pieChart' | 'barChart'>('pieChart');

  // Primary button configuration
  usePrimaryButton(
    { 
      text: currentView === 'upload' ? 'Upload Statement' : 
            currentView === 'processing' ? 'Processing...' : 'Upload New Statement'
    },
    () => {
      if (currentView === 'insights') {
        setCurrentView('upload');
        setTransactions([]);
        setInsights([]);
        setSpendingData([]);
      }
    }
  );

  const handleFileUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    setCurrentView('processing');

    try {
      // Simulate file processing for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, use mock data
      // In production, you would:
      // 1. Extract text from PDF/image using OCR
      // 2. Use OpenAI to extract and categorize transactions
      // 3. Generate insights and spending analysis
      
      setTransactions(mockTransactions);
      setInsights(mockInsights);
      setSpendingData(mockSpendingCategories);
      setCurrentView('insights');
    } catch (error) {
      console.error('Error processing file:', error);
      setCurrentView('upload');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const renderUploadView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-lg"
    >
      <div className="text-center space-y-sm">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-display">Transform Your Statements</h2>
        <p className="text-muted">
          Upload your bank statement and get instant financial insights powered by AI
        </p>
      </div>

      <FileUploadButton 
        onFileUpload={handleFileUpload}
        disabled={isProcessing}
      />

      <div className="grid grid-cols-3 gap-sm text-center">
        <div className="space-y-2">
          <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
            <Upload className="h-4 w-4 text-accent" />
          </div>
          <p className="text-xs text-muted">Upload</p>
        </div>
        <div className="space-y-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs text-muted">Analyze</p>
        </div>
        <div className="space-y-2">
          <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <p className="text-xs text-muted">Insights</p>
        </div>
      </div>
    </motion.div>
  );

  const renderProcessingView = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center space-y-lg py-xl"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <LoadingSpinner />
      </div>
      <div>
        <h2 className="text-display mb-sm">Processing Statement</h2>
        <p className="text-muted">
          Our AI is extracting and categorizing your transactions...
        </p>
      </div>
      <div className="space-y-2 text-left">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-sm text-muted">Extracting transaction data</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <span className="text-sm text-muted">Categorizing expenses</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <span className="text-sm text-muted">Generating insights</span>
        </div>
      </div>
    </motion.div>
  );

  const renderInsightsView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-lg"
    >
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-sm">
        <div className="card text-center">
          <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-muted text-xs">Total Spent</p>
          <p className="text-heading">$1,215.01</p>
        </div>
        <div className="card text-center">
          <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <CreditCard className="h-4 w-4 text-accent" />
          </div>
          <p className="text-muted text-xs">Transactions</p>
          <p className="text-heading">{transactions.length}</p>
        </div>
      </div>

      {/* Chart Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-heading">Spending Breakdown</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setChartType('pieChart')}
            className={`p-2 rounded-md transition-colors ${chartType === 'pieChart' ? 'bg-primary text-white' : 'text-muted hover:text-text'}`}
          >
            <PieChart className="h-4 w-4" />
          </button>
          <button
            onClick={() => setChartType('barChart')}
            className={`p-2 rounded-md transition-colors ${chartType === 'barChart' ? 'bg-primary text-white' : 'text-muted hover:text-text'}`}
          >
            <BarChart3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="card">
        <ChartDisplay data={spendingData} variant={chartType} />
      </div>

      {/* Insights */}
      <div>
        <h3 className="text-heading mb-sm">Financial Insights</h3>
        <div className="space-y-sm">
          {insights.map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="text-heading mb-sm">Recent Transactions</h3>
        <div className="card">
          <div className="space-y-0">
            {transactions.slice(0, 5).map((transaction) => (
              <TransactionListItem
                key={transaction.transactionId}
                transaction={transaction}
                variant="withCategoryTag"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <MiniAppFrame>
      <AnimatePresence mode="wait">
        {currentView === 'upload' && renderUploadView()}
        {currentView === 'processing' && renderProcessingView()}
        {currentView === 'insights' && renderInsightsView()}
      </AnimatePresence>
    </MiniAppFrame>
  );
}
