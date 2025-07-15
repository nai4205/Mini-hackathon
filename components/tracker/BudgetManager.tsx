import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface BudgetManagerProps {
  budgets: Record<string, number>;
  currentExpenses: Record<string, number>;
  onSave: (budgets: Record<string, number>) => void;
}

export default function BudgetManager({ budgets, currentExpenses, onSave }: BudgetManagerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [editingBudgets, setEditingBudgets] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  const handleEditBudget = (category: string, value: string) => {
    setEditingBudgets(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSaveBudgets = () => {
    try {
      const updatedBudgets = { ...budgets };
      
      // Update existing budgets
      Object.entries(editingBudgets).forEach(([category, value]) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0) {
          updatedBudgets[category] = numValue;
        }
      });

      onSave(updatedBudgets);
      setEditingBudgets({});
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save budgets. Please try again.');
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      Alert.alert('Error', 'Please enter a category name.');
      return;
    }

    const budgetValue = parseFloat(newBudget);
    if (isNaN(budgetValue) || budgetValue < 0) {
      Alert.alert('Error', 'Please enter a valid budget amount.');
      return;
    }

    if (budgets[newCategory]) {
      Alert.alert('Error', 'This category already exists.');
      return;
    }

    const updatedBudgets = {
      ...budgets,
      [newCategory]: budgetValue
    };

    onSave(updatedBudgets);
    setNewCategory('');
    setNewBudget('');
    setShowAddCategory(false);
  };

  const handleDeleteCategory = (category: string) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete the "${category}" budget category?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedBudgets = { ...budgets };
            delete updatedBudgets[category];
            onSave(updatedBudgets);
          },
        },
      ]
    );
  };

  const getBudgetStatus = (category: string) => {
    const budget = budgets[category] || 0;
    const spent = currentExpenses[category] || 0;
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    
    if (percentage >= 100) return { color: '#FF4444', status: 'Over Budget' };
    if (percentage >= 90) return { color: '#FF8800', status: 'Near Limit' };
    if (percentage >= 75) return { color: '#FFA500', status: 'On Track' };
    return { color: '#4CAF50', status: 'Good' };
  };

  const categories = Object.keys(budgets).sort();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Budget Categories</Text>
        <View style={styles.headerButtons}>
          {!isEditing ? (
            <>
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.tint + '20' }]}
                onPress={() => setShowAddCategory(true)}
              >
                <Text style={[styles.addButtonText, { color: colors.tint }]}>+ Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: colors.tint }]}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.text + '20' }]}
                onPress={() => {
                  setIsEditing(false);
                  setEditingBudgets({});
                }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.tint }]}
                onPress={handleSaveBudgets}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {showAddCategory && (
        <View style={[styles.addCategoryContainer, { backgroundColor: colors.background, borderColor: colors.text + '20' }]}>
          <Text style={[styles.addCategoryTitle, { color: colors.text }]}>Add New Category</Text>
          
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.text + '30' }]}
            placeholder="Category name"
            placeholderTextColor={colors.text + '70'}
            value={newCategory}
            onChangeText={setNewCategory}
          />
          
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.text + '30' }]}
            placeholder="Budget amount"
            placeholderTextColor={colors.text + '70'}
            value={newBudget}
            onChangeText={setNewBudget}
            keyboardType="numeric"
          />
          
          <View style={styles.addCategoryButtons}>
            <TouchableOpacity
              style={[styles.cancelAddButton, { backgroundColor: colors.text + '20' }]}
              onPress={() => {
                setShowAddCategory(false);
                setNewCategory('');
                setNewBudget('');
              }}
            >
              <Text style={[styles.cancelAddButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addConfirmButton, { backgroundColor: colors.tint }]}
              onPress={handleAddCategory}
            >
              <Text style={styles.addConfirmButtonText}>Add Category</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.categoriesList}>
        {categories.map((category) => {
          const budget = budgets[category];
          const spent = currentExpenses[category] || 0;
          const remaining = budget - spent;
          const percentage = budget > 0 ? (spent / budget) * 100 : 0;
          const status = getBudgetStatus(category);

          return (
            <View 
              key={category} 
              style={[styles.categoryCard, { backgroundColor: colors.background, borderColor: colors.text + '20' }]}
            >
              <View style={styles.categoryHeader}>
                <Text style={[styles.categoryName, { color: colors.text }]}>{category}</Text>
                {isEditing && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteCategory(category)}
                  >
                    <Text style={styles.deleteButtonText}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.budgetRow}>
                <View style={styles.budgetInfo}>
                  <Text style={[styles.budgetLabel, { color: colors.text }]}>Budget</Text>
                  {isEditing ? (
                    <TextInput
                      style={[styles.budgetInput, { color: colors.text, borderColor: colors.text + '30' }]}
                      value={editingBudgets[category] ?? budget.toString()}
                      onChangeText={(value) => handleEditBudget(category, value)}
                      keyboardType="numeric"
                    />
                  ) : (
                    <Text style={[styles.budgetAmount, { color: colors.text }]}>
                      ${budget.toLocaleString()}
                    </Text>
                  )}
                </View>

                <View style={styles.spentInfo}>
                  <Text style={[styles.spentLabel, { color: colors.text }]}>Spent</Text>
                  <Text style={[styles.spentAmount, { color: status.color }]}>
                    ${spent.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.remainingInfo}>
                  <Text style={[styles.remainingLabel, { color: colors.text }]}>Remaining</Text>
                  <Text style={[
                    styles.remainingAmount, 
                    { color: remaining >= 0 ? '#4CAF50' : '#FF4444' }
                  ]}>
                    ${remaining.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: colors.text + '20' }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        backgroundColor: status.color,
                        width: `${Math.min(percentage, 100)}%`
                      }
                    ]} 
                  />
                </View>
                <View style={styles.statusRow}>
                  <Text style={[styles.progressText, { color: colors.text }]}>
                    {percentage.toFixed(1)}% used
                  </Text>
                  <Text style={[styles.statusText, { color: status.color }]}>
                    {status.status}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  addCategoryContainer: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
  },
  addCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  addCategoryButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  cancelAddButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelAddButtonText: {
    fontWeight: '600',
  },
  addConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addConfirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  categoriesList: {
    flex: 1,
  },
  categoryCard: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 15,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  budgetInfo: {
    flex: 1,
    alignItems: 'center',
  },
  spentInfo: {
    flex: 1,
    alignItems: 'center',
  },
  remainingInfo: {
    flex: 1,
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 5,
  },
  spentLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 5,
  },
  remainingLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 5,
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  budgetInput: {
    fontSize: 16,
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'center',
    minWidth: 80,
  },
  spentAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  remainingAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 10,
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
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
