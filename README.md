# StatementSage with x402 Payment Integration

This project implements a financial statement analysis application with x402 payment integration for USDC payments on Base.

## Features

- Upload and analyze bank statements
- View financial insights and transaction history
- Subscription management with x402 payment flow
- USDC payments on Base network

## Payment Flow Implementation

The application uses the x402 payment flow for handling USDC payments on Base. The implementation includes:

1. **x402 Client Integration**: Using `x402-axios` and `wagmi`'s `useWalletClient` to interact with the Base blockchain.

2. **Payment Processing**: The payment flow is implemented in the following components:
   - `app/lib/x402.ts`: Core payment processing functions
   - `app/hooks/usePayment.ts`: Custom React hook for payment state management
   - `app/components/PaymentProcessor.tsx`: UI component for the payment flow
   - `app/api/payment/route.ts`: API endpoint for payment verification

3. **Transaction Verification**: The application verifies transaction confirmations and updates the user's subscription status accordingly.

## Testing the Payment Flow

To test the payment flow:

1. Connect your wallet using the wallet button in the top right
2. Navigate to the "Pro" tab
3. Click "Pay with USDC on Base"
4. Confirm the transaction in your wallet
5. The application will verify the transaction and update your subscription status

## Development

This is a Next.js application with the following tech stack:
- Next.js 15
- React 18
- Wagmi 2
- x402-axios for payments
- TailwindCSS for styling

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

