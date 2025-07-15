import { BorderRadius, Colors, Spacing, Typography } from '@/constants/Styles';
import { Transaction } from '@/data/transactions';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface AIRecommendation {
  id: string;
  type: 'savings' | 'profit' | 'optimization' | 'alert';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  potentialSavings?: number;
  actionRequired: boolean;
}

interface TransactionInsights {
  monthlySpending: number;
  topSpendingCategories: Array<{ category: string; amount: number; percentage: number }>;
  unusualTransactions: Transaction[];
  savingsOpportunities: number;
  profitMargin: number;
  cashFlowTrend: 'positive' | 'negative' | 'stable';
}

interface TransactionAIProps {
  transactions: Transaction[];
  onRecommendationPress?: (recommendation: AIRecommendation) => void;
}

const TransactionAI: React.FC<TransactionAIProps> = ({ transactions, onRecommendationPress }) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [insights, setInsights] = useState<TransactionInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<'recommendations' | 'insights' | null>('recommendations');

  useEffect(() => {
    generateAIRecommendations();
  }, [transactions]);

  const generateAIRecommendations = async () => {
    setLoading(true);
    try {
      // Simulate AI analysis with realistic business logic
      const insights = analyzeTransactions(transactions);
      const recs = generateRecommendations(insights, transactions);
      
      setInsights(insights);
      setRecommendations(recs);
      setError(null);
    } catch (err) {
      setError('Failed to generate AI recommendations');
      console.error('AI Analysis Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeTransactions = (transactions: Transaction[]): TransactionInsights => {
    const expenses = transactions.filter(t => t.type === 'Expense');
    const income = transactions.filter(t => t.type === 'Income');
    
    const monthlySpending = Math.abs(expenses.reduce((sum, t) => sum + t.amount, 0));
    const monthlyIncome = income.reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate category spending
    const categorySpending = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);
    
    const topSpendingCategories = Object.entries(categorySpending)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / monthlySpending) * 100
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    
    // Find unusual transactions (outliers)
    const avgExpense = monthlySpending / expenses.length;
    const unusualTransactions = expenses.filter(t => Math.abs(t.amount) > avgExpense * 2.5);
    
    const profitMargin = monthlyIncome > 0 ? ((monthlyIncome - monthlySpending) / monthlyIncome) * 100 : 0;
    const savingsOpportunities = calculateSavingsOpportunities(categorySpending);
    
    return {
      monthlySpending,
      topSpendingCategories,
      unusualTransactions,
      savingsOpportunities,
      profitMargin,
      cashFlowTrend: monthlyIncome > monthlySpending ? 'positive' : monthlyIncome < monthlySpending ? 'negative' : 'stable'
    };
  };

  const calculateSavingsOpportunities = (categorySpending: Record<string, number>): number => {
    // Identify categories with high savings potential
    const optimizableCategories = ['Food & Beverage', 'Office Supplies', 'Marketing', 'Transportation'];
    return optimizableCategories.reduce((total, category) => {
      const spending = categorySpending[category] || 0;
      return total + (spending * 0.15); // Assume 15% savings potential
    }, 0);
  };

  const generateRecommendations = (insights: TransactionInsights, transactions: Transaction[]): AIRecommendation[] => {
    const recs: AIRecommendation[] = [];

    // Savings recommendations
    insights.topSpendingCategories.forEach((cat, index) => {
      if (cat.percentage > 15 && cat.category !== 'Rent' && cat.category !== 'Salaries') {
        recs.push({
          id: `savings-${index}`,
          type: 'savings',
          title: `Optimize ${cat.category} Spending`,
          description: `You're spending $${cat.amount.toFixed(2)} (${cat.percentage.toFixed(1)}%) on ${cat.category}. Consider reviewing vendors or negotiating better rates.`,
          impact: cat.percentage > 25 ? 'high' : cat.percentage > 15 ? 'medium' : 'low',
          category: cat.category,
          potentialSavings: cat.amount * 0.15,
          actionRequired: true
        });
      }
    });

    // Profit improvement recommendations
    if (insights.profitMargin < 20) {
      recs.push({
        id: 'profit-margin',
        type: 'profit',
        title: 'Improve Profit Margins',
        description: `Your current profit margin is ${insights.profitMargin.toFixed(1)}%. Consider increasing prices or reducing operational costs.`,
        impact: 'high',
        category: 'Revenue',
        potentialSavings: insights.monthlySpending * 0.1,
        actionRequired: true
      });
    }

    // Cash flow optimization
    if (insights.cashFlowTrend === 'negative') {
      recs.push({
        id: 'cashflow',
        type: 'alert',
        title: 'Negative Cash Flow Alert',
        description: 'Your expenses exceed income this period. Review discretionary spending and consider increasing revenue streams.',
        impact: 'high',
        category: 'Cash Flow',
        actionRequired: true
      });
    }

    // Subscription and recurring cost optimization
    const recurringExpenses = transactions.filter(t => 
      t.type === 'Expense' && 
      (t.description.toLowerCase().includes('subscription') || 
       t.vendor.toLowerCase().includes('monthly') ||
       ['Utilities', 'Rent'].includes(t.category))
    );
    
    if (recurringExpenses.length > 0) {
      const totalRecurring = recurringExpenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      recs.push({
        id: 'recurring-costs',
        type: 'optimization',
        title: 'Review Recurring Expenses',
        description: `You have $${totalRecurring.toFixed(2)} in recurring expenses. Audit subscriptions and negotiate better rates for utilities.`,
        impact: 'medium',
        category: 'Recurring Costs',
        potentialSavings: totalRecurring * 0.1,
        actionRequired: false
      });
    }

    // Unusual transaction alerts
    if (insights.unusualTransactions.length > 0) {
      recs.push({
        id: 'unusual-transactions',
        type: 'alert',
        title: 'Unusual Spending Detected',
        description: `${insights.unusualTransactions.length} transactions are significantly higher than average. Review for accuracy.`,
        impact: 'medium',
        category: 'Anomaly Detection',
        actionRequired: true
      });
    }

    return recs.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    });
  };

  const getRecommendationIcon = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'savings': return 'wallet-outline';
      case 'profit': return 'trending-up-outline';
      case 'optimization': return 'settings-outline';
      case 'alert': return 'warning-outline';
      default: return 'information-circle-outline';
    }
  };

  const getImpactColor = (impact: AIRecommendation['impact']) => {
    switch (impact) {
      case 'high': return Colors.error;
      case 'medium': return Colors.warning;
      case 'low': return Colors.success;
      default: return Colors.textSecondary;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Analyzing transactions with AI...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={48} color={Colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={generateAIRecommendations}>
          <Text style={styles.retryButtonText}>Retry Analysis</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* AI Insights Summary */}
      {insights && (
        <TouchableOpacity 
          style={styles.insightsSummary}
          onPress={() => setExpandedSection(expandedSection === 'insights' ? null : 'insights')}
        >
          <View style={styles.summaryHeader}>
            <Icon name="analytics-outline" size={24} color={Colors.primary} />
            <Text style={styles.summaryTitle}>AI Insights</Text>
            <Icon 
              name={expandedSection === 'insights' ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={Colors.textSecondary} 
            />
          </View>
          {expandedSection === 'insights' && (
            <View style={styles.insightsContent}>
              <View style={styles.insightRow}>
                <Text style={styles.insightLabel}>Monthly Spending:</Text>
                <Text style={styles.insightValue}>${insights.monthlySpending.toFixed(2)}</Text>
              </View>
              <View style={styles.insightRow}>
                <Text style={styles.insightLabel}>Profit Margin:</Text>
                <Text style={[styles.insightValue, { color: insights.profitMargin > 20 ? Colors.success : Colors.warning }]}>
                  {insights.profitMargin.toFixed(1)}%
                </Text>
              </View>
              <View style={styles.insightRow}>
                <Text style={styles.insightLabel}>Savings Potential:</Text>
                <Text style={styles.insightValue}>${insights.savingsOpportunities.toFixed(2)}</Text>
              </View>
              <View style={styles.insightRow}>
                <Text style={styles.insightLabel}>Cash Flow:</Text>
                <Text style={[styles.insightValue, { 
                  color: insights.cashFlowTrend === 'positive' ? Colors.success : 
                         insights.cashFlowTrend === 'negative' ? Colors.error : Colors.warning 
                }]}>
                  {insights.cashFlowTrend.charAt(0).toUpperCase() + insights.cashFlowTrend.slice(1)}
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* AI Recommendations */}
      <TouchableOpacity 
        style={styles.recommendationsHeader}
        onPress={() => setExpandedSection(expandedSection === 'recommendations' ? null : 'recommendations')}
      >
        <View style={styles.headerContent}>
          <Icon name="bulb-outline" size={24} color={Colors.primary} />
          <Text style={styles.sectionTitle}>AI Recommendations ({recommendations.length})</Text>
          <Icon 
            name={expandedSection === 'recommendations' ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={Colors.textSecondary} 
          />
        </View>
      </TouchableOpacity>

      {expandedSection === 'recommendations' && (
        <ScrollView style={styles.recommendationsList} showsVerticalScrollIndicator={false}>
          {recommendations.map((rec) => (
            <TouchableOpacity
              key={rec.id}
              style={styles.recommendationCard}
              onPress={() => onRecommendationPress?.(rec)}
            >
              <View style={styles.recommendationHeader}>
                <View style={styles.recommendationIconContainer}>
                  <Icon 
                    name={getRecommendationIcon(rec.type)} 
                    size={20} 
                    color={getImpactColor(rec.impact)} 
                  />
                </View>
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>{rec.title}</Text>
                  <Text style={styles.recommendationCategory}>{rec.category}</Text>
                </View>
                <View style={styles.impactBadge}>
                  <Text style={[styles.impactText, { color: getImpactColor(rec.impact) }]}>
                    {rec.impact.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.recommendationDescription}>{rec.description}</Text>
              {rec.potentialSavings && (
                <View style={styles.savingsContainer}>
                  <Icon name="cash-outline" size={16} color={Colors.success} />
                  <Text style={styles.savingsText}>
                    Potential savings: ${rec.potentialSavings.toFixed(2)}
                  </Text>
                </View>
              )}
              {rec.actionRequired && (
                <View style={styles.actionRequiredContainer}>
                  <Icon name="alert-circle-outline" size={16} color={Colors.warning} />
                  <Text style={styles.actionRequiredText}>Action Required</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  loadingContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  errorContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  errorText: {
    marginTop: Spacing.md,
    fontSize: Typography.base,
    color: Colors.error,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    color: 'white',
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  insightsSummary: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryTitle: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  insightsContent: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  insightLabel: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  insightValue: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  recommendationsHeader: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  recommendationsList: {
    maxHeight: 400,
  },
  recommendationCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  recommendationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  recommendationCategory: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  impactBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background,
  },
  impactText: {
    fontSize: Typography.xs,
    fontWeight: Typography.semibold,
  },
  recommendationDescription: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: Typography.lineHeightNormal * Typography.base,
    marginBottom: Spacing.md,
  },
  savingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  savingsText: {
    marginLeft: Spacing.sm,
    fontSize: Typography.sm,
    color: Colors.success,
    fontWeight: Typography.medium,
  },
  actionRequiredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionRequiredText: {
    marginLeft: Spacing.sm,
    fontSize: Typography.sm,
    color: Colors.warning,
    fontWeight: Typography.medium,
  },
});

export default TransactionAI;
