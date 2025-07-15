export interface Transaction {
  date: string;
  vendor: string;
  category: string;
  amount: number;
  type: 'Income' | 'Expense';
  description: string;
}

export const transactionsData: Transaction[] = [
  { date: '2025-01-02', vendor: 'Landlord', category: 'Rent', amount: -3000, type: 'Expense', description: 'Office rent' },
  { date: '2025-01-02', vendor: 'Payroll', category: 'Salaries', amount: -7000, type: 'Expense', description: 'Team salaries' },
  { date: '2025-01-05', vendor: 'Utility Co', category: 'Utilities', amount: -285.5, type: 'Expense', description: 'Monthly utilities' },
  { date: '2025-01-10', vendor: 'Staples', category: 'Office Supplies', amount: -120, type: 'Expense', description: 'Printer paper' },
  { date: '2025-01-12', vendor: 'Google Ads', category: 'Marketing', amount: -150, type: 'Expense', description: 'Ad campaign' },
  { date: '2025-01-14', vendor: 'Coffee Shop', category: 'Food & Beverage', amount: -18.75, type: 'Expense', description: 'Client meeting' },
  { date: '2025-01-15', vendor: 'Client A', category: 'Consulting', amount: 1200.00, type: 'Income', description: 'Project Alpha' },
  { date: '2025-01-18', vendor: 'Uber', category: 'Transportation', amount: -32.5, type: 'Expense', description: 'Client visit' },
  { date: '2025-01-20', vendor: 'Online Store', category: 'Product Sales', amount: 850.00, type: 'Income', description: 'Product X' },
  { date: '2025-01-25', vendor: 'Office Depot', category: 'Office Supplies', amount: -45, type: 'Expense', description: 'Printer ink' },
  { date: '2025-02-01', vendor: 'Landlord', category: 'Rent', amount: -3000, type: 'Expense', description: 'Office rent' },
  { date: '2025-02-02', vendor: 'Payroll', category: 'Salaries', amount: -7000, type: 'Expense', description: 'Team salaries' },
  { date: '2025-02-05', vendor: 'Utility Co', category: 'Utilities', amount: -315.25, type: 'Expense', description: 'Monthly utilities' },
  { date: '2025-02-08', vendor: 'Facebook Ads', category: 'Marketing', amount: -75, type: 'Expense', description: 'Ad boost' },
  { date: '2025-02-11', vendor: 'Restaurant', category: 'Food & Beverage', amount: -65.4, type: 'Expense', description: 'Team lunch' },
  { date: '2025-02-14', vendor: 'Client B', category: 'Consulting', amount: 950.00, type: 'Income', description: 'Project Beta' },
  { date: '2025-02-16', vendor: 'Gas Station', category: 'Transportation', amount: -48.3, type: 'Expense', description: 'Fuel' },
  { date: '2025-02-22', vendor: 'In-Store', category: 'Product Sales', amount: 1200.00, type: 'Income', description: 'Product Y' },
  { date: '2025-02-25', vendor: 'Amazon', category: 'Office Supplies', amount: -89.99, type: 'Expense', description: 'Desk accessories' },
  { date: '2025-03-01', vendor: 'Landlord', category: 'Rent', amount: -3000, type: 'Expense', description: 'Office rent' },
  { date: '2025-03-02', vendor: 'Payroll', category: 'Salaries', amount: -7000, type: 'Expense', description: 'Team salaries' },
  { date: '2025-03-05', vendor: 'Utility Co', category: 'Utilities', amount: -305.75, type: 'Expense', description: 'Monthly utilities' },
  { date: '2025-03-10', vendor: 'Airline', category: 'Travel', amount: -600, type: 'Expense', description: 'Conference trip' },
  { date: '2025-03-12', vendor: 'Marketing Agency', category: 'Marketing', amount: -450, type: 'Expense', description: 'Campaign' },
  { date: '2025-03-15', vendor: 'Client C', category: 'Consulting', amount: 1850.00, type: 'Income', description: 'Technical advisory' },
  { date: '2025-03-18', vendor: 'Supermarket', category: 'Food & Beverage', amount: -95.2, type: 'Expense', description: 'Office snacks' },
  { date: '2025-03-22', vendor: 'Taxi', category: 'Transportation', amount: -27.8, type: 'Expense', description: 'Airport transfer' },
  { date: '2025-03-25', vendor: 'Distributor', category: 'Product Sales', amount: 2100.00, type: 'Income', description: 'Product Z' },
  { date: '2025-04-01', vendor: 'Landlord', category: 'Rent', amount: -3000, type: 'Expense', description: 'Office rent' },
  { date: '2025-04-02', vendor: 'Payroll', category: 'Salaries', amount: -7000, type: 'Expense', description: 'Team salaries' },
  { date: '2025-04-05', vendor: 'Utility Co', category: 'Utilities', amount: -295.3, type: 'Expense', description: 'Monthly utilities' },
  { date: '2025-04-08', vendor: 'LinkedIn Ads', category: 'Marketing', amount: -200, type: 'Expense', description: 'Lead gen' },
  { date: '2025-04-11', vendor: 'Catering', category: 'Food & Beverage', amount: -220, type: 'Expense', description: 'Client event' },
  { date: '2025-04-14', vendor: 'Client D', category: 'Consulting', amount: 1400.00, type: 'Income', description: 'Strategy session' },
  { date: '2025-04-17', vendor: 'Public Transport', category: 'Transportation', amount: -58.4, type: 'Expense', description: 'Commute' },
  { date: '2025-04-22', vendor: 'Online Store', category: 'Product Sales', amount: 1750.00, type: 'Income', description: 'Product X' },
  { date: '2025-04-25', vendor: 'Staples', category: 'Office Supplies', amount: -75.5, type: 'Expense', description: 'Notebooks' },
  { date: '2025-05-01', vendor: 'Landlord', category: 'Rent', amount: -3000, type: 'Expense', description: 'Office rent' },
  { date: '2025-05-02', vendor: 'Payroll', category: 'Salaries', amount: -7000, type: 'Expense', description: 'Team salaries' },
  { date: '2025-05-05', vendor: 'Utility Co', category: 'Utilities', amount: -310.6, type: 'Expense', description: 'Monthly utilities' },
  { date: '2025-05-08', vendor: 'Google Ads', category: 'Marketing', amount: -350, type: 'Expense', description: 'Promotion' },
  { date: '2025-05-12', vendor: 'Coffee Shop', category: 'Food & Beverage', amount: -42.3, type: 'Expense', description: 'Client coffee' },
  { date: '2025-05-15', vendor: 'Client E', category: 'Consulting', amount: 1600.00, type: 'Income', description: 'Workshop' },
  { date: '2025-05-18', vendor: 'Rental Car', category: 'Transportation', amount: -120, type: 'Expense', description: 'Client meetings' },
  { date: '2025-05-22', vendor: 'In-Store', category: 'Product Sales', amount: 1950.00, type: 'Income', description: 'Product Y' },
  { date: '2025-05-25', vendor: 'Office Depot', category: 'Office Supplies', amount: -110, type: 'Expense', description: 'Chairs' },
  { date: '2025-06-01', vendor: 'Landlord', category: 'Rent', amount: -3000, type: 'Expense', description: 'Office rent' },
  { date: '2025-06-02', vendor: 'Payroll', category: 'Salaries', amount: -7000, type: 'Expense', description: 'Team salaries' },
  { date: '2025-06-05', vendor: 'Utility Co', category: 'Utilities', amount: -302.4, type: 'Expense', description: 'Monthly utilities' },
  { date: '2025-06-10', vendor: 'Hotel', category: 'Travel', amount: -800, type: 'Expense', description: 'Industry summit' },
  { date: '2025-06-12', vendor: 'Influencer', category: 'Marketing', amount: -500, type: 'Expense', description: 'Collab' },
  { date: '2025-06-15', vendor: 'Restaurant', category: 'Food & Beverage', amount: -87.5, type: 'Expense', description: 'Team dinner' },
  { date: '2025-06-18', vendor: 'Client F', category: 'Consulting', amount: 2100.00, type: 'Income', description: 'System upgrade' },
  { date: '2025-06-22', vendor: 'Uber', category: 'Transportation', amount: -45.6, type: 'Expense', description: 'Client pickup' },
  { date: '2025-06-25', vendor: 'Distributor', category: 'Product Sales', amount: 2250.00, type: 'Income', description: 'Product Z' },
  { date: '2025-07-01', vendor: 'Landlord', category: 'Rent', amount: -3000, type: 'Expense', description: 'Office rent' },
  { date: '2025-07-02', vendor: 'Payroll', category: 'Salaries', amount: -7000, type: 'Expense', description: 'Team salaries' },
  { date: '2025-07-05', vendor: 'Utility Co', category: 'Utilities', amount: -320.75, type: 'Expense', description: 'Monthly utilities' },
  { date: '2025-07-08', vendor: 'Staples', category: 'Office Supplies', amount: -135, type: 'Expense', description: 'Printer paper' },
  { date: '2025-07-10', vendor: 'Coffee Shop', category: 'Food & Beverage', amount: -25, type: 'Expense', description: 'Client meeting' },
  { date: '2025-07-12', vendor: 'Client G', category: 'Consulting', amount: 500.00, type: 'Income', description: 'Quick consult' },
  { date: '2025-07-14', vendor: 'Facebook Ads', category: 'Marketing', amount: -75, type: 'Expense', description: 'Ad campaign' },
];

