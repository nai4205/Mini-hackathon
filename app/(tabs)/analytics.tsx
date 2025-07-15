import { BorderRadius, Colors, GlobalStyles, Spacing, Typography } from '@/constants/Styles';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface MonthlyData {
  month: string;
  amount: number;
}

interface TopCategory {
  id: string;
  name: string;
  icon: string;
  transactions: number;
  amount: number;
}

const mockMonthlyData: MonthlyData[] = [
  { month: 'Jan', amount: 800 },
  { month: 'Feb', amount: 600 },
  { month: 'Mar', amount: 950 },
  { month: 'Apr', amount: 1100 },
  { month: 'May', amount: 750 },
  { month: 'Jun', amount: 1234 },
];

const mockTopCategories: TopCategory[] = [
  {
    id: '1',
    name: 'Rent',
    icon: 'home-outline',
    transactions: 12,
    amount: 500,
  },
  {
    id: '2',
    name: 'Utilities',
    icon: 'flash-outline',
    transactions: 8,
    amount: 300,
  },
  {
    id: '3',
    name: 'Supplies',
    icon: 'cube-outline',
    transactions: 5,
    amount: 200,
  },
  {
    id: '4',
    name: 'Marketing',
    icon: 'megaphone-outline',
    transactions: 3,
    amount: 150,
  },
  {
    id: '5',
    name: 'Travel',
    icon: 'airplane-outline',
    transactions: 2,
    amount: 84,
  },
];

const Analytics = () => {
  const [selectedTab, setSelectedTab] = useState<'income' | 'expenses'>('expenses');
  
  const maxAmount = Math.max(...mockMonthlyData.map(item => item.amount));
  const currentAmount = 1234;

  const renderBarChart = () => (
    <View style={styles.chartContainer}>
      <View style={styles.barsContainer}>
        {mockMonthlyData.map((item, index) => {
          const barHeight = (item.amount / maxAmount) * 120; // Max height of 120
          return (
            <View key={index} style={styles.barColumn}>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { height: barHeight },
                    index === mockMonthlyData.length - 1 && styles.currentBar
                  ]} 
                />
              </View>
              <Text style={styles.monthLabel}>{item.month}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderTopCategory = (category: TopCategory) => (
    <TouchableOpacity key={category.id} style={styles.categoryItem}>
      <View style={styles.categoryLeft}>
        <View style={styles.categoryIconContainer}>
          <Icon name={category.icon} size={24} color={Colors.textSecondary} />
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryTransactions}>
            {category.transactions} transactions
          </Text>
        </View>
      </View>
      <Text style={styles.categoryAmount}>${category.amount}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={GlobalStyles.containerPadded}>
      {/* Header */}
     
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Toggle Buttons */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              styles.leftToggle,
              selectedTab === 'income' && styles.activeToggle
            ]}
            onPress={() => setSelectedTab('income')}
          >
            <Text style={[
              styles.toggleText,
              selectedTab === 'income' && styles.activeToggleText
            ]}>
              Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              styles.rightToggle,
              selectedTab === 'expenses' && styles.activeToggle
            ]}
            onPress={() => setSelectedTab('expenses')}
          >
            <Text style={[
              styles.toggleText,
              selectedTab === 'expenses' && styles.activeToggleText
            ]}>
              Expenses
            </Text>
          </TouchableOpacity>
        </View>

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>
            {selectedTab === 'income' ? 'Income' : 'Expenses'}
          </Text>
          <Text style={styles.summaryAmount}>${currentAmount.toLocaleString()}</Text>
          <Text style={styles.summaryChange}>
            This month <Text style={styles.positiveChange}>+12%</Text>
          </Text>
        </View>

        {/* Bar Chart */}
        {renderBarChart()}

        {/* Top Categories */}
        <View style={styles.topCategoriesSection}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          <View style={styles.categoriesList}>
            {mockTopCategories.map(renderTopCategory)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Analytics;

const styles = StyleSheet.create({
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 32, // Same width as back button for centering
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: 4,
    marginBottom: Spacing['3xl'],
  },
  toggleButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  leftToggle: {
    marginRight: 2,
  },
  rightToggle: {
    marginLeft: 2,
  },
  activeToggle: {
    backgroundColor: Colors.cardBackground,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  activeToggleText: {
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
  },
  summarySection: {
    marginBottom: Spacing['3xl'],
  },
  summaryLabel: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  summaryAmount: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  summaryChange: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  positiveChange: {
    color: Colors.success,
    fontWeight: Typography.semibold,
  },
  chartContainer: {
    marginBottom: Spacing['4xl'],
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: Spacing.md,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: Spacing.md,
  },
  bar: {
    width: 24,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
  },
  currentBar: {
    backgroundColor: Colors.primary,
  },
  monthLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  topCategoriesSection: {
    marginBottom: Spacing['4xl'],
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  categoriesList: {
    gap: Spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  categoryTransactions: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  categoryAmount: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
});
