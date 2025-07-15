require('dotenv').config({ path: './gemini.env' });
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

// New endpoint for analytics-specific insights
app.post('/api/generate-analytics-insights', async (req, res) => {
  try {
    const { transactions, selectedTab, timeframe = 'current_month' } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Filter transactions based on selected tab
    const filteredTransactions = transactions.filter(t => 
      t.type === (selectedTab === 'income' ? 'Income' : 'Expense')
    );

    // Calculate metrics for the selected type
    const totalAmount = filteredTransactions.reduce((sum, t) => 
      sum + Math.abs(t.amount), 0
    );

    // Get category breakdown
    const categoryBreakdown = filteredTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

    // Get monthly trends (last 6 months)
    const monthlyTrends = {};
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      last6Months.push(monthKey);
      monthlyTrends[monthKey] = 0;
    }

    filteredTransactions.forEach(t => {
      const monthKey = t.date.substring(0, 7); // YYYY-MM format
      if (monthlyTrends.hasOwnProperty(monthKey)) {
        monthlyTrends[monthKey] += Math.abs(t.amount);
      }
    });

    const prompt = `
      You are an expert financial analyst specializing in ${selectedTab === 'income' ? 'revenue' : 'expense'} analysis. 
      Analyze the following ${selectedTab === 'income' ? 'income' : 'expense'} data and provide actionable insights.

      Transaction Type: ${selectedTab === 'income' ? 'Income' : 'Expenses'}
      Total Amount: $${totalAmount.toLocaleString()}
      Number of Transactions: ${filteredTransactions.length}
      
      Category Breakdown:
      ${Object.entries(categoryBreakdown)
        .sort(([,a], [,b]) => b - a)
        .map(([category, amount]) => `- ${category}: $${amount.toLocaleString()}`)
        .join('\n      ')
      }

      Monthly Trends (Last 6 Months):
      ${last6Months.map(month => `- ${month}: $${monthlyTrends[month].toLocaleString()}`).join('\n      ')}

      Please provide insights in the following JSON format:
      {
        "summary": "Brief 1-2 sentence summary of the ${selectedTab} performance",
        "analysis": {
          "trends": "Analysis of monthly trends and patterns",
          "topCategories": "Insights about the highest spending/earning categories",
          "patterns": "Notable patterns or anomalies in the data"
        },
        "recommendations": [
          "Specific actionable recommendation 1",
          "Specific actionable recommendation 2",
          "Specific actionable recommendation 3"
        ],
        "predictions": {
          "nextMonth": "Prediction for next month's ${selectedTab}",
          "advice": "Strategic advice for improving ${selectedTab}"
        },
        "alerts": [
          "Any concerning trends or opportunities to highlight"
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insightText = response.text();

    // Parse the JSON response from AI
    let parsedInsight;
    try {
      const jsonMatch = insightText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedInsight = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback if JSON parsing fails
        parsedInsight = {
          summary: `${selectedTab === 'income' ? 'Revenue' : 'Expense'} analysis complete. Total: $${totalAmount.toLocaleString()}`,
          analysis: {
            trends: insightText,
            topCategories: "Analysis available in detailed view.",
            patterns: "Pattern analysis in progress."
          },
          recommendations: ["Review category performance", "Monitor monthly trends", "Optimize budget allocation"],
          predictions: {
            nextMonth: "Trends suggest continued performance",
            advice: "Continue monitoring key metrics"
          },
          alerts: []
        };
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      parsedInsight = {
        summary: `${selectedTab === 'income' ? 'Revenue' : 'Expense'} analysis complete. Total: $${totalAmount.toLocaleString()}`,
        analysis: {
          trends: "Analysis temporarily unavailable",
          topCategories: "Category breakdown available in charts",
          patterns: "Pattern analysis in progress"
        },
        recommendations: ["Review category performance", "Monitor monthly trends"],
        predictions: {
          nextMonth: "Analysis in progress",
          advice: "Continue monitoring performance"
        },
        alerts: []
      };
    }

    // Enhanced response with metadata
    res.json({ 
      insight: parsedInsight,
      metadata: {
        totalAmount: totalAmount,
        transactionCount: filteredTransactions.length,
        topCategory: Object.entries(categoryBreakdown).sort(([,a], [,b]) => b - a)[0],
        monthlyAverage: totalAmount / 6,
        generatedAt: new Date().toISOString(),
        analysisType: selectedTab
      }
    });
  } catch (error) {
    console.error('Error generating analytics insights:', error);
    res.status(500).json({ 
      error: 'Failed to generate analytics insights',
      message: 'AI analysis temporarily unavailable. Please try again later.'
    });
  }
});

// New endpoint for category-specific insights
app.post('/api/generate-category-insights', async (req, res) => {
  try {
    const { transactions, category, type } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const totalAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const avgAmount = totalAmount / transactions.length;
    
    // Group by vendor for analysis
    const vendorBreakdown = transactions.reduce((acc, t) => {
      acc[t.vendor] = (acc[t.vendor] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

    const prompt = `
      Analyze this specific ${category} category for ${type.toLowerCase()} data:
      
      Category: ${category}
      Type: ${type}
      Total Amount: $${totalAmount.toLocaleString()}
      Number of Transactions: ${transactions.length}
      Average per Transaction: $${avgAmount.toFixed(2)}
      
      Top Vendors/Sources:
      ${Object.entries(vendorBreakdown)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([vendor, amount]) => `- ${vendor}: $${amount.toLocaleString()}`)
        .join('\n      ')
      }

      Provide a concise analysis (2-3 sentences) focusing on:
      1. Performance assessment for this category
      2. Key patterns or notable vendors
      3. One actionable insight or recommendation
      
      Keep it brief and actionable for a mobile alert dialog.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insightText = response.text();

    res.json({ 
      insight: insightText.trim(),
      metadata: {
        category,
        type,
        totalAmount,
        transactionCount: transactions.length,
        avgAmount: avgAmount.toFixed(2),
        topVendor: Object.entries(vendorBreakdown).sort(([,a], [,b]) => b - a)[0]
      }
    });
  } catch (error) {
    console.error('Error generating category insights:', error);
    res.status(500).json({ 
      error: 'Failed to generate category insights',
      message: 'AI analysis temporarily unavailable'
    });
  }
});