// Helper functions for data analysis
export const getMonthlyData = (transactions: Transaction[], type: 'Income' | 'Expense' | 'Both' = 'Both') => {
  const monthlyTotals: { [key: string]: number } = {};
  
  transactions.forEach(transaction => {
    if (type !== 'Both' && transaction.type !== type) return;
    
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyTotals[monthKey]) {
      monthlyTotals[monthKey] = 0;
    }
    
    if (type === 'Income' && transaction.amount > 0) {
      monthlyTotals[monthKey] += transaction.amount;
    } else if (type === 'Expense' && transaction.amount < 0) {
      monthlyTotals[monthKey] += Math.abs(transaction.amount);
    } else if (type === 'Both') {
      monthlyTotals[monthKey] += Math.abs(transaction.amount);
    }
  });
  
  return Object.entries(monthlyTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      amount: Math.round(amount)
    }));
};

export const getCategoryData = (transactions: Transaction[], type: 'Income' | 'Expense' = 'Expense') => {
  const categoryTotals: { [key: string]: { amount: number; count: number } } = {};
  
  transactions.forEach(transaction => {
    if (transaction.type !== type) return;
    
    const category = transaction.category;
    if (!categoryTotals[category]) {
      categoryTotals[category] = { amount: 0, count: 0 };
    }
    
    categoryTotals[category].amount += Math.abs(transaction.amount);
    categoryTotals[category].count += 1;
  });
  
  return Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b.amount - a.amount)
    .map(([category, data]) => ({
      name: category,
      amount: Math.round(data.amount),
      transactions: data.count,
      icon: getCategoryIcon(category)
    }));
};

export const getCategoryIcon = (category: string): string => {
  const iconMap: { [key: string]: string } = {
    'Rent': 'home-outline',
    'Salaries': 'people-outline',
    'Utilities': 'flash-outline',
    'Office Supplies': 'cube-outline',
    'Marketing': 'megaphone-outline',
    'Food & Beverage': 'restaurant-outline',
    'Transportation': 'car-outline',
    'Travel': 'airplane-outline',
    'Consulting': 'briefcase-outline',
    'Product Sales': 'storefront-outline',
  };
  
  return iconMap[category] || 'document-outline';
};

export const getCurrentMonthTotal = (transactions: Transaction[], type: 'Income' | 'Expense') => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  return transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() + 1 === currentMonth &&
             transactionDate.getFullYear() === currentYear &&
             transaction.type === type;
    })
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
};

export const getPreviousMonthTotal = (transactions: Transaction[], type: 'Income' | 'Expense') => {
  const currentDate = new Date();
  const previousMonth = currentDate.getMonth() === 0 ? 12 : currentDate.getMonth();
  const previousMonthYear = currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
  
  return transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() + 1 === previousMonth &&
             transactionDate.getFullYear() === previousMonthYear &&
             transaction.type === type;
    })
    .reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
};
