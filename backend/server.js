require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI("AIzaSyAoU93jmAwZS1rkoNrBvKgEY_f-B9KXnRY");

app.post('/api/generate-insights', async (req, res) => {
  try {
    const { transactions } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Calculate some basic metrics for context
    const totalIncome = transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const netProfit = totalIncome - totalExpenses;

    const prompt = `
      You are a financial advisor AI. Analyze the following business transaction data and provide actionable insights.
      
      **Context:**
      - Total Income: $${totalIncome.toLocaleString()}
      - Total Expenses: $${totalExpenses.toLocaleString()}
      - Net Profit: $${netProfit.toLocaleString()}
      
      **Instructions:**
      1. Provide insights in a structured, professional format
      2. Focus on actionable recommendations
      3. Highlight both opportunities and concerns
      4. Keep it concise but valuable (3-4 key points)
      5. Use bullet points for better readability
      6. Include specific numbers where relevant
      
      **Transaction Data:**
      ${JSON.stringify(transactions.slice(-20), null, 2)} // Last 20 transactions for context
      
      Please format your response as:
      
      ## 📊 Financial Health Overview
      [Brief assessment of overall financial position]
      
      ## 🔍 Key Insights
      • [Insight 1 with specific data]
      • [Insight 2 with specific data]
      • [Insight 3 with specific data]
      
      ## 💡 Recommendations
      • [Actionable recommendation 1]
      • [Actionable recommendation 2]
      
      ## ⚠️ Areas to Monitor
      • [Potential concern or opportunity]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insightText = response.text();

    // Enhanced response with metadata
    res.json({ 
      insight: insightText,
      metadata: {
        totalIncome: totalIncome,
        totalExpenses: totalExpenses,
        netProfit: netProfit,
        profitMargin: totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0,
        transactionCount: transactions.length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ 
      error: 'Failed to generate insights',
      message: 'Our AI advisor is temporarily unavailable. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Business Analytics AI Backend'
  });
});

// Category-specific insights endpoint
app.post('/api/category-insights', async (req, res) => {
  try {
    const { category, transactions } = req.body;

    const categoryTransactions = transactions.filter(t => t.category === category);
    
    if (categoryTransactions.length === 0) {
      return res.json({ 
        insight: `No transactions found for category: ${category}`,
        metadata: { transactionCount: 0 }
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const totalAmount = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const avgAmount = totalAmount / categoryTransactions.length;

    const prompt = `
      Analyze the ${category} spending category for a business owner.
      
      **Category:** ${category}
      **Total Spent:** $${totalAmount.toLocaleString()}
      **Number of Transactions:** ${categoryTransactions.length}
      **Average per Transaction:** $${avgAmount.toFixed(2)}
      
      **Recent Transactions:**
      ${JSON.stringify(categoryTransactions.slice(-10), null, 2)}
      
      Provide a focused analysis for this category including:
      - Spending pattern analysis
      - Optimization opportunities
      - Industry benchmarks if applicable
      - Specific actionable recommendations
      
      Keep it concise and actionable (2-3 key points).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insightText = response.text();

    res.json({ 
      insight: insightText,
      metadata: {
        category: category,
        totalAmount: totalAmount,
        avgAmount: avgAmount,
        transactionCount: categoryTransactions.length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating category insights:', error);
    res.status(500).json({ 
      error: 'Failed to generate category insights',
      message: 'Our AI advisor is temporarily unavailable. Please try again later.'
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});