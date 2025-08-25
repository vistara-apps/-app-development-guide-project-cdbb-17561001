import { createX402Client } from 'x402-axios';
import { type WalletClient } from 'wagmi';

// USDC contract address on Base
const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

// The recipient address for payments
const RECIPIENT_ADDRESS = '0xcdbb00f8ef99436a89796ecd8358e31d';

// Create a type for payment options
export interface PaymentOptions {
  amount: number; // Amount in USDC
  walletClient: WalletClient;
  onSuccess?: (txHash: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Process a payment using x402 and USDC on Base
 */
export async function processPayment({
  amount,
  walletClient,
  onSuccess,
  onError
}: PaymentOptions): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    // Create x402 client
    const x402Client = createX402Client({
      walletClient,
      chainId: 8453, // Base chain ID
    });

    // Convert amount to proper decimal representation (USDC has 6 decimals)
    const amountInWei = BigInt(amount * 1_000_000);

    // Execute the payment
    const txHash = await x402Client.pay({
      tokenAddress: USDC_CONTRACT_ADDRESS,
      recipientAddress: RECIPIENT_ADDRESS,
      amount: amountInWei,
    });

    // Call success callback if provided
    if (onSuccess && txHash) {
      onSuccess(txHash);
    }

    return {
      success: true,
      txHash,
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    
    // Call error callback if provided
    if (onError && error instanceof Error) {
      onError(error);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown payment error',
    };
  }
}

/**
 * Check transaction confirmation status
 */
export async function checkTransactionStatus(txHash: string): Promise<{ confirmed: boolean; status?: string }> {
  try {
    // In a real implementation, you would use a provider to check the transaction status
    // For this demo, we'll simulate a successful confirmation
    return {
      confirmed: true,
      status: 'confirmed',
    };
  } catch (error) {
    console.error('Error checking transaction status:', error);
    return {
      confirmed: false,
      status: 'failed',
    };
  }
}

