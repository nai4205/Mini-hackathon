import { Colors, GlobalStyles, Spacing } from '@/constants/Styles';
import { transactionsData } from '@/data/transactions';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface InsightData {
  brief: string;
  detailed: {
    overview: string;
    keyInsights: string[];
    recommendations: string[];
    monitoring: string[];
  };
}

const GeminiDashboard = () => {
  const [insight, setInsight] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/generate-insights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transactions: transactionsData }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch AI insights');
        }

        const data = await response.json();
        setInsight(data.insight);
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

    fetchInsight();
  }, []);

  return (
    <View style={[GlobalStyles.card, styles.container]}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <Icon name="sparkles-outline" size={24} color={Colors.primary} />
        <Text style={styles.title}>AI Insights</Text>
        <Icon 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={Colors.textSecondary} 
          style={styles.chevron}
        />
      </TouchableOpacity>
      
      {loading ? (
        <ActivityIndicator size="small" color={Colors.primary} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : insight ? (
        <View>
          {/* Brief Overview */}
          <Text style={styles.briefText}>{insight.brief}</Text>
          
          {/* Detailed Content (Expandable) */}
          {isExpanded && (
            <View style={styles.detailedContent}>
              {/* Overview */}
              {insight.detailed.overview && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>📊 Financial Health Overview</Text>
                  <Text style={styles.detailText}>{insight.detailed.overview}</Text>
                </View>
              )}
              
              {/* Key Insights */}
              {insight.detailed.keyInsights && insight.detailed.keyInsights.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🔍 Key Insights</Text>
                  {insight.detailed.keyInsights.map((item, index) => (
                    <Text key={index} style={styles.bulletPoint}>• {item}</Text>
                  ))}
                </View>
              )}
              
              {/* Recommendations */}
              {insight.detailed.recommendations && insight.detailed.recommendations.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>💡 Recommendations</Text>
                  {insight.detailed.recommendations.map((item, index) => (
                    <Text key={index} style={styles.bulletPoint}>• {item}</Text>
                  ))}
                </View>
              )}
              
              {/* Areas to Monitor */}
              {insight.detailed.monitoring && insight.detailed.monitoring.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>⚠️ Areas to Monitor</Text>
                  {insight.detailed.monitoring.map((item, index) => (
                    <Text key={index} style={styles.bulletPoint}>• {item}</Text>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...GlobalStyles.subtitle,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  chevron: {
    marginLeft: 'auto',
  },
  briefText: {
    ...GlobalStyles.bodyText,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  detailedContent: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  detailText: {
    ...GlobalStyles.bodyText,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bulletPoint: {
    ...GlobalStyles.bodyText,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  text: {
    ...GlobalStyles.bodyText,
  },
  errorText: {
    ...GlobalStyles.bodyText,
    color: Colors.error || 'red',
  },
});

export default GeminiDashboard;