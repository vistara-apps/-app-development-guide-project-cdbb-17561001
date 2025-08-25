"use client";

import { usePayment } from '../hooks/usePayment';
import { LoadingSpinner } from './LoadingSpinner';

interface PaymentProcessorProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentProcessor({ amount, onSuccess, onCancel }: PaymentProcessorProps) {
  const { 
    makePayment, 
    isProcessing, 
    error, 
    txHash, 
    status 
  } = usePayment({
    onSuccess: () => {
      // Add a small delay for better UX
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }
  });

  const handlePayment = async () => {
    await makePayment(amount);
  };

  return (
    <div className="space-y-4">
      {status === 'idle' && (
        <div className="text-center">
          <h3 className="heading mb-2">Confirm Payment</h3>
          <p className="body text-gray-600 mb-4">
            You are about to pay {amount} USDC for a Pro subscription.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              className="btn-accent flex-1"
            >
              Pay Now
            </button>
          </div>
        </div>
      )}

      {status === 'processing' && (
        <div className="text-center">
          <LoadingSpinner />
          <h3 className="heading mt-4 mb-2">Processing Payment</h3>
          <p className="body text-gray-600">
            Please confirm the transaction in your wallet...
          </p>
        </div>
      )}

      {status === 'confirming' && (
        <div className="text-center">
          <LoadingSpinner />
          <h3 className="heading mt-4 mb-2">Confirming Transaction</h3>
          <p className="body text-gray-600 mb-2">
            Waiting for blockchain confirmation...
          </p>
          {txHash && (
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm hover:underline"
            >
              View transaction on BaseScan
            </a>
          )}
        </div>
      )}

      {status === 'success' && (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="heading mb-2">Payment Successful!</h3>
          <p className="body text-gray-600">
            Your Pro subscription has been activated.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="heading mb-2">Payment Failed</h3>
          <p className="body text-red-500 mb-4">
            {error || 'An error occurred during payment processing.'}
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              className="btn-accent flex-1"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
