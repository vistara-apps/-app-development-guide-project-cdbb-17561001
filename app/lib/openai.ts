
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export interface ExtractedTransaction {
  date: string;
  description: string;
  amount: number;
  merchant?: string;
}

export async function extractTransactionsFromText(text: string): Promise<ExtractedTransaction[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: `You are a financial data extraction expert. Extract transaction data from bank statements and return a JSON array of transactions. Each transaction should have: date (YYYY-MM-DD), description, amount (negative for debits, positive for credits), and optional merchant name.`
        },
        {
          role: 'user',
          content: `Extract all transactions from this bank statement text: ${text}`
        }
      ],
      temperature: 0.1,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return [];

    // Try to parse JSON from the response
    try {
      const transactions = JSON.parse(content);
      return Array.isArray(transactions) ? transactions : [];
    } catch {
      // If JSON parsing fails, return empty array
      return [];
    }
  } catch (error) {
    console.error('Error extracting transactions:', error);
    return [];
  }
}

export async function categorizeTransaction(description: string, merchant?: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'Categorize this transaction into one of these categories: Groceries, Utilities, Transportation, Dining, Entertainment, Shopping, Healthcare, Income, Transfer, Other. Return only the category name.'
        },
        {
          role: 'user',
          content: `Transaction: ${description}${merchant ? ` at ${merchant}` : ''}`
        }
      ],
      temperature: 0.1,
    });

    return response.choices[0]?.message?.content?.trim() || 'Other';
  } catch (error) {
    console.error('Error categorizing transaction:', error);
    return 'Other';
  }
}

export async function generateFinancialInsights(transactions: ExtractedTransaction[]): Promise<FinancialInsight[]> {
  try {
    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: `Analyze these financial transactions and provide 2-3 actionable insights. Return a JSON array of insights with: type ('recommendation', 'warning', 'info'), title, description, and optional amount/category fields.`
        },
        {
          role: 'user',
          content: `Analyze these transactions: ${JSON.stringify(transactions)}`
        }
      ],
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return [];

    try {
      const insights = JSON.parse(content);
      return Array.isArray(insights) ? insights : [];
    } catch {
      return [];
    }
  } catch (error) {
    console.error('Error generating insights:', error);
    return [];
  }
}
