import { Colors } from '@/constants/Colors';
import { calculateMonthlyExpenses, defaultBudgets, loadBudgets as loadBudgetsData, saveBudgets as saveBudgetsData } from '@/data/budgets';
import { transactionsData } from '@/data/transactions';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import components directly
import AIBudgetSuggestions from '../../components/tracker/AIBudgetSuggestions';
import BudgetManager from '../../components/tracker/BudgetManager';
import BudgetOverview from '../../components/tracker/BudgetOverview';

export default function BudgetScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [refreshing, setRefreshing] = useState(false);
  const [budgets, setBudgets] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const loadedBudgets = await loadBudgetsData();
      setBudgets(loadedBudgets);
    } catch (error) {
      console.error('Error loading budgets:', error);
      setBudgets(defaultBudgets);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBudgets = async (newBudgets: Record<string, number>) => {
    try {
      const success = await saveBudgetsData(newBudgets);
      if (success) {
        setBudgets(newBudgets);
        Alert.alert('Success', 'Budget saved successfully!');
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Error saving budgets:', error);
      Alert.alert('Error', 'Failed to save budget. Please try again.');
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadBudgets().finally(() => setRefreshing(false));
  }, []);

  const getCurrentMonthExpenses = () => {
    return calculateMonthlyExpenses(transactionsData);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading Budget...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentExpenses = getCurrentMonthExpenses();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Budget Manager</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            AI-powered budget planning and tracking
          </Text>
        </View>

        <BudgetOverview 
          budgets={budgets}
          currentExpenses={currentExpenses}
        />

        <AIBudgetSuggestions 
          transactions={transactionsData}
          currentBudgets={budgets}
          onApplySuggestions={saveBudgets}
        />

        <BudgetManager
          budgets={budgets}
          currentExpenses={currentExpenses}
          onSave={saveBudgets}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
});
