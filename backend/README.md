# Business Tracker Backend

AI-powered backend service for generating business insights using Google's Gemini AI.

## Features

- 📊 **Financial Health Analysis**: Comprehensive business financial overview
- 🔍 **Category-Specific Insights**: Detailed analysis for specific spending categories
- 💡 **Actionable Recommendations**: AI-generated suggestions for business optimization
- 📈 **Structured Insights**: Well-formatted, professional financial analysis

## API Endpoints

### `/api/generate-insights` (POST)
Generate comprehensive business insights from transaction data.

**Request Body:**
```json
{
  "transactions": [
    {
      "date": "2025-07-15",
      "vendor": "Office Depot", 
      "category": "Office Supplies",
      "amount": -120.50,
      "type": "Expense",
      "description": "Office supplies"
    }
  ]
}
```

**Response:**
```json
{
  "insight": "## 📊 Financial Health Overview\n[AI-generated analysis]",
  "metadata": {
    "totalIncome": 15000,
    "totalExpenses": 12000,
    "netProfit": 3000,
    "profitMargin": "20.0",
    "transactionCount": 45,
    "generatedAt": "2025-07-15T10:30:00.000Z"
  }
}
```

### `/api/category-insights` (POST)
Get focused insights for a specific spending category.

**Request Body:**
```json
{
  "category": "Marketing",
  "transactions": [...]
}
```

### `/api/health` (GET)
Health check endpoint for service monitoring.

## Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file:
   ```env
   GOOGLE_AI_API_KEY=your_gemini_api_key_here
   ```

3. **Start Server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

The server will run on `http://localhost:3000`

## AI Insights Format

The AI generates insights in a structured format:

- **📊 Financial Health Overview**: Overall business financial assessment
- **🔍 Key Insights**: Data-driven observations with specific metrics
- **💡 Recommendations**: Actionable steps for improvement
- **⚠️ Areas to Monitor**: Potential concerns or opportunities

## Dependencies

- **Express**: Web framework
- **@google/generative-ai**: Google's Gemini AI SDK
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management

## Security Notes

- Store API keys securely in environment variables
- Enable CORS only for trusted domains in production
- Implement rate limiting for production use
- Add authentication for sensitive endpoints
