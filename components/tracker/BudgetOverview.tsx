import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface BudgetOverviewProps {
  budgets: Record<string, number>;
  currentExpenses: Record<string, number>;
}

export default function BudgetOverview({ budgets, currentExpenses }: BudgetOverviewProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const totalBudget = Object.values(budgets).reduce((sum, amount) => sum + amount, 0);
  const totalSpent = Object.values(currentExpenses).reduce((sum, amount) => sum + amount, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const getStatusColor = () => {
    if (spentPercentage >= 90) return '#FF4444';
    if (spentPercentage >= 75) return '#FF8800';
    return '#4CAF50';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>This Month's Overview</Text>
      
      <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.text + '20' }]}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={[styles.label, { color: colors.text }]}>Total Budget</Text>
            <Text style={[styles.amount, { color: colors.text }]}>
              ${totalBudget.toLocaleString()}
            </Text>
          </View>
          <View style={styles.column}>
            <Text style={[styles.label, { color: colors.text }]}>Spent</Text>
            <Text style={[styles.amount, { color: getStatusColor() }]}>
              ${totalSpent.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.text + '20' }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: getStatusColor(),
                  width: `${Math.min(spentPercentage, 100)}%`
                }
              ]} 
            />
          </View>
          <Text style={[styles.percentage, { color: colors.text }]}>
            {spentPercentage.toFixed(1)}% used
          </Text>
        </View>

        <View style={styles.remainingContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Remaining</Text>
          <Text style={[
            styles.remainingAmount, 
            { color: remaining >= 0 ? '#4CAF50' : '#FF4444' }
          ]}>
            ${remaining.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 5,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 14,
    textAlign: 'center',
  },
  remainingContainer: {
    alignItems: 'center',
  },
  remainingAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
