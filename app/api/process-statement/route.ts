
import { NextRequest, NextResponse } from 'next/server';
import { extractTransactionsFromText, categorizeTransaction } from '../../lib/openai';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // For demo purposes, return mock processing result
    // In production, you would:
    // 1. Extract text from PDF/image using OCR (like Tesseract.js or cloud services)
    // 2. Use OpenAI to extract and categorize transactions
    
    const mockResult = {
      success: true,
      transactions: [
        {
          date: '2024-01-15',
          description: 'Grocery Store Purchase',
          amount: -85.42,
          category: 'Groceries',
          merchant: 'SuperMart'
        },
        {
          date: '2024-01-14',
          description: 'Electric Bill Payment',
          amount: -125.30,
          category: 'Utilities',
          merchant: 'PowerCorp'
        }
      ],
      insights: [
        {
          type: 'recommendation',
          title: 'Reduce Dining Expenses',
          description: 'You spent 15% more on dining out this month. Consider meal prepping to save $120/month.',
          amount: 120,
          category: 'Dining'
        }
      ]
    };

    return NextResponse.json(mockResult);
  } catch (error) {
    console.error('Error processing statement:', error);
    return NextResponse.json(
      { error: 'Failed to process statement' },
      { status: 500 }
    );
  }
}
