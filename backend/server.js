require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

app.use(express.json());

const genAI = new GoogleGenerativeAI("");

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
      You are a financial advisor AI. Analyze the following business transaction data and provide structured insights.
      
      **Context:**
      - Total Income: $${totalIncome.toLocaleString()}
      - Total Expenses: $${totalExpenses.toLocaleString()}
      - Net Profit: $${netProfit.toLocaleString()}
      
      **Instructions:**
      1. Provide a BRIEF overview (1-2 sentences) and detailed recommendations
      2. Structure your response as JSON with "brief" and "detailed" fields
      3. Focus on actionable insights with specific numbers
      4. Use professional but accessible language
      
      **Transaction Data:**
      ${JSON.stringify(transactions.slice(-20), null, 2)} // Last 20 transactions for context
      
      Please format your response as a valid JSON object:
      {
        "brief": "A concise 1-2 sentence overview of the financial health and key insight",
        "detailed": {
          "overview": "Detailed financial health assessment with specific metrics",
          "keyInsights": [
            "First key insight with specific data",
            "Second key insight with specific data",
            "Third key insight with specific data"
          ],
          "recommendations": [
            "First actionable recommendation",
            "Second actionable recommendation",
            "Third actionable recommendation"
          ],
          "monitoring": [
            "First area to monitor or opportunity"
          ]
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insightText = response.text();

    // Parse the JSON response from AI
    let parsedInsight;
    try {
      // Clean the response text to extract JSON
      const jsonMatch = insightText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedInsight = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback if JSON parsing fails
        parsedInsight = {
          brief: "Financial analysis complete. Click to view detailed insights.",
          detailed: {
            overview: insightText,
            keyInsights: [],
            recommendations: [],
            monitoring: []
          }
        };
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback structure
      parsedInsight = {
        brief: "Financial analysis complete. Click to view detailed insights.",
        detailed: {
          overview: insightText,
          keyInsights: [],
          recommendations: [],
          monitoring: []
        }
      };
    }

    // Enhanced response with metadata
    res.json({ 
      insight: parsedInsight,
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

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});