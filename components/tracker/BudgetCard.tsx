import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface BudgetCardProps {
  category: string;
  budget: number;
  spent: number;
  onPress?: () => void;
}

const { width } = Dimensions.get('window');

export default function BudgetCard({ category, budget, spent, onPress }: BudgetCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const remaining = budget - spent;
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;

  const getStatusColor = () => {
    if (percentage >= 100) return '#FF4444';
    if (percentage >= 90) return '#FF8800';
    if (percentage >= 75) return '#FFA500';
    return '#4CAF50';
  };

  const getStatusText = () => {
    if (percentage >= 100) return 'Over Budget';
    if (percentage >= 90) return 'Near Limit';
    if (percentage >= 75) return 'On Track';
    return 'Good';
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.background, borderColor: colors.text + '20' }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.categoryName, { color: colors.text }]} numberOfLines={1}>
          {category}
        </Text>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </View>

      <View style={styles.amounts}>
        <View style={styles.amountRow}>
          <Text style={[styles.label, { color: colors.text }]}>Budget</Text>
          <Text style={[styles.amount, { color: colors.text }]}>
            ${budget.toLocaleString()}
          </Text>
        </View>
        <View style={styles.amountRow}>
          <Text style={[styles.label, { color: colors.text }]}>Spent</Text>
          <Text style={[styles.amount, { color: getStatusColor() }]}>
            ${spent.toLocaleString()}
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
                width: `${Math.min(percentage, 100)}%`
              }
            ]} 
          />
        </View>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressText, { color: colors.text }]}>
            {percentage.toFixed(0)}% used
          </Text>
          <Text style={[
            styles.remainingText, 
            { color: remaining >= 0 ? '#4CAF50' : '#FF4444' }
          ]}>
            ${Math.abs(remaining).toLocaleString()} {remaining >= 0 ? 'left' : 'over'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: (width - 50) / 2, // Two cards per row with margin
  },
  header: {
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  amounts: {
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    opacity: 0.7,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 11,
  },
  remainingText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
