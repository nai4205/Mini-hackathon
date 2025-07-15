import { BorderRadius, Colors, Spacing, Typography } from '@/constants/Styles';
import { transactionsData } from '@/data/transactions';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface AnalyticsInsightData {
  summary: string;
  analysis: {
    trends: string;
    topCategories: string;
    patterns: string;
  };
  recommendations: string[];
  predictions: {
    nextMonth: string;
    advice: string;
  };
  alerts: string[];
}

interface AnalyticsAIProps {
  selectedTab: 'income' | 'expenses';
}

const AnalyticsAI: React.FC<AnalyticsAIProps> = ({ selectedTab }) => {
  const [insight, setInsight] = useState<AnalyticsInsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchAnalyticsInsight = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/generate-analytics-insights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            transactions: transactionsData,
            selectedTab: selectedTab
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch AI analytics insights');
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

    fetchAnalyticsInsight();
  }, [selectedTab]);

  const renderInsightSection = (title: string, content: string, icon: string) => (
    <View style={styles.insightSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );

  const renderRecommendations = () => (
    <View style={styles.insightSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>💡</Text>
        <Text style={styles.sectionTitle}>AI Recommendations</Text>
      </View>
      {insight?.recommendations.map((rec, index) => (
        <View key={index} style={styles.recommendationItem}>
          <View style={styles.bulletPoint} />
          <Text style={styles.recommendationText}>{rec}</Text>
        </View>
      ))}
    </View>
  );

  const renderAlerts = () => {
    if (!insight?.alerts || insight.alerts.length === 0) return null;
    
    return (
      <View style={styles.alertSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>⚠️</Text>
          <Text style={styles.sectionTitle}>Attention Points</Text>
        </View>
        {insight.alerts.map((alert, index) => (
          <View key={index} style={styles.alertItem}>
            <Text style={styles.alertText}>{alert}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Icon name="sparkles" size={20} color={Colors.primary} />
          <Text style={styles.title}>AI Analytics</Text>
        </View>
        <Icon 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={18} 
          color={Colors.textSecondary} 
        />
      </TouchableOpacity>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Analyzing {selectedTab}...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="warning-outline" size={20} color={Colors.error || 'red'} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : insight ? (
        <View>
          {/* AI Summary */}
          <Text style={styles.summaryText}>{insight.summary}</Text>
          
          {/* Expanded Content */}
          {isExpanded && (
            <ScrollView style={styles.expandedContent} showsVerticalScrollIndicator={false}>
              {/* Trend Analysis */}
              {renderInsightSection('Trend Analysis', insight.analysis.trends, '📈')}
              
              {/* Category Insights */}
              {renderInsightSection('Top Categories', insight.analysis.topCategories, '📊')}
              
              {/* Pattern Analysis */}
              {renderInsightSection('Pattern Analysis', insight.analysis.patterns, '🔍')}
              
              {/* Predictions */}
              <View style={styles.predictionsContainer}>
                {renderInsightSection('Next Month Forecast', insight.predictions.nextMonth, '🔮')}
                {renderInsightSection('Strategic Advice', insight.predictions.advice, '🎯')}
              </View>
              
              {/* Recommendations */}
              {renderRecommendations()}
              
              {/* Alerts */}
              {renderAlerts()}
            </ScrollView>
          )}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.primary + '20', // 20% opacity
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
  },
  summaryText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
  },
  loadingText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  errorText: {
    fontSize: Typography.base,
    color: Colors.error || 'red',
    marginLeft: Spacing.sm,
    flex: 1,
  },
  expandedContent: {
    marginTop: Spacing.lg,
    maxHeight: 400, // Limit height to prevent page overflow
  },
  insightSection: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  sectionContent: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginLeft: Spacing.xl,
  },
  predictionsContainer: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xl,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 6,
    marginRight: Spacing.sm,
  },
  recommendationText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    flex: 1,
  },
  alertSection: {
    backgroundColor: Colors.error ? Colors.error + '10' : '#ff000010',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  alertItem: {
    marginLeft: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  alertText: {
    fontSize: Typography.sm,
    color: Colors.error || 'red',
    fontWeight: Typography.medium,
    lineHeight: 18,
  },
});

export default AnalyticsAI;
