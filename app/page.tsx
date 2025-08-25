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
    // This is now handled by the PaymentProcessor component
    // which uses the x402 payment flow
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
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-6 h-11">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">SS</span>
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
        <nav className="flex space-x-1 mb-6 bg-surface rounded-lg p-1">
          {[
            { id: "upload", label: "Upload" },
            { id: "insights", label: "Insights" },
            { id: "subscription", label: "Pro" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "text-text hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="flex-1 space-y-6">
          {activeTab === "upload" && (
            <div className="space-y-6 animate-fade-in">
              <div className="card">
                <h2 className="heading mb-4">Upload Bank Statement</h2>
                <p className="body text-gray-600 mb-4">
                  Upload your bank statement (PDF or image) to get started with smart financial insights.
                </p>
                <FileUploadButton 
                  onFileUpload={handleFileUpload}
                  isProcessing={isProcessing}
                />
              </div>
              
              {isProcessing && (
                <div className="card animate-slide-up">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <h3 className="heading">Processing Statement</h3>
                      <p className="body text-gray-600">AI is analyzing your data...</p>
                    </div>
                  </div>
                </div>
              )}
              
              {transactions.length > 0 && (
                <div className="card animate-slide-up">
                  <h3 className="heading mb-4">Recent Transactions</h3>
                  <TransactionList transactions={transactions.slice(0, 3)} />
                  <button
                    onClick={() => setActiveTab("insights")}
                    className="btn-primary w-full mt-4"
                  >
                    View All Insights
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "insights" && (
            <div className="space-y-6 animate-fade-in">
              {transactions.length === 0 ? (
                <div className="card text-center">
                  <h2 className="heading mb-2">No Data Yet</h2>
                  <p className="body text-gray-600 mb-4">
                    Upload a bank statement to see your financial insights.
                  </p>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="btn-primary"
                  >
                    Upload Statement
                  </button>
                </div>
              ) : (
                <>
                  <ChartDisplay transactions={transactions} />
                  
                  <div className="card">
                    <h3 className="heading mb-4">All Transactions</h3>
                    <TransactionList transactions={transactions} />
                  </div>
                  
                  <InsightCard 
                    title="Spending Insight"
                    content="You spent 23% more on dining out this month compared to last month. Consider meal prepping to save money."
                    type="recommendation"
                  />
                  
                  {!isProUser && (
                    <div className="card border-2 border-accent">
                      <h3 className="heading text-accent mb-2">Unlock More Insights</h3>
                      <p className="body text-gray-600 mb-4">
                        Get personalized recommendations and unlimited uploads with Pro.
                      </p>
                      <button
                        onClick={() => setActiveTab("subscription")}
                        className="btn-accent"
                      >
                        Upgrade to Pro
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "subscription" && (
            <div className="space-y-6 animate-fade-in">
              <SubscriptionCard 
                isProUser={isProUser}
                onUpgrade={handleSubscriptionUpgrade}
              />
            </div>
          )}
        </main>

        <footer className="mt-6 pt-4 text-center">
          <button
            onClick={() => openUrl("https://base.org/builders/minikit")}
            className="text-gray-500 text-xs hover:text-gray-700 transition-colors"
          >
            Built on Base with MiniKit
          </button>
        </footer>
      </div>
    </div>
  );
}