// Endpoint for chart/trend insights
app.post('/api/generate-chart-insights', async (req, res) => {
  try {
    const { monthlyData, type } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Calculate trend metrics
    const amounts = monthlyData.map(d => d.amount);
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
    const avgAmount = totalAmount / amounts.length;
    
    // Calculate growth/decline
    const firstMonth = amounts[0];
    const lastMonth = amounts[amounts.length - 1];
    const overallChange = ((lastMonth - firstMonth) / firstMonth * 100).toFixed(1);
    
    // Find highest and lowest months
    const highest = Math.max(...amounts);
    const lowest = Math.min(...amounts);
    const highestMonth = monthlyData.find(d => d.amount === highest)?.month;
    const lowestMonth = monthlyData.find(d => d.amount === lowest)?.month;

    const prompt = `
      Analyze the ${type} trend data over the last ${monthlyData.length} months:
      
      Monthly Data: ${monthlyData.map(d => `${d.month}: $${d.amount.toLocaleString()}`).join(', ')}
      
      Key Metrics:
      - Total: $${totalAmount.toLocaleString()}
      - Average: $${avgAmount.toLocaleString()}
      - Overall Change: ${overallChange}%
      - Peak Month: ${highestMonth} ($${highest.toLocaleString()})
      - Lowest Month: ${lowestMonth} ($${lowest.toLocaleString()})
      
      Provide a brief 2-3 sentence analysis focusing on:
      1. The overall trend (growing, declining, stable)
      2. Notable patterns or seasonal effects
      3. One actionable insight for the upcoming month
      
      Keep it concise and actionable.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insightText = response.text();

    res.json({ 
      insight: insightText.trim(),
      metadata: {
        type,
        overallChange: parseFloat(overallChange),
        avgAmount,
        highestMonth,
        lowestMonth,
        trendDirection: parseFloat(overallChange) > 5 ? 'growing' : parseFloat(overallChange) < -5 ? 'declining' : 'stable'
      }
    });
  } catch (error) {
    console.error('Error generating chart insights:', error);
    res.status(500).json({ 
      error: 'Failed to generate chart insights',
      message: 'AI analysis temporarily unavailable'
    });
  }
});

// New endpoint for month-specific insights
app.post('/api/generate-month-insights', async (req, res) => {
  try {
    const { transactions, selectedMonth } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Filter transactions for the selected month
    const monthTransactions = transactions.filter(t => {
      if (selectedMonth === 'all') return true;
      const transactionDate = new Date(t.date);
      const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
      return transactionMonth === selectedMonth;
    });

    const totalIncome = monthTransactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = monthTransactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const netProfit = totalIncome - totalExpenses;

    // Get top categories for the month
    const categoryBreakdown = monthTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

    const topCategories = Object.entries(categoryBreakdown)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    const monthLabel = selectedMonth === 'all' ? 'All Time' : 
      new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const prompt = `
      Analyze the financial performance for ${monthLabel}:
      
      Summary:
      - Total Income: $${totalIncome.toLocaleString()}
      - Total Expenses: $${totalExpenses.toLocaleString()}  
      - Net Profit: $${netProfit.toLocaleString()}
      - Number of Transactions: ${monthTransactions.length}
      
      Top Categories:
      ${topCategories.map(([cat, amount]) => `- ${cat}: $${amount.toLocaleString()}`).join('\n      ')}
      
      Provide a brief analysis (2-3 sentences) focusing on:
      1. Overall financial health for this ${selectedMonth === 'all' ? 'period' : 'month'}
      2. Notable spending patterns or category performance
      3. One actionable insight or recommendation
      
      Keep it concise and business-focused.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insightText = response.text();

    res.json({ 
      insight: insightText.trim(),
      metadata: {
        selectedMonth,
        monthLabel,
        totalIncome,
        totalExpenses,
        netProfit,
        transactionCount: monthTransactions.length,
        topCategories,
        profitMargin: totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('Error generating month insights:', error);
    res.status(500).json({ 
      error: 'Failed to generate month insights',
      message: 'AI analysis temporarily unavailable'
    });
  }
});

// Quick insights endpoint
app.post('/api/generate-quick-insights', async (req, res) => {
  try {
    const { type, currentTotal, percentageChange } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
      Generate a very brief, actionable insight (1 sentence, max 15 words) for:
      
      ${type === 'income' ? 'Income' : 'Expenses'}: $${currentTotal.toLocaleString()}
      Monthly Change: ${percentageChange > 0 ? '+' : ''}${percentageChange}%
      
      Provide a concise, actionable insight that helps the user understand what this means for their business.
      Focus on the most important takeaway. Be encouraging if positive, constructive if concerning.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insightText = response.text();

    res.json({ 
      insight: insightText.trim().replace(/['"]/g, ''), // Remove quotes
      metadata: {
        type,
        currentTotal,
        percentageChange
      }
    });
  } catch (error) {
    console.error('Error generating quick insights:', error);
    res.status(500).json({ 
      error: 'Failed to generate quick insights'
    });
  }
});

// New endpoint for AI budget suggestions
app.post('/api/generate-budget-suggestions', async (req, res) => {
  try {
    const { transactions, currentBudgets, categoryAverages } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Calculate overall spending trends
    const totalSpending = Object.values(categoryAverages).reduce((sum, amount) => sum + amount, 0);
    const categoryCount = Object.keys(categoryAverages).length;

    // Calculate variance and trends for each category
    const categoryAnalysis = Object.entries(categoryAverages).map(([category, avgSpending]) => {
      const currentBudget = currentBudgets[category] || 0;
      const variance = currentBudget > 0 ? ((avgSpending - currentBudget) / currentBudget * 100) : 0;
      
      return {
        category,
        avgSpending: Math.round(avgSpending),
        currentBudget,
        variance: Math.round(variance * 100) / 100,
        utilizationRate: currentBudget > 0 ? Math.round((avgSpending / currentBudget) * 100) : 0
      };
    });

    const prompt = `
      You are a financial advisor AI specializing in budget optimization. Analyze the spending data and provide intelligent budget suggestions.

      **Business Context:**
      - Total monthly spending: $${totalSpending.toLocaleString()}
      - Number of categories: ${categoryCount}
      - Current budgets vs actual spending analysis below

      **Category Analysis:**
      ${categoryAnalysis.map(cat => 
        `- ${cat.category}: Budget $${cat.currentBudget.toLocaleString()}, Avg Spending $${cat.avgSpending.toLocaleString()}, Utilization ${cat.utilizationRate}%`
      ).join('\n      ')}

      **Instructions:**
      1. For each category, suggest an optimal budget based on historical spending patterns
      2. Consider seasonal variations and business growth
      3. Provide a 15-20 word reasoning for each suggestion
      4. Only suggest changes for categories where adjustment would be beneficial (>10% difference)
      5. Focus on categories that are consistently over/under budget

      **Budget Optimization Rules:**
      - If utilization is >95%: suggest increasing budget by 10-20%
      - If utilization is <60%: suggest decreasing budget to 80-90% of average spending
      - If utilization is 60-95%: budget is optimal, don't suggest changes
      - For essential categories (Rent, Salaries), be conservative with reductions
      - For variable categories (Marketing, Travel), be more flexible

      Please format your response as a JSON array of budget suggestions:
      [
        {
          "category": "Category Name",
          "currentBudget": 1000,
          "suggestedBudget": 1200,
          "avgSpending": 1150,
          "reasoning": "Consistently overspending suggests need for budget increase to avoid financial strain"
        }
      ]

      Only include categories that need adjustment. If all budgets are optimal, return an empty array.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insightText = response.text();

    // Parse the JSON response from AI
    let suggestions = [];
    try {
      const jsonMatch = insightText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error('Error parsing AI budget suggestions:', parseError);
      // Fallback: Generate simple suggestions based on utilization rates
      suggestions = categoryAnalysis
        .filter(cat => cat.utilizationRate > 100 || cat.utilizationRate < 60)
        .map(cat => ({
          category: cat.category,
          currentBudget: cat.currentBudget,
          suggestedBudget: cat.utilizationRate > 100 
            ? Math.round(cat.avgSpending * 1.1) 
            : Math.round(cat.avgSpending * 1.05),
          avgSpending: cat.avgSpending,
          reasoning: cat.utilizationRate > 100 
            ? "Consistently overspending, increase budget to reduce financial pressure"
            : "Underutilized budget, optimize allocation to improve efficiency"
        }));
    }

    res.json({ 
      suggestions,
      metadata: {
        totalCategories: categoryCount,
        totalSpending,
        suggestionsCount: suggestions.length,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating budget suggestions:', error);
    res.status(500).json({ 
      error: 'Failed to generate budget suggestions',
      message: 'AI budget advisor temporarily unavailable'
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});