import { BorderRadius, Colors, GlobalStyles, Spacing, Typography } from '@/constants/Styles';
import { calculatePercentageChange, getCategoryData, getCurrentMonthTotal, getPreviousMonthTotal, transactionsData } from '@/data/transactions';
import React, { useMemo } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

const Categories = () => {
  const categoryData = useMemo(() => {
    const expenseCategories = getCategoryData(transactionsData, 'Expense');
    const totalExpenses = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);
    
    const colors = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16'];
    
    return expenseCategories.map((category, index) => ({
      name: category.name,
      amount: category.amount,
      percentage: totalExpenses > 0 ? (category.amount / totalExpenses) * 100 : 0,
      color: colors[index % colors.length]
    }));
  }, []);

  const totalSpending = useMemo(() => {
    return getCurrentMonthTotal(transactionsData, 'Expense');
  }, []);

  const previousMonthSpending = useMemo(() => {
    return getPreviousMonthTotal(transactionsData, 'Expense');
  }, []);

  const percentageChange = useMemo(() => {
    return calculatePercentageChange(totalSpending, previousMonthSpending);
  }, [totalSpending, previousMonthSpending]);

  const renderCategoryBar = (category: CategoryData, index: number) => (
    <TouchableOpacity key={index} style={styles.categoryItem}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.categoryAmount}>${category.amount}</Text>
      </View>
      <View style={styles.barContainer}>
        <View 
          style={[
            styles.barFill, 
            { 
              width: `${category.percentage}%`,
              backgroundColor: category.color,
            }
          ]} 
        />
        <View style={styles.barIndicator} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={GlobalStyles.containerPadded}>
      {/* Header */}
      

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Spending Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Spending by category</Text>
          
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Spending</Text>
            <Text style={styles.summaryAmount}>${totalSpending.toLocaleString()}</Text>
            <Text style={styles.summaryChange}>
              This month <Text style={percentageChange >= 0 ? styles.positiveChange : GlobalStyles.errorText}>
                {percentageChange > 0 ? '+' : ''}{percentageChange}%
              </Text>
            </Text>
          </View>
        </View>

        {/* Category Charts */}
        <View style={styles.categoriesSection}>
          {categoryData.map(renderCategoryBar)}
        </View>
      </ScrollView>
    </View>
  );
};

export default Categories;

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
  summarySection: {
    marginBottom: Spacing['3xl'],
  },
  sectionTitle: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing['2xl'],
  },
  summaryCard: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing['2xl'],
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
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
  categoriesSection: {
    gap: Spacing['2xl'],
  },
  categoryItem: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.xl,
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
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  categoryName: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  categoryAmount: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  barContainer: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
    position: 'relative',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: BorderRadius.sm,
  },
  barIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: Colors.textSecondary,
  },
});
