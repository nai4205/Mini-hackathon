import AnalyticsAI from '@/components/tracker/AnalyticsAI';
import ChartAI from '@/components/tracker/ChartAI';
import QuickInsights from '@/components/tracker/QuickInsights';
import { BorderRadius, Colors, GlobalStyles, Spacing, Typography } from '@/constants/Styles';
import {
    calculatePercentageChange,
    getCategoryData,
    getCurrentMonthTotal,
    getMonthlyData,
    getPreviousMonthTotal,
    transactionsData
} from '@/data/transactions';
import React, { useMemo, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface TopCategory {
  name: string;
  icon: string;
  transactions: number;
  amount: number;
};
const Analytics = () => {
  const [selectedTab, setSelectedTab] = useState<'income' | 'expenses'>('expenses');
  
  // Calculate data based on real transactions
  const monthlyData = useMemo(() => {
    return getMonthlyData(transactionsData, selectedTab === 'income' ? 'Income' : 'Expense');
  }, [selectedTab]);

  const topCategories = useMemo(() => {
    return getCategoryData(transactionsData, selectedTab === 'income' ? 'Income' : 'Expense').slice(0, 5);
  }, [selectedTab]);

  const currentMonthTotal = useMemo(() => {
    return getCurrentMonthTotal(transactionsData, selectedTab === 'income' ? 'Income' : 'Expense');
  }, [selectedTab]);

  const previousMonthTotal = useMemo(() => {
    return getPreviousMonthTotal(transactionsData, selectedTab === 'income' ? 'Income' : 'Expense');
  }, [selectedTab]);

  const percentageChange = useMemo(() => {
    return calculatePercentageChange(currentMonthTotal, previousMonthTotal);
  }, [currentMonthTotal, previousMonthTotal]);

  const maxAmount = Math.max(...monthlyData.map(item => item.amount));

  const renderBarChart = () => (
    <View style={styles.chartContainer}>
      <View style={styles.barsContainer}>
        {monthlyData.map((item, index) => {
          const barHeight = (item.amount / maxAmount) * 120; // Max height of 120
          return (
            <View key={index} style={styles.barColumn}>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { height: barHeight },
                    index === monthlyData.length - 1 && styles.currentBar
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

  const handleCategoryPress = async (category: TopCategory) => {
    // Filter transactions by the selected category
    const categoryTransactions = transactionsData.filter(transaction => 
      transaction.category === category.name && 
      transaction.type === (selectedTab === 'income' ? 'Income' : 'Expense')
    );

    const totalAmount = categoryTransactions.reduce((sum, transaction) => 
      sum + Math.abs(transaction.amount), 0
    );

    // Get AI insights for this specific category
    try {
      const response = await fetch('http://localhost:3000/api/generate-category-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          transactions: categoryTransactions,
          category: category.name,
          type: selectedTab === 'income' ? 'Income' : 'Expense'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Show enhanced category details with AI insights
        Alert.alert(
          `${category.name} AI Analysis`,
          `${data.insight || `Total ${selectedTab === 'income' ? 'Income' : 'Expenses'}: $${totalAmount.toLocaleString()}\nTransactions: ${category.transactions}\nAverage per transaction: $${(totalAmount / category.transactions).toFixed(2)}`}`,
          [
            {
              text: 'View Transactions',
              onPress: () => {
                Alert.alert('Navigation', `Would navigate to transactions filtered by "${category.name}"`);
              }
            },
            { text: 'Close', style: 'cancel' }
          ]
        );
      } else {
        throw new Error('AI analysis unavailable');
      }
    } catch (error) {
      // Fallback to basic category details
      Alert.alert(
        `${category.name} Details`,
        `Total ${selectedTab === 'income' ? 'Income' : 'Expenses'}: $${totalAmount.toLocaleString()}\n` +
        `Transactions: ${category.transactions}\n` +
        `Average per transaction: $${(totalAmount / category.transactions).toFixed(2)}\n\n` +
        `💡 Tip: AI analysis temporarily unavailable`,
        [
          {
            text: 'View Transactions',
            onPress: () => {
              Alert.alert('Navigation', `Would navigate to transactions filtered by "${category.name}"`);
            }
          },
          { text: 'Close', style: 'cancel' }
        ]
      );
    }
  };

  const renderTopCategory = (category: TopCategory, index: number) => (
    <TouchableOpacity 
      key={index} 
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(category)}
      activeOpacity={0.7}
    >
      <View style={styles.categoryLeft}>
        <View style={styles.categoryIconContainer}>
          <Icon name={category.icon} size={24} color={Colors.textSecondary} />
        </View>
        <View style={styles.categoryInfo}>
          <View style={styles.categoryNameRow}>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Icon name="sparkles" size={12} color={Colors.primary} style={styles.aiIndicator} />
          </View>
          <Text style={styles.categoryTransactions}>
            {category.transactions} transactions • Tap for AI insights
          </Text>
        </View>
      </View>
      <Text style={styles.categoryAmount}>${category.amount}</Text>
      <Icon name="chevron-forward" size={16} color={Colors.textSecondary} style={styles.categoryChevron} />
    </TouchableOpacity>
  );

  return (
    <View style={GlobalStyles.containerPadded}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={GlobalStyles.title}>Analytics</Text>
        <View style={styles.aiIndicatorHeader}>
          <Icon name="sparkles" size={16} color={Colors.primary} />
          <Text style={styles.aiIndicatorText}>AI Enhanced</Text>
        </View>
      </View>
     
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

        {/* Quick AI Insights */}
        <QuickInsights 
          selectedTab={selectedTab}
          currentMonthTotal={currentMonthTotal}
          percentageChange={percentageChange}
        />

        {/* Summary Section */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>
            {selectedTab === 'income' ? 'Income' : 'Expenses'}
          </Text>
          <Text style={styles.summaryAmount}>${currentMonthTotal.toLocaleString()}</Text>
          <Text style={styles.summaryChange}>
            This month <Text style={percentageChange >= 0 ? styles.positiveChange : GlobalStyles.errorText}>
              {percentageChange > 0 ? '+' : ''}{percentageChange}%
            </Text>
          </Text>
        </View>

        {/* AI Analytics Section */}
        <AnalyticsAI selectedTab={selectedTab} />

        {/* Bar Chart */}
        {renderBarChart()}
        
        {/* AI Chart Analysis */}
        <ChartAI monthlyData={monthlyData} selectedTab={selectedTab} />

        {/* Top Categories */}
        <View style={styles.topCategoriesSection}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          <View style={styles.categoriesList}>
            {topCategories.map(renderTopCategory)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Analytics;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  aiIndicatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  aiIndicatorText: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.medium,
    marginLeft: Spacing.xs,
  },
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
    borderWidth: 1,
    borderColor: 'transparent',
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
  categoryNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  aiIndicator: {
    marginLeft: Spacing.xs,
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
  categoryChevron: {
    marginLeft: Spacing.sm,
  },
});
