"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
  usePrimaryButton,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useState, useCallback } from "react";
import { FileUploadButton } from "./components/FileUploadButton";
import { TransactionList } from "./components/TransactionList";
import { ChartDisplay } from "./components/ChartDisplay";
import { InsightCard } from "./components/InsightCard";
import { SubscriptionCard } from "./components/SubscriptionCard";

type Transaction = {
  transactionId: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  merchant: string;
};

type TabType = "upload" | "insights" | "subscription";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isProUser, setIsProUser] = useState(false);

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  // Primary button configuration
  usePrimaryButton(
    {
      text: activeTab === "upload" ? "Upload Statement" : 
            activeTab === "insights" ? "View Insights" : "Upgrade to Pro"
    },
    () => {
      if (activeTab === "upload") {
        document.getElementById("file-upload")?.click();
      } else if (activeTab === "insights") {
        setActiveTab("insights");
      } else {
        handleSubscriptionUpgrade();
      }
    }
  );

  const handleFileUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockTransactions: Transaction[] = [
        {
          transactionId: "1",
          date: "2024-01-15",
          description: "Grocery Store Purchase",
          amount: -85.32,
          category: "Groceries",
          merchant: "Whole Foods"
        },
        {
          transactionId: "2",
          date: "2024-01-14",
          description: "Gas Station",
          amount: -45.00,
          category: "Transportation",
          merchant: "Shell"
        },
        {
          transactionId: "3",
          date: "2024-01-13",
          description: "Salary Deposit",
          amount: 2500.00,
          category: "Income",
          merchant: "Employer Inc"
        },
        {
          transactionId: "4",
          date: "2024-01-12",
          description: "Coffee Shop",
          amount: -12.50,
          category: "Dining",
          merchant: "Starbucks"
        }
      ];
      
      setTransactions(mockTransactions);
      setIsProcessing(false);
      setActiveTab("insights");
    }, 3000);
  }, []);

  const handleSubscriptionUpgrade = useCallback(() => {
    // Simulate payment flow
    setIsProUser(true);
  }, []);

  const saveFrameButton = frameAdded ? (
    <div className="flex items-center space-x-1 text-sm font-medium text-primary animate-fade-in">
      <span>✓</span>
      <span>Saved</span>
    </div>
  ) : context && !context.client.added ? (
    <button
      onClick={handleAddFrame}
      className="text-primary text-sm font-medium hover:text-primary/80 transition-colors"
    >
      + Save Frame
    </button>
  ) : null;

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <div className="w-full max-w-md mx-auto px-4 py-3 sm:px-6">
        <header className="flex justify-between items-center mb-6 h-14 sm:h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-base">SS</span>
            </div>
            <div>
              <h1 className="heading text-primary">StatementSage</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Wallet className="z-10">
              <ConnectWallet className="text-sm">
                <Name className="text-inherit" />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
            {saveFrameButton}
          </div>
        </header>

        {/* Tab Navigation */}
        <nav 
          className="flex space-x-1 mb-6 bg-surface rounded-lg p-1 shadow-sm sticky top-0 z-10 backdrop-blur-sm"
          role="tablist"
          aria-label="Main navigation"
        >
          {[
            { id: "upload", label: "Upload", icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )},
            { id: "insights", label: "Insights", icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            )},
            { id: "subscription", label: "Pro", icon: (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            )}
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 py-2.5 px-3 text-sm font-medium rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "text-text hover:bg-gray-100"
              }`}
              aria-selected={activeTab === tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
            >
              <div className="flex items-center justify-center space-x-1.5">
                <span className="hidden sm:inline">{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <main className="flex-1 space-y-6 pb-6">
          <div 
            id="panel-upload" 
            role="tabpanel" 
            aria-labelledby="tab-upload"
            className={`space-y-6 ${activeTab === "upload" ? "animate-fade-in" : "hidden"}`}
          >
            <div className="card">
              <h2 className="heading mb-4">Upload Bank Statement</h2>
              <p className="body text-text-secondary mb-4">
                Upload your bank statement (PDF or image) to get started with smart financial insights.
              </p>
              <FileUploadButton 
                onFileUpload={handleFileUpload}
                isProcessing={isProcessing}
              />
            </div>
            
            {isProcessing && (
              <div className="card animate-slide-up">
                <div className="flex items-center space-x-4">
                  <LoadingSpinner size="sm" />
                  <div>
                    <h3 className="subheading mb-1">Processing Statement</h3>
                    <p className="body-sm text-text-secondary">AI is analyzing your data...</p>
                  </div>
                </div>
              </div>
            )}
            
            {transactions.length > 0 && (
              <div className="card animate-slide-up">
                <h3 className="heading mb-4">Recent Transactions</h3>
                <TransactionList transactions={transactions.slice(0, 3)} limit={3} />
                <button
                  onClick={() => setActiveTab("insights")}
                  className="btn-primary w-full mt-4"
                >
                  View All Insights
                </button>
              </div>
            )}
          </div>

          <div 
            id="panel-insights" 
            role="tabpanel" 
            aria-labelledby="tab-insights"
            className={`space-y-6 ${activeTab === "insights" ? "animate-fade-in" : "hidden"}`}
          >
            {transactions.length === 0 ? (
              <EmptyStateCard
                title="No Data Yet"
                description="Upload a bank statement to see your financial insights."
                actionLabel="Upload Statement"
                onAction={() => setActiveTab("upload")}
                icon={
                  <svg 
                    className="w-8 h-8 text-text-secondary" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                }
              />
            ) : (
              <>
                <ChartDisplay transactions={transactions} />
                
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="heading">All Transactions</h3>
                    <span className="badge-primary">{transactions.length} Total</span>
                  </div>
                  <TransactionList 
                    transactions={transactions} 
                    showSearch={true}
                  />
                </div>
                
                <InsightCard 
                  title="Spending Insight"
                  content="You spent 23% more on dining out this month compared to last month. Consider meal prepping to save money."
                  type="recommendation"
                  actionLabel="View Detailed Analysis"
                  onAction={() => console.log("View detailed analysis")}
                />
                
                {!isProUser && (
                  <div className="card border-2 border-accent">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 text-accent">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="heading text-accent mb-2">Unlock More Insights</h3>
                        <p className="body text-text-secondary mb-4">
                          Get personalized recommendations, unlimited uploads, and advanced analytics with Pro.
                        </p>
                        <button
                          onClick={() => setActiveTab("subscription")}
                          className="btn-accent"
                        >
                          Upgrade to Pro
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div 
            id="panel-subscription" 
            role="tabpanel" 
            aria-labelledby="tab-subscription"
            className={`space-y-6 ${activeTab === "subscription" ? "animate-fade-in" : "hidden"}`}
          >
            <SubscriptionCard 
              isProUser={isProUser}
              onUpgrade={handleSubscriptionUpgrade}
            />
          </div>
        </main>

        <footer className="mt-6 pt-4 pb-6 text-center border-t border-gray-200">
          <button
            onClick={() => openUrl("https://base.org/builders/minikit")}
            className="text-text-tertiary text-xs hover:text-text-secondary transition-colors"
            aria-label="Learn more about Base MiniKit"
          >
            Built on Base with MiniKit
          </button>
        </footer>
      </div>
    </div>
  );
}
