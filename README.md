# Business Tracker - AI-Powered Financial Management �

This is a React Native business tracking application built with [Expo](https://expo.dev) featuring AI-powered financial insights and budget management.

## Features 🚀

### 📊 **Analytics Dashboard**
- Real-time financial insights powered by Google Gemini AI
- Interactive charts and visualizations
- Monthly trends and spending patterns
- Smart categorization of transactions

### 💰 **AI Budget Manager**
- Intelligent budget suggestions based on spending patterns
- Category-specific budget tracking
- Visual progress indicators and alerts
- Real-time budget optimization recommendations

### 📝 **Transaction Management**
- Comprehensive transaction tracking
- Smart categorization
- Income and expense monitoring
- Historical data analysis

### 🤖 **AI Integration**
- Google Gemini AI for financial insights
- Personalized budget recommendations
- Spending pattern analysis
- Predictive financial advice

## Get started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up the backend**

   ```bash
   cd backend
   npm install
   ```

3. **Configure AI API Key**
   
   Update `backend/gemini.env` with your Google Gemini API key:
   ```
   GEMINI_API_KEY="your_api_key_here"
   ```

4. **Start the backend server**

   ```bash
   cd backend
   npm start
   ```

5. **Start the Expo app**

   ```bash
   npx expo start
   ```

## App Structure 📁

```
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home dashboard
│   │   ├── analytics.tsx      # AI-powered analytics
│   │   ├── budget.tsx         # Budget management
│   │   ├── categories.tsx     # Category management
│   │   └── transactions.tsx   # Transaction history
├── components/
│   └── tracker/
│       ├── BudgetManager.tsx     # Budget CRUD operations
│       ├── AIBudgetSuggestions.tsx # AI budget insights
│       ├── BudgetOverview.tsx    # Budget summary
│       ├── BudgetCard.tsx        # Individual budget cards
│       └── BudgetFAB.tsx         # Floating action button
├── data/
│   ├── transactions.ts        # Sample transaction data
│   └── budgets.ts            # Budget data management
└── backend/
    └── server.js             # Express server with AI endpoints
```

## Key Features Detail 🔍

### Budget Management
- **AI-Powered Suggestions**: Get intelligent budget recommendations
- **Visual Progress Tracking**: Color-coded status indicators
- **Category Management**: Add, edit, and delete budget categories
- **Real-time Updates**: Live budget vs. spending comparisons

### AI Analytics
- **Spending Insights**: Understand your financial patterns
- **Trend Analysis**: Monthly and category-wise trends
- **Predictive Advice**: Future spending predictions
- **Smart Alerts**: Proactive budget notifications

## API Documentation 📚

See [BUDGET_DOCUMENTATION.md](./BUDGET_DOCUMENTATION.md) for detailed API documentation and feature explanations.

## Technologies Used 🛠️

- **Frontend**: React Native, Expo, TypeScript
- **Backend**: Node.js, Express
- **AI**: Google Gemini API
- **Charts**: React Native SVG, D3
- **Navigation**: Expo Router
- **UI**: Native components with custom styling

## Development 👨‍💻

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License 📄

This project is open source and available under the [MIT License](LICENSE).
