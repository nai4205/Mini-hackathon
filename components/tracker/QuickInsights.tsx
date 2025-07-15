import { BorderRadius, Colors, Spacing, Typography } from '@/constants/Styles';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface QuickInsightsProps {
  selectedTab: 'income' | 'expenses';
  currentMonthTotal: number;
  percentageChange: number;
}

const QuickInsights: React.FC<QuickInsightsProps> = ({ 
  selectedTab, 
  currentMonthTotal, 
  percentageChange 
}) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateQuickInsight = async () => {
    if (loading || insight) return; // Don't regenerate if already has insight
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/generate-quick-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: selectedTab,
          currentTotal: currentMonthTotal,
          percentageChange
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInsight(data.insight);
      }
    } catch (error) {
      console.error('Quick insights error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInsight(null); // Reset insight when tab changes
    generateQuickInsight();
  }, [selectedTab]);

  if (!insight && !loading) {
    return (
      <TouchableOpacity style={styles.generateButton} onPress={generateQuickInsight}>
        <Icon name="bulb-outline" size={16} color={Colors.primary} />
        <Text style={styles.generateText}>Get AI Quick Insight</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Generating insight...</Text>
        </View>
      ) : insight ? (
        <View style={styles.insightContainer}>
          <View style={styles.insightHeader}>
            <Icon name="bulb" size={16} color={Colors.primary} />
            <Text style={styles.insightTitle}>AI Quick Insight</Text>
          </View>
          <Text style={styles.insightText}>{insight}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderStyle: 'dashed',
    gap: Spacing.xs,
  },
  generateText: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  loadingText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  insightContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  insightTitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  insightText: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
});

export default QuickInsights;
