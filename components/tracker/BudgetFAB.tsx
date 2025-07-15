import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface BudgetFABProps {
  onAddCategory: () => void;
  onGetAIInsights: () => void;
  onEditBudgets: () => void;
}

export default function BudgetFAB({ onAddCategory, onGetAIInsights, onEditBudgets }: BudgetFABProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
    setIsOpen(!isOpen);
  };

  const aiInsightsScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const addCategoryScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const editBudgetsScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const handleActionPress = (action: () => void) => {
    action();
    toggleMenu();
  };

  return (
    <View style={styles.container}>
      {/* AI Insights Button */}
      <Animated.View style={[
        styles.actionButton,
        { transform: [{ scale: aiInsightsScale }, { translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -140],
        }) }] }
      ]}>
        <TouchableOpacity
          style={[styles.actionButtonTouchable, { backgroundColor: '#4CAF50' }]}
          onPress={() => handleActionPress(onGetAIInsights)}
        >
          <Text style={styles.actionIcon}>🤖</Text>
        </TouchableOpacity>
        <Text style={[styles.actionLabel, { color: colors.text }]}>AI Insights</Text>
      </Animated.View>

      {/* Add Category Button */}
      <Animated.View style={[
        styles.actionButton,
        { transform: [{ scale: addCategoryScale }, { translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -90],
        }) }] }
      ]}>
        <TouchableOpacity
          style={[styles.actionButtonTouchable, { backgroundColor: '#2196F3' }]}
          onPress={() => handleActionPress(onAddCategory)}
        >
          <Text style={styles.actionIcon}>➕</Text>
        </TouchableOpacity>
        <Text style={[styles.actionLabel, { color: colors.text }]}>Add Category</Text>
      </Animated.View>

      {/* Edit Budgets Button */}
      <Animated.View style={[
        styles.actionButton,
        { transform: [{ scale: editBudgetsScale }, { translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -40],
        }) }] }
      ]}>
        <TouchableOpacity
          style={[styles.actionButtonTouchable, { backgroundColor: '#FF9800' }]}
          onPress={() => handleActionPress(onEditBudgets)}
        >
          <Text style={styles.actionIcon}>✏️</Text>
        </TouchableOpacity>
        <Text style={[styles.actionLabel, { color: colors.text }]}>Edit Budgets</Text>
      </Animated.View>

      {/* Main FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.tint }]}
        onPress={toggleMenu}
      >
        <Animated.Text style={[styles.fabIcon, { transform: [{ rotate: rotation }] }]}>
          ✚
        </Animated.Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    alignItems: 'center',
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  actionButton: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
  },
  actionButtonTouchable: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
