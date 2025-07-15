import { BorderRadius, Colors, Spacing, Typography } from '@/constants/Styles';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ChartAIProps {
  monthlyData: Array<{ month: string; amount: number }>;
  selectedTab: 'income' | 'expenses';
}

const ChartAI: React.FC<ChartAIProps> = ({ monthlyData, selectedTab }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateChartInsights = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/generate-chart-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          monthlyData,
          type: selectedTab
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chart insights');
      }

      const data = await response.json();
      setInsight(data.insight);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!monthlyData || monthlyData.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button}
        onPress={generateChartInsights}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Icon name="analytics" size={16} color={Colors.primary} />
        )}
        <Text style={styles.buttonText}>
          {loading ? 'Analyzing Trends...' : 'AI Trend Analysis'}
        </Text>
        <Icon name="sparkles" size={14} color={Colors.primary} />
      </TouchableOpacity>
      
      {insight && (
        <View style={styles.insightContainer}>
          <Text style={styles.insightText}>{insight}</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>AI analysis temporarily unavailable</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  buttonText: {
    fontSize: Typography.sm,
    color: Colors.primary,
    fontWeight: Typography.medium,
  },
  insightContainer: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  insightText: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  errorContainer: {
    marginTop: Spacing.md,
    backgroundColor: Colors.error ? Colors.error + '10' : '#ff000010',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  errorText: {
    fontSize: Typography.sm,
    color: Colors.error || 'red',
    textAlign: 'center',
  },
});

export default ChartAI;
