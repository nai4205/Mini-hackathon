// Dashboard.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const revenueData = [0, 8, 5, 9, 4, 11, 3, 10, 2, 13, 6, 12];

const Dashboard = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Icon name="settings-outline" size={24} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Summary Boxes */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Text style={styles.label}>Total Expenditure</Text>
            <Text style={styles.value}>$12,500</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.label}>Net Profit</Text>
            <Text style={styles.value}>$8,750</Text>
          </View>
        </View>

        {/* Key Metrics */}
        <Text style={styles.sectionTitle}>Key Metrics</Text>

        {/* Revenue Trend */}
        <View style={styles.card}>
          <Text style={styles.label}>Revenue Trend</Text>
          <Text style={styles.cardValue}>$20,000</Text>
          <Text style={styles.cardSubValue}>Last 6 Months <Text style={styles.positive}>+15%</Text></Text>
          {/* <LineChart
            style={styles.chart}
            data={revenueData}
            svg={{ stroke: '#3b82f6', strokeWidth: 2 }}
            contentInset={{ top: 10, bottom: 10 }}
          /> */}
          <View style={styles.monthLabels}>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => (
              <Text key={month} style={styles.monthLabel}>{month}</Text>
            ))}
          </View>
        </View>

        {/* Expense Breakdown */}
        <View style={styles.card}>
          <Text style={styles.label}>Expense Breakdown</Text>
          <Text style={styles.cardValue}>$12,500</Text>
          <Text style={styles.cardSubValue}>This Month <Text style={styles.negative}>-5%</Text></Text>
          <View style={styles.barChart}>
            {['Rent', 'Salaries', 'Marketing', 'Supplies'].map((item, i) => (
              <View style={styles.barItem} key={i}>
                <View style={[styles.bar, { height: [40, 100, 40, 70][i] }]} />
                <Text style={styles.barLabel}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  summaryContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 16,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    padding: 16,
    borderRadius: 12,
  },
  label: {
    color: '#6b7280',
    fontSize: 14,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 20,
    color: '#111827',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  cardSubValue: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  positive: {
    color: '#10b981',
  },
  negative: {
    color: '#f97316',
  },
  chart: {
    height: 120,
    marginBottom: 8,
  },
  monthLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  monthLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginTop: 16,
    height: 100,
  },
  barItem: {
    alignItems: 'center',
  },
  bar: {
    width: 30,
    backgroundColor: '#dbeafe',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#6b7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    paddingBottom: 24,
    marginTop: 8,
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#000',
    fontWeight: '600',
  },
});
