import { BorderRadius, Colors, Spacing, Typography } from '@/constants/Styles';
import { Transaction } from '@/data/transactions';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SpendingPattern {
  category: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  weeklyAverage: number;
  monthlyTotal: number;
  previousMonthTotal: number;
  changePercentage: number;
  recommendation: string;
}

interface SpendingInsightsProps {
  transactions: Transaction[];
}

const SpendingInsights: React.FC<SpendingInsightsProps> = ({ transactions }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRecommendation = (category: string, trend: string, change: number, amount: number): string => {
    if (trend === 'increasing' && change > 20) {
      switch (category) {
        case 'Food & Beverage':
          return 'Consider meal planning or team lunch budgets to control costs';
        case 'Office Supplies':
          return 'Review bulk purchasing options or negotiate vendor discounts';
        case 'Marketing':
          return 'Analyze ROI of current campaigns and optimize ad spend';
        case 'Transportation':
          return 'Explore carpooling or public transport options for cost savings';
        case 'Utilities':
          return 'Implement energy-saving measures or review utility providers';
        default:
          return `Monitor ${category} expenses closely as spending has increased significantly`;
      }
    } else if (trend === 'decreasing' && change < -15) {
      return `Great! ${category} costs are down ${Math.abs(change).toFixed(1)}% - maintain current practices`;
    } else if (amount > 1000) {
      switch (category) {
        case 'Rent':
          return 'Consider renegotiating lease terms or exploring co-working spaces';
        case 'Salaries':
          return 'Review productivity metrics and consider performance-based compensation';
        default:
          return `${category} is a major expense - review for optimization opportunities`;
      }
    }
    return `${category} spending is stable - continue monitoring`;
  };

  const insights = useMemo(() => {
    // Analyze spending patterns by category
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const expenses = transactions.filter(t => t.type === 'Expense');
    
    // Current month expenses by category
    const currentMonthExpenses = expenses.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    // Previous month expenses by category
    const previousMonthExpenses = expenses.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === previousMonth && date.getFullYear() === previousYear;
    });

    // Group by category
    const currentByCategory = currentMonthExpenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

    const previousByCategory = previousMonthExpenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

    // Calculate patterns
    const patterns: SpendingPattern[] = Object.keys({ ...currentByCategory, ...previousByCategory })
      .map(category => {
        const current = currentByCategory[category] || 0;
        const previous = previousByCategory[category] || 0;
        const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
        
        // Calculate weekly average for current month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const weeklyAverage = current / (daysInMonth / 7);

        let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
        if (Math.abs(change) > 10) {
          trend = change > 0 ? 'increasing' : 'decreasing';
        }

        const recommendation = getRecommendation(category, trend, change, current);

        return {
          category,
          trend,
          weeklyAverage,
          monthlyTotal: current,
          previousMonthTotal: previous,
          changePercentage: change,
          recommendation
        };
      })
      .filter(p => p.monthlyTotal > 0)
      .sort((a, b) => b.monthlyTotal - a.monthlyTotal);

    return patterns;
  }, [transactions]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'trending-up';
      case 'decreasing': return 'trending-down';
      default: return 'remove';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return Colors.error;
      case 'decreasing': return Colors.success;
      default: return Colors.warning;
    }
  };

  if (insights.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.headerContent}>
          <Icon name="analytics" size={24} color={Colors.primary} />
          <Text style={styles.title}>Spending Insights</Text>
          <Icon 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={Colors.textSecondary} 
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView style={styles.insightsContainer} showsVerticalScrollIndicator={false}>
          {insights.slice(0, 6).map((pattern) => (
            <View key={pattern.category} style={styles.patternCard}>
              <View style={styles.patternHeader}>
                <Text style={styles.categoryName}>{pattern.category}</Text>
                <View style={styles.trendContainer}>
                  <Icon 
                    name={getTrendIcon(pattern.trend)} 
                    size={16} 
                    color={getTrendColor(pattern.trend)} 
                  />
                  <Text style={[styles.changeText, { color: getTrendColor(pattern.trend) }]}>
                    {pattern.changePercentage > 0 ? '+' : ''}{pattern.changePercentage.toFixed(1)}%
                  </Text>
                </View>
              </View>

              <View style={styles.amountContainer}>
                <Text style={styles.amountLabel}>This Month</Text>
                <Text style={styles.amountValue}>${pattern.monthlyTotal.toFixed(2)}</Text>
              </View>

              <View style={styles.weeklyContainer}>
                <Text style={styles.weeklyLabel}>Weekly Average</Text>
                <Text style={styles.weeklyValue}>${pattern.weeklyAverage.toFixed(2)}</Text>
              </View>

              <View style={styles.recommendationContainer}>
                <Icon name="bulb-outline" size={14} color={Colors.primary} />
                <Text style={styles.recommendationText}>{pattern.recommendation}</Text>
              </View>
            </View>
          ))}

          {/* Summary section */}
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Key Takeaways</Text>
            
            {insights.filter(p => p.trend === 'increasing' && p.changePercentage > 20).length > 0 && (
              <View style={styles.takeawayItem}>
                <Icon name="alert-circle" size={16} color={Colors.error} />
                <Text style={styles.takeawayText}>
                  {insights.filter(p => p.trend === 'increasing' && p.changePercentage > 20).length} categories 
                  show significant cost increases - immediate attention needed
                </Text>
              </View>
            )}

            {insights.filter(p => p.trend === 'decreasing').length > 0 && (
              <View style={styles.takeawayItem}>
                <Icon name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={styles.takeawayText}>
                  {insights.filter(p => p.trend === 'decreasing').length} categories 
                  show cost reductions - keep up the good work!
                </Text>
              </View>
            )}

            <View style={styles.takeawayItem}>
              <Icon name="information-circle" size={16} color={Colors.primary} />
              <Text style={styles.takeawayText}>
                Total monthly expenses: ${insights.reduce((sum, p) => sum + p.monthlyTotal, 0).toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    padding: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  insightsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    maxHeight: 500,
  },
  patternCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoryName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    marginLeft: Spacing.xs,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  amountLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  amountValue: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  weeklyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  weeklyLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  weeklyValue: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  recommendationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  recommendationText: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Typography.sm,
    color: Colors.primary,
    lineHeight: Typography.lineHeightNormal * Typography.sm,
  },
  summaryContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  summaryTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  takeawayItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  takeawayText: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeightNormal * Typography.sm,
  },
});

export default SpendingInsights;
