import { BorderRadius, Colors, Spacing, Typography } from '@/constants/Styles';
import { Transaction } from '@/data/transactions';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SmartCategorizationProps {
  onAddTransaction: (transaction: Omit<Transaction, 'date'>) => void;
}

const SmartCategorization: React.FC<SmartCategorizationProps> = ({ onAddTransaction }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [vendor, setVendor] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
  const [suggestedType, setSuggestedType] = useState<'Income' | 'Expense' | null>(null);

  const categorizeTransaction = (vendor: string, description: string, amount: number) => {
    const vendorLower = vendor.toLowerCase();
    const descLower = description.toLowerCase();
    
    // AI-like categorization logic
    if (vendorLower.includes('landlord') || descLower.includes('rent')) {
      return { category: 'Rent', type: 'Expense' as const };
    }
    if (vendorLower.includes('payroll') || descLower.includes('salary')) {
      return { category: 'Salaries', type: 'Expense' as const };
    }
    if (vendorLower.includes('utility') || descLower.includes('electric') || descLower.includes('water')) {
      return { category: 'Utilities', type: 'Expense' as const };
    }
    if (vendorLower.includes('restaurant') || vendorLower.includes('coffee') || descLower.includes('food') || descLower.includes('lunch')) {
      return { category: 'Food & Beverage', type: 'Expense' as const };
    }
    if (vendorLower.includes('uber') || vendorLower.includes('taxi') || vendorLower.includes('gas') || descLower.includes('transport')) {
      return { category: 'Transportation', type: 'Expense' as const };
    }
    if (vendorLower.includes('staples') || vendorLower.includes('office') || descLower.includes('supplies')) {
      return { category: 'Office Supplies', type: 'Expense' as const };
    }
    if (vendorLower.includes('ads') || vendorLower.includes('marketing') || descLower.includes('campaign')) {
      return { category: 'Marketing', type: 'Expense' as const };
    }
    if (vendorLower.includes('client') || descLower.includes('consulting') || descLower.includes('project')) {
      return { category: 'Consulting', type: 'Income' as const };
    }
    if (vendorLower.includes('store') || vendorLower.includes('sales') || descLower.includes('product')) {
      return { category: 'Product Sales', type: 'Income' as const };
    }
    if (vendorLower.includes('airline') || descLower.includes('travel') || descLower.includes('conference')) {
      return { category: 'Travel', type: 'Expense' as const };
    }
    
    // Default based on amount (positive = income, negative = expense)
    if (amount > 0) {
      return { category: 'Other Income', type: 'Income' as const };
    } else {
      return { category: 'Other Expense', type: 'Expense' as const };
    }
  };

  const handleInputChange = () => {
    if (vendor.trim() && description.trim() && amount.trim()) {
      const amountNum = parseFloat(amount);
      if (!isNaN(amountNum)) {
        const suggestion = categorizeTransaction(vendor, description, amountNum);
        setSuggestedCategory(suggestion.category);
        setSuggestedType(suggestion.type);
      }
    } else {
      setSuggestedCategory(null);
      setSuggestedType(null);
    }
  };

  const handleAddTransaction = () => {
    if (!vendor.trim() || !description.trim() || !amount.trim() || !suggestedCategory || !suggestedType) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const transaction: Omit<Transaction, 'date'> = {
      vendor: vendor.trim(),
      category: suggestedCategory,
      amount: suggestedType === 'Expense' ? -Math.abs(amountNum) : Math.abs(amountNum),
      type: suggestedType,
      description: description.trim(),
    };

    onAddTransaction(transaction);
    
    // Reset form
    setVendor('');
    setDescription('');
    setAmount('');
    setSuggestedCategory(null);
    setSuggestedType(null);
    setIsExpanded(false);
    
    Alert.alert('Success', 'Transaction added successfully!');
  };

  React.useEffect(() => {
    handleInputChange();
  }, [vendor, description, amount]);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.headerContent}>
          <Icon name="add-circle-outline" size={24} color={Colors.primary} />
          <Text style={styles.title}>Smart Add Transaction</Text>
          <Icon 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color={Colors.textSecondary} 
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Vendor</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Starbucks, Client ABC"
              placeholderTextColor={Colors.textSecondary}
              value={vendor}
              onChangeText={setVendor}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Team meeting, Project payment"
              placeholderTextColor={Colors.textSecondary}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 25.50"
              placeholderTextColor={Colors.textSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          {suggestedCategory && suggestedType && (
            <View style={styles.suggestionContainer}>
              <View style={styles.suggestionHeader}>
                <Icon name="sparkles" size={16} color={Colors.primary} />
                <Text style={styles.suggestionTitle}>AI Suggestion</Text>
              </View>
              <View style={styles.suggestionContent}>
                <View style={styles.suggestionTag}>
                  <Text style={styles.suggestionTagText}>{suggestedType}</Text>
                </View>
                <Icon name="arrow-forward" size={16} color={Colors.textSecondary} />
                <View style={[styles.suggestionTag, { backgroundColor: Colors.primaryLight }]}>
                  <Text style={[styles.suggestionTagText, { color: Colors.primary }]}>
                    {suggestedCategory}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity 
            style={[
              styles.addButton, 
              (!suggestedCategory || !suggestedType) && styles.disabledButton
            ]}
            onPress={handleAddTransaction}
            disabled={!suggestedCategory || !suggestedType}
          >
            <Icon name="checkmark" size={20} color="white" />
            <Text style={styles.addButtonText}>Add Transaction</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    padding: Spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  formContainer: {
    padding: Spacing.lg,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionContainer: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  suggestionTitle: {
    marginLeft: Spacing.sm,
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.primary,
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suggestionTag: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
  },
  suggestionTagText: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textPrimary,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.textSecondary,
  },
  addButtonText: {
    marginLeft: Spacing.sm,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: 'white',
  },
});

export default SmartCategorization;
