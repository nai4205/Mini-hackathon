import { BorderRadius, Colors, GlobalStyles, Spacing, Typography } from '@/constants/Styles';
import { getCategoryIcon, transactionsData } from '@/data/transactions';
import React, { useMemo, useState } from 'react';
import {
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

  const filteredTransactions = useMemo(() => {
    let filtered = transactionsData.filter((transaction) => {
      const matchesSearch = transaction.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (selectedFilter === 'income') {
        return matchesSearch && transaction.type === 'Income';
      } else if (selectedFilter === 'expenses') {
        return matchesSearch && transaction.type === 'Expense';
      }
      return matchesSearch;
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
  }, [searchQuery, selectedFilter, sortBy]);

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

  const renderTransactionItem = (transaction: TransactionItem, index: number) => (
    <TouchableOpacity key={index} style={styles.transactionItem}>
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
  );

  return (
    <View style={GlobalStyles.containerPadded}>
      {/* Header */}
      <View style={GlobalStyles.header}>
        <Text style={GlobalStyles.title}>Transactions</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.sortButton}
            onPress={() => setShowSortMenu(!showSortMenu)}
          >
            <Icon name="funnel-outline" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="add" size={24} color={Colors.textSecondary} />
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
      <ScrollView showsVerticalScrollIndicator={false} style={styles.transactionsList}>
        {filteredTransactions.map(renderTransactionItem)}
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
  sortButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.sm,
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
});