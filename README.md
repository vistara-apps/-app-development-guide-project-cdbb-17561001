
# StatementSage

Transform bank statements into smart financial insights, effortlessly.

## Features

- **Automated Statement Conversion**: Upload bank statements (PDF, image) and get structured transaction data
- **Intelligent Data Tagging**: AI-powered transaction categorization
- **Spending Pattern Visualization**: Beautiful charts and graphs of your financial data  
- **Personalized Financial Recommendations**: Actionable insights based on your spending habits
- **Base MiniApp**: Integrated with Base Wallet for seamless user experience

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **AI**: OpenAI for transaction extraction and insights
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion
- **MiniKit**: Base MiniApp integration

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your API keys (OpenAI, OnchainKit)

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open**: http://localhost:3000

## Usage

1. **Upload**: Click to upload a bank statement (PDF or image)
2. **Process**: AI extracts and categorizes transactions
3. **Analyze**: View spending breakdown with interactive charts
4. **Insights**: Get personalized financial recommendations

## Key Components

- `FileUploadButton`: Drag & drop file upload with validation
- `TransactionListItem`: Display individual transactions with categories
- `ChartDisplay`: Pie and bar charts for spending visualization
- `InsightCard`: Personalized financial recommendations
- `MiniAppFrame`: Base MiniApp wrapper with wallet integration

## API Integration

- **OpenAI**: Transaction extraction and categorization
- **Base MiniKit**: Wallet connection and frame management
- **Recharts**: Data visualization

## Features Roadmap

- [ ] OCR for PDF/image text extraction
- [ ] Advanced spending pattern analysis
- [ ] Budget tracking and alerts
- [ ] Multi-bank account support
- [ ] Export reports functionality
- [ ] Subscription management with Stripe

## License

MIT License
