
"use client";

import { ReactNode } from 'react';
import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface MiniAppFrameProps {
  children: ReactNode;
  variant?: 'default';
}

export function MiniAppFrame({ children, variant = 'default' }: MiniAppFrameProps) {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  
  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    try {
      const result = await addFrame();
      setFrameAdded(Boolean(result));
    } catch (error) {
      console.error('Error adding frame:', error);
    }
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <motion.button
          onClick={handleAddFrame}
          className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors p-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Save</span>
        </motion.button>
      );
    }

    if (frameAdded) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-1 text-accent"
        >
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">Saved</span>
        </motion.div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <h1 className="text-heading">StatementSage</h1>
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-muted text-sm" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
          </div>
          <div>{saveFrameButton}</div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="mt-lg pt-md flex justify-center border-t border-border">
          <button
            onClick={() => openUrl("https://base.org/builders/minikit")}
            className="text-muted text-xs hover:text-text transition-colors"
          >
            Built on Base with MiniKit
          </button>
        </footer>
      </div>
    </div>
  );
}
