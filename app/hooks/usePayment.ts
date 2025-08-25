"use client";

import { useState } from 'react';
import { useWalletClient } from 'wagmi';
import { processPayment, checkTransactionStatus } from '../lib/x402';

interface UsePaymentOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function usePayment({ onSuccess, onError }: UsePaymentOptions = {}) {
  const { data: walletClient } = useWalletClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'confirming' | 'success' | 'error'>('idle');

  const makePayment = async (amount: number) => {
    if (!walletClient) {
      const errorMsg = 'Wallet not connected. Please connect your wallet to continue.';
      setError(errorMsg);
      onError?.(errorMsg);
      return { success: false, error: errorMsg };
    }

    setIsProcessing(true);
    setStatus('processing');
    setError(null);

    try {
      const result = await processPayment({
        amount,
        walletClient,
        onSuccess: (hash) => {
          setTxHash(hash);
          setStatus('confirming');
          verifyTransaction(hash);
        },
        onError: (err) => {
          const errorMsg = err.message;
          setError(errorMsg);
          setStatus('error');
          setIsProcessing(false);
          onError?.(errorMsg);
        }
      });

      if (!result.success) {
        const errorMsg = result.error || 'Payment failed';
        setError(errorMsg);
        setStatus('error');
        setIsProcessing(false);
        onError?.(errorMsg);
        return { success: false, error: errorMsg };
      }

      return { success: true, txHash: result.txHash };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMsg);
      setStatus('error');
      setIsProcessing(false);
      onError?.(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const verifyTransaction = async (hash: string) => {
    try {
      // Check transaction status
      const statusResult = await checkTransactionStatus(hash);
      
      if (statusResult.confirmed) {
        // Update user subscription status on the server
        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ txHash: hash }),
        });

        const data = await response.json();
        
        if (data.success) {
          setStatus('success');
          setIsProcessing(false);
          onSuccess?.();
        } else {
          const errorMsg = 'Failed to verify payment on server';
          setError(errorMsg);
          setStatus('error');
          setIsProcessing(false);
          onError?.(errorMsg);
        }
      } else {
        const errorMsg = 'Transaction failed to confirm';
        setError(errorMsg);
        setStatus('error');
        setIsProcessing(false);
        onError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Verification failed';
      setError(errorMsg);
      setStatus('error');
      setIsProcessing(false);
      onError?.(errorMsg);
    }
  };

  const reset = () => {
    setIsProcessing(false);
    setError(null);
    setTxHash(null);
    setStatus('idle');
  };

  return {
    makePayment,
    verifyTransaction,
    reset,
    isProcessing,
    error,
    txHash,
    status,
  };
}

