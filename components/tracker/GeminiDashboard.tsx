import { GlobalStyles, Spacing } from '@/constants/Styles';
import { transactionsData } from '@/data/transactions';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const GeminiDashboard = () => {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <View style={styles.header}>
        <Icon name="sparkles-outline" size={24} color={'red'} />
        <Text style={styles.title}>AI Insights</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color={'red'} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <Text style={styles.text}>{insight}</Text>
      )}
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
  },
  text: {
    ...GlobalStyles.bodyText,
  },
  errorText: {
    ...GlobalStyles.bodyText,
    color: 'red',
  },
});

export default GeminiDashboard;