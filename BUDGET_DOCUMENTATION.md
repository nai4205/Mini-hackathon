# Budget Management Feature

## Overview
The Budget Management feature provides AI-powered budget planning and tracking capabilities for business expenses. It allows users to set budgets for different categories, monitor spending, and receive intelligent suggestions for budget optimization.

## Features

### 1. Budget Overview
- **Total Budget vs Spent**: Visual representation of overall budget performance
- **Progress Indicator**: Color-coded progress bars showing budget utilization
- **Remaining Budget**: Real-time calculation of remaining funds

### 2. AI-Powered Budget Suggestions
- **Smart Analysis**: AI analyzes historical spending patterns
- **Category-Specific Recommendations**: Tailored suggestions for each expense category
- **Optimization Rules**:
  - Increase budget by 10-20% if utilization > 95%
  - Decrease budget to 80-90% of average spending if utilization < 60%
  - Keep budget stable if utilization is between 60-95%

### 3. Budget Manager
- **Add Categories**: Create new budget categories
- **Edit Budgets**: Modify existing budget amounts
- **Delete Categories**: Remove unused budget categories
- **Real-time Status**: Visual indicators for budget health

### 4. Interactive Budget Cards
- **Two-column Layout**: Optimized for mobile viewing
- **Status Indicators**: Color-coded status (Good, On Track, Near Limit, Over Budget)
- **Quick Info**: Budget amount, spent amount, and remaining funds
- **Progress Visualization**: Animated progress bars

### 5. Floating Action Button (FAB)
- **Quick Actions**: Easy access to common budget operations
- **Animated Menu**: Smooth animations for better UX
- **Three Actions**:
  - Get AI Insights
  - Add Category
  - Edit Budgets

## API Endpoints

### Generate Budget Suggestions
```
POST /api/generate-budget-suggestions
```

**Request Body:**
```json
{
  "transactions": [/* transaction data */],
  "currentBudgets": {
    "category": 1000
  },
  "categoryAverages": {
    "category": 950
  }
}
```

**Response:**
```json
{
  "suggestions": [
    {
      "category": "Marketing",
      "currentBudget": 500,
      "suggestedBudget": 600,
      "avgSpending": 580,
      "reasoning": "Consistently overspending suggests need for budget increase"
    }
  ],
  "metadata": {
    "totalCategories": 8,
    "totalSpending": 15000,
    "suggestionsCount": 3,
    "generatedAt": "2025-07-15T10:30:00.000Z"
  }
}
```

## Components

### BudgetOverview
Displays overall budget summary with progress indicators.

### AIBudgetSuggestions
Fetches and displays AI-generated budget recommendations.

### BudgetManager
Comprehensive budget management interface for editing and adding categories.

### BudgetCard
Individual budget category cards with status and progress information.

### BudgetFAB
Floating action button for quick access to budget actions.

## Data Structure

### Budget Interface
```typescript
interface Budget {
  [category: string]: number;
}
```

### Default Categories
- Rent: $3,000
- Salaries: $7,000
- Utilities: $350
- Marketing: $500
- Office Supplies: $200
- Food & Beverage: $300
- Transportation: $150
- Travel: $1,000
- Professional Services: $800
- Insurance: $400
- Equipment: $600
- Software: $300

## Usage

1. **Navigate to Budget Tab**: Access the budget feature from the main navigation
2. **View Overview**: See overall budget health and spending patterns
3. **Get AI Insights**: Tap the AI button to receive intelligent budget suggestions
4. **Manage Categories**: Use the FAB to add new categories or edit existing ones
5. **Monitor Progress**: Check individual category cards for detailed status

## Color Coding

- **Green (#4CAF50)**: Good - Under 75% of budget used
- **Orange (#FFA500)**: On Track - 75-89% of budget used
- **Red Orange (#FF8800)**: Near Limit - 90-99% of budget used
- **Red (#FF4444)**: Over Budget - 100%+ of budget used

## AI Intelligence

The AI budget advisor uses Google Gemini to analyze:
- Historical spending patterns
- Monthly trends and variations
- Category-specific utilization rates
- Business growth considerations
- Seasonal spending patterns

The AI provides actionable recommendations with clear reasoning to help optimize budget allocation and improve financial planning.
