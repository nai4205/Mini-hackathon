import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Transaction {
  date: string;
  vendor: string;
  category: string;
  amount: number;
  type: 'Income' | 'Expense';
  description: string;
}

interface AIBudgetSuggestionsProps {
  transactions: Transaction[];
  currentBudgets: Record<string, number>;
  onApplySuggestions: (budgets: Record<string, number>) => void;
}

interface BudgetSuggestion {
  category: string;
  currentBudget: number;
  suggestedBudget: number;
  reasoning: string;
  avgSpending: number;
}

export default function AIBudgetSuggestions({ 
  transactions, 
  currentBudgets, 
  onApplySuggestions 
}: AIBudgetSuggestionsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [suggestions, setSuggestions] = useState<BudgetSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const generateBudgetSuggestions = async () => {
    setIsLoading(true);
    try {
      // Calculate historical spending averages by category
      const expenseTransactions = transactions.filter(t => t.type === 'Expense');
      const categorySpending = expenseTransactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || []).concat(Math.abs(t.amount));
        return acc;
      }, {} as Record<string, number[]>);

      // Calculate monthly averages for each category
      const categoryAverages = Object.entries(categorySpending).reduce((acc, [category, amounts]) => {
        const monthlyTotals: Record<string, number> = {};
        
        // Group by month
        expenseTransactions
          .filter(t => t.category === category)
          .forEach(t => {
            const month = t.date.substring(0, 7); // YYYY-MM
            monthlyTotals[month] = (monthlyTotals[month] || 0) + Math.abs(t.amount);
          });

        const monthlyAmounts = Object.values(monthlyTotals);
        const average = monthlyAmounts.length > 0 
          ? monthlyAmounts.reduce((sum, amount) => sum + amount, 0) / monthlyAmounts.length
          : 0;
        
        acc[category] = average;
        return acc;
      }, {} as Record<string, number>);

      // Send to AI for analysis
      const response = await fetch('http://localhost:3000/api/generate-budget-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions: expenseTransactions,
          currentBudgets,
          categoryAverages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate budget suggestions');
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setIsExpanded(true);
    } catch (error) {
      console.error('Error generating budget suggestions:', error);
      Alert.alert('Error', 'Failed to generate AI suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyAllSuggestions = () => {
    Alert.alert(
      'Apply AI Suggestions',
      'Are you sure you want to apply all AI budget suggestions?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: () => {
            const newBudgets = { ...currentBudgets };
            suggestions.forEach(suggestion => {
              newBudgets[suggestion.category] = suggestion.suggestedBudget;
            });
            onApplySuggestions(newBudgets);
            setIsExpanded(false);
            setSuggestions([]);
          },
        },
      ]
    );
  };

  const applySingleSuggestion = (suggestion: BudgetSuggestion) => {
    const newBudgets = { ...currentBudgets };
    newBudgets[suggestion.category] = suggestion.suggestedBudget;
    onApplySuggestions(newBudgets);
    
    // Remove applied suggestion
    setSuggestions(prev => prev.filter(s => s.category !== suggestion.category));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>AI Budget Suggestions</Text>
        <TouchableOpacity
          style={[styles.generateButton, { backgroundColor: colors.tint }]}
          onPress={generateBudgetSuggestions}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.generateButtonText}>Get AI Suggestions</Text>
          )}
        </TouchableOpacity>
      </View>

      {isExpanded && suggestions.length > 0 && (
        <View style={[styles.suggestionsContainer, { backgroundColor: colors.background }]}>
          <View style={styles.suggestionsHeader}>
            <Text style={[styles.suggestionsTitle, { color: colors.text }]}>
              AI Recommendations ({suggestions.length})
            </Text>
            <TouchableOpacity
              style={[styles.applyAllButton, { backgroundColor: colors.tint }]}
              onPress={applyAllSuggestions}
            >
              <Text style={styles.applyAllButtonText}>Apply All</Text>
            </TouchableOpacity>
          </View>

          {suggestions.map((suggestion, index) => (
            <View 
              key={suggestion.category} 
              style={[styles.suggestionCard, { backgroundColor: colors.background, borderColor: colors.text + '20' }]}
            >
              <View style={styles.suggestionHeader}>
                <Text style={[styles.categoryName, { color: colors.text }]}>
                  {suggestion.category}
                </Text>
                <TouchableOpacity
                  style={[styles.applyButton, { backgroundColor: colors.tint + '20' }]}
                  onPress={() => applySingleSuggestion(suggestion)}
                >
                  <Text style={[styles.applyButtonText, { color: colors.tint }]}>Apply</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.amountRow}>
                <View style={styles.amountColumn}>
                  <Text style={[styles.amountLabel, { color: colors.text }]}>Current</Text>
                  <Text style={[styles.currentAmount, { color: colors.text }]}>
                    ${suggestion.currentBudget.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.amountColumn}>
                  <Text style={[styles.amountLabel, { color: colors.text }]}>Suggested</Text>
                  <Text style={[styles.suggestedAmount, { color: colors.tint }]}>
                    ${suggestion.suggestedBudget.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.amountColumn}>
                  <Text style={[styles.amountLabel, { color: colors.text }]}>Avg Spending</Text>
                  <Text style={[styles.avgAmount, { color: colors.text }]}>
                    ${suggestion.avgSpending.toLocaleString()}
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.reasoning, { color: colors.text + 'CC' }]}>
                {suggestion.reasoning}
              </Text>
            </View>
          ))}
        </View>
      )}

      {isExpanded && suggestions.length === 0 && !isLoading && (
        <View style={styles.noSuggestionsContainer}>
          <Text style={[styles.noSuggestionsText, { color: colors.text }]}>
            Your current budgets look optimal! 🎯
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  generateButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  generateButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  suggestionsContainer: {
    borderRadius: 12,
    padding: 15,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  applyAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  applyAllButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  suggestionCard: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  applyButtonText: {
    fontWeight: '600',
    fontSize: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  amountColumn: {
    alignItems: 'center',
    flex: 1,
  },
  amountLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  currentAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  suggestedAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  avgAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  reasoning: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  noSuggestionsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noSuggestionsText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
