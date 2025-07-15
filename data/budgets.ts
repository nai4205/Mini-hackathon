export interface BudgetItem {
  category: string;
  budgetAmount: number;
  spent: number;
  month: string;
}

export interface Budget {
  [category: string]: number;
}

// Default budget categories based on transaction data
export const defaultBudgets: Budget = {
  'Rent': 3000,
  'Salaries': 7000,
  'Utilities': 350,
  'Marketing': 500,
  'Office Supplies': 200,
  'Food & Beverage': 300,
  'Transportation': 150,
  'Travel': 1000,
  'Professional Services': 800,
  'Insurance': 400,
  'Equipment': 600,
  'Software': 300,
};

// Budget storage helper functions (in a real app, these would use AsyncStorage or API)
export const loadBudgets = async (): Promise<Budget> => {
  try {
    // In a real app, you'd load from AsyncStorage:
    // const stored = await AsyncStorage.getItem('budgets');
    // return stored ? JSON.parse(stored) : defaultBudgets;
    return defaultBudgets;
  } catch (error) {
    console.error('Error loading budgets:', error);
    return defaultBudgets;
  }
};

export const saveBudgets = async (budgets: Budget): Promise<boolean> => {
  try {
    // In a real app, you'd save to AsyncStorage:
    // await AsyncStorage.setItem('budgets', JSON.stringify(budgets));
    console.log('Budgets saved:', budgets);
    return true;
  } catch (error) {
    console.error('Error saving budgets:', error);
    return false;
  }
};

export const getBudgetStatus = (spent: number, budget: number) => {
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  
  if (percentage >= 100) {
    return { 
      color: '#FF4444', 
      status: 'Over Budget', 
      severity: 'critical' as const 
    };
  }
  if (percentage >= 90) {
    return { 
      color: '#FF8800', 
      status: 'Near Limit', 
      severity: 'warning' as const 
    };
  }
  if (percentage >= 75) {
    return { 
      color: '#FFA500', 
      status: 'On Track', 
      severity: 'caution' as const 
    };
  }
  return { 
    color: '#4CAF50', 
    status: 'Good', 
    severity: 'safe' as const 
  };
};

export const calculateMonthlyExpenses = (transactions: any[], month?: string) => {
  const currentDate = new Date();
  const targetMonth = month || `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  
  return transactions
    .filter(t => t.type === 'Expense' && t.date.startsWith(targetMonth))
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);
};
