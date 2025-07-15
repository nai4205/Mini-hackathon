import QuickInsights from '@/components/tracker/QuickInsights';
import SmartCategorization from '@/components/tracker/SmartCategorization';
import SpendingInsights from '@/components/tracker/SpendingInsights';
import TransactionAI from '@/components/tracker/TransactionAI';
import { BorderRadius, Colors, GlobalStyles, Spacing, Typography } from '@/constants/Styles';
import { getCategoryIcon, Transaction, transactionsData } from '@/data/transactions';
import React, { useMemo, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface TransactionItem {
  date: string;
  vendor: string;
  category: string;
  amount: number;
  type: 'Income' | 'Expense';
  description: string;
}

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'vendor-asc' | 'category-asc';

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'income' | 'expenses'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showAIRecommendations, setShowAIRecommendations] = useState(true);
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>(transactionsData);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const filteredTransactions = useMemo(() => {
    let filtered = localTransactions.filter((transaction) => {
      const matchesSearch = transaction.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by month
      let matchesMonth = true;
      if (selectedMonth !== 'all') {
        const transactionDate = new Date(transaction.date);
        const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
        matchesMonth = transactionMonth === selectedMonth;
      }
      
      if (selectedFilter === 'income') {
        return matchesSearch && matchesMonth && transaction.type === 'Income';
      } else if (selectedFilter === 'expenses') {
        return matchesSearch && matchesMonth && transaction.type === 'Expense';
      }
      return matchesSearch && matchesMonth;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return Math.abs(b.amount) - Math.abs(a.amount);
        case 'amount-asc':
          return Math.abs(a.amount) - Math.abs(b.amount);
        case 'vendor-asc':
          return a.vendor.localeCompare(b.vendor);
        case 'category-asc':
          return a.category.localeCompare(b.category);
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return filtered;
  }, [localTransactions, searchQuery, selectedFilter, sortBy, selectedMonth]);

  // Get available months from transactions
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    localTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthKey);
    });
    return Array.from(months).sort().reverse(); // Most recent first
  }, [localTransactions]);

  const getMonthLabel = (monthKey: string): string => {
    if (monthKey === 'all') return 'All Months';
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Calculate insights for QuickInsights component
  const quickInsightsData = useMemo(() => {
    let currentMonthTransactions, previousMonthTransactions;
    
    if (selectedMonth === 'all') {
      // Use current month for "all" view
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      currentMonthTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
      });

      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      
      previousMonthTransactions = localTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === previousMonth && transactionDate.getFullYear() === previousYear;
      });
    } else {
      // Use selected month
      const [year, month] = selectedMonth.split('-');
      const selectedYear = parseInt(year);
      const selectedMonthNum = parseInt(month) - 1;
      
      currentMonthTransactions = filteredTransactions;
      
      // Previous month for comparison
      const prevMonthNum = selectedMonthNum === 0 ? 11 : selectedMonthNum - 1;
      const prevYear = selectedMonthNum === 0 ? selectedYear - 1 : selectedYear;
      const prevMonthKey = `${prevYear}-${String(prevMonthNum + 1).padStart(2, '0')}`;
      
      previousMonthTransactions = localTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
        return transactionMonth === prevMonthKey;
      });
    }

    const getCurrentTotal = (transactions: any[]) => {
      if (selectedFilter === 'income') {
        return transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
      } else if (selectedFilter === 'expenses') {
        return Math.abs(transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0));
      } else {
        const income = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = Math.abs(transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0));
        return income - expenses;
      }
    };

    const currentTotal = getCurrentTotal(currentMonthTransactions);
    const previousTotal = getCurrentTotal(previousMonthTransactions);
    const percentageChange = previousTotal !== 0 ? ((currentTotal - previousTotal) / Math.abs(previousTotal)) * 100 : 0;

    return {
      currentMonthTotal: currentTotal,
      percentageChange
    };
  }, [filteredTransactions, selectedFilter, localTransactions, selectedMonth]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'date'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      date: new Date().toISOString().split('T')[0], // Today's date
    };
    setLocalTransactions(prev => [transaction, ...prev]);
  };

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case 'date-desc': return 'Newest First';
      case 'date-asc': return 'Oldest First';
      case 'amount-desc': return 'Highest Amount';
      case 'amount-asc': return 'Lowest Amount';
      case 'vendor-asc': return 'Vendor A-Z';
      case 'category-asc': return 'Category A-Z';
      default: return 'Newest First';
    }
  };

  const sortOptions: SortOption[] = ['date-desc', 'date-asc', 'amount-desc', 'amount-asc', 'vendor-asc', 'category-asc'];

  const renderTransactionItem = (transaction: TransactionItem, index: number) => {
    // Check if this is the first transaction of a new date
    const currentDate = new Date(transaction.date).toDateString();
    const previousDate = index > 0 ? new Date(filteredTransactions[index - 1].date).toDateString() : null;
    const isNewDate = currentDate !== previousDate;

    return (
      <View key={index}>
        {isNewDate && (
          <Text style={styles.dateHeader}>
            {new Date(transaction.date).toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric',
              year: selectedMonth === 'all' ? 'numeric' : undefined
            })}
          </Text>
        )}
        <TouchableOpacity style={styles.transactionItem}>
          <View style={styles.transactionIconContainer}>
            <Icon name={getCategoryIcon(transaction.category)} size={24} color={Colors.textSecondary} />
          </View>
          <View style={styles.transactionContent}>
            <Text style={styles.transactionTitle}>{transaction.vendor}</Text>
            <Text style={styles.transactionCategory}>{transaction.category}</Text>
          </View>
          <Text style={[
            styles.transactionAmount,
            transaction.type === 'Income' ? styles.incomeAmount : styles.expenseAmount
          ]}>
            {transaction.type === 'Income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleRecommendationPress = (recommendation: any) => {
    Alert.alert(
      recommendation.title,
      `${recommendation.description}\n\n${recommendation.potentialSavings ? `Potential Savings: $${recommendation.potentialSavings.toFixed(2)}` : ''}`,
      [
        { text: 'Dismiss', style: 'cancel' },
        { text: 'Take Action', onPress: () => console.log('Taking action on:', recommendation) }
      ]
    );
  };

  return (
    <View style={GlobalStyles.containerPadded}>
      {/* Header */}
      <View style={GlobalStyles.header}>
        <View>
          <Text style={GlobalStyles.title}>Transactions</Text>
          {showAIRecommendations && (
            <Text style={styles.aiIndicator}>AI Features Active</Text>
          )}
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.sortButton, showAIRecommendations && styles.aiActiveButton]}
            onPress={() => setShowAIRecommendations(!showAIRecommendations)}
          >
            <Icon 
              name="bulb-outline" 
              size={20} 
              color={showAIRecommendations ? Colors.primary : Colors.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => setShowMonthPicker(!showMonthPicker)}
          >
            <Icon name="calendar-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => setShowSortMenu(!showSortMenu)}
          >
            <Icon name="funnel-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sort Menu */}
      {showSortMenu && (
        <View style={styles.sortMenu}>
          <Text style={styles.sortMenuTitle}>Sort by</Text>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.sortOption, sortBy === option && styles.activeSortOption]}
              onPress={() => {
                setSortBy(option);
                setShowSortMenu(false);
              }}
            >
              <Text style={[styles.sortOptionText, sortBy === option && styles.activeSortOptionText]}>
                {getSortLabel(option)}
              </Text>
              {sortBy === option && (
                <Icon name="checkmark" size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Month Picker Menu */}
      {showMonthPicker && (
        <View style={styles.sortMenu}>
          <Text style={styles.sortMenuTitle}>Filter by Month</Text>
          <TouchableOpacity
            style={[styles.sortOption, selectedMonth === 'all' && styles.activeSortOption]}
            onPress={() => {
              setSelectedMonth('all');
              setShowMonthPicker(false);
            }}
          >
            <Text style={[styles.sortOptionText, selectedMonth === 'all' && styles.activeSortOptionText]}>
              All Months
            </Text>
            {selectedMonth === 'all' && (
              <Icon name="checkmark" size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>
          {availableMonths.map((month) => (
            <TouchableOpacity
              key={month}
              style={[styles.sortOption, selectedMonth === month && styles.activeSortOption]}
              onPress={() => {
                setSelectedMonth(month);
                setShowMonthPicker(false);
              }}
            >
              <Text style={[styles.sortOptionText, selectedMonth === month && styles.activeSortOptionText]}>
                {getMonthLabel(month)}
              </Text>
              {selectedMonth === month && (
                <Icon name="checkmark" size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Selected Month Indicator */}
      {selectedMonth !== 'all' && (
        <View style={styles.monthIndicator}>
          <Icon name="calendar-outline" size={16} color={Colors.primary} />
          <Text style={styles.monthIndicatorText}>
            Showing: {getMonthLabel(selectedMonth)}
          </Text>
          <TouchableOpacity 
            onPress={() => setSelectedMonth('all')}
            style={styles.clearMonthButton}
          >
            <Icon name="close-outline" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Smart Add Transaction */}
      <SmartCategorization onAddTransaction={handleAddTransaction} />

      {/* Quick AI Insights */}
      <QuickInsights 
        selectedTab={selectedFilter === 'all' ? 'expenses' : selectedFilter}
        currentMonthTotal={quickInsightsData.currentMonthTotal}
        percentageChange={quickInsightsData.percentageChange}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions"
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* AI Recommendations */}
      {showAIRecommendations && (
        <TransactionAI 
          transactions={filteredTransactions} 
          onRecommendationPress={handleRecommendationPress}
        />
      )}

      {/* Advanced Spending Insights */}
      {showAIRecommendations && (
        <SpendingInsights transactions={localTransactions} />
      )}

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'all' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'income' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('income')}
        >
          <Text style={[styles.filterText, selectedFilter === 'income' && styles.activeFilterText]}>
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'expenses' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('expenses')}
        >
          <Text style={[styles.filterText, selectedFilter === 'expenses' && styles.activeFilterText]}>
            Expenses
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <View style={styles.transactionsHeader}>
        <Text style={styles.transactionCount}>
          {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          {selectedMonth !== 'all' && ` in ${getMonthLabel(selectedMonth)}`}
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.transactionsList}>
        {filteredTransactions.map((transaction, index) => renderTransactionItem(transaction, index))}
      </ScrollView>
    </View>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  aiIndicator: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: Typography.medium,
    marginTop: Spacing.xs,
  },
  sortButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  aiActiveButton: {
    backgroundColor: Colors.primaryLight,
  },
  sortMenu: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sortMenuTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
  },
  activeSortOption: {
    backgroundColor: Colors.primaryLight,
  },
  sortOptionText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  activeSortOptionText: {
    color: Colors.primary,
    fontWeight: Typography.semibold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
  },
  filterTab: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginRight: Spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterTab: {
    borderBottomColor: Colors.primary,
  },
  filterText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  activeFilterText: {
    color: Colors.primary,
    fontWeight: Typography.semibold,
  },
  transactionsList: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  transactionCategory: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  transactionAmount: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
  incomeAmount: {
    color: Colors.success,
  },
  expenseAmount: {
    color: Colors.textPrimary,
  },
  monthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  monthIndicatorText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
  clearMonthButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  transactionsHeader: {
    marginBottom: Spacing.md,
  },
  transactionCount: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  dateHeader: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    marginLeft: Spacing.sm,
  },
});