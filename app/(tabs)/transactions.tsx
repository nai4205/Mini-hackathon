import { BorderRadius, Colors, GlobalStyles, Spacing, Typography } from '@/constants/Styles';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  icon: string;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Staples',
    category: 'Office Supplies',
    amount: -120.00,
    type: 'expense',
    date: '2025-07-15',
    icon: 'document-text-outline',
  },
  {
    id: '2',
    title: 'Coffee Shop',
    category: 'Client Meeting',
    amount: -25.00,
    type: 'expense',
    date: '2025-07-15',
    icon: 'cafe-outline',
  },
  {
    id: '3',
    title: 'Client A',
    category: 'Invoice Payment',
    amount: 500.00,
    type: 'income',
    date: '2025-07-14',
    icon: 'card-outline',
  },
  {
    id: '4',
    title: 'Social Media Ads',
    category: 'Marketing',
    amount: -75.00,
    type: 'expense',
    date: '2025-07-14',
    icon: 'megaphone-outline',
  },
  {
    id: '5',
    title: 'Printer Ink',
    category: 'Office Supplies',
    amount: -45.00,
    type: 'expense',
    date: '2025-07-13',
    icon: 'print-outline',
  },
];

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'income' | 'expenses'>('all');

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'income') {
      return matchesSearch && transaction.type === 'income';
    } else if (selectedFilter === 'expenses') {
      return matchesSearch && transaction.type === 'expense';
    }
    return matchesSearch;
  });

  const renderTransactionItem = (transaction: Transaction) => (
    <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
      <View style={styles.transactionIconContainer}>
        <Icon name={transaction.icon} size={24} color={Colors.textSecondary} />
      </View>
      <View style={styles.transactionContent}>
        <Text style={styles.transactionTitle}>{transaction.title}</Text>
        <Text style={styles.transactionCategory}>{transaction.category}</Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        transaction.type === 'income' ? styles.incomeAmount : styles.expenseAmount
      ]}>
        {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={GlobalStyles.containerPadded}>
      {/* Header */}
      <View style={GlobalStyles.header}>
        <Text style={GlobalStyles.title}>Transactions</Text>
        <TouchableOpacity>
          <Icon name="add" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

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