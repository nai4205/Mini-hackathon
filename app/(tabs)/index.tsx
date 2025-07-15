// Dashboard.tsx

import SummaryContainer from '@/components/tracker/SummaryContainer';
import GeminiDashboard from '@/components/tracker/GeminiDashboard';
import { Colors, GlobalStyles } from '@/constants/Styles';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const revenueData = [0, 8, 5, 9, 4, 11, 3, 10, 2, 13, 6, 12];

const Dashboard = () => {
  return (
    <View style={GlobalStyles.containerPadded}>
      {/* Header */}
      <View style={GlobalStyles.header}>
        <Text style={GlobalStyles.title}>Dashboard</Text>
        <Icon name="settings-outline" size={24} color={Colors.textSecondary} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        <SummaryContainer />

        {/* AI Insights */}
        <GeminiDashboard />

        {/* Key Metrics */}
        <Text style={GlobalStyles.sectionTitle}>Key Metrics</Text>

        {/* Revenue Trend */}
        <View style={GlobalStyles.card}>
          <Text style={GlobalStyles.label}>Revenue Trend</Text>
          <Text style={GlobalStyles.value}>$20,000</Text>
          <Text style={GlobalStyles.subValue}>Last 6 Months <Text style={GlobalStyles.positiveText}>+15%</Text></Text>
          {/* <LineChart
            style={GlobalStyles.chart}
            data={revenueData}
            svg={{ stroke: Colors.primary, strokeWidth: 2 }}
            contentInset={{ top: 10, bottom: 10 }}
          /> */}
          <View style={GlobalStyles.monthLabels}>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => (
              <Text key={month} style={GlobalStyles.monthLabel}>{month}</Text>
            ))}
          </View>
        </View>

        {/* Expense Breakdown */}
        <View style={GlobalStyles.card}>
          <Text style={GlobalStyles.label}>Expense Breakdown</Text>
          <Text style={GlobalStyles.value}>$12,500</Text>
          <Text style={GlobalStyles.subValue}>This Month <Text style={GlobalStyles.negativeText}>-5%</Text></Text>
          <View style={GlobalStyles.barChart}>
            {['Rent', 'Salaries', 'Marketing', 'Supplies'].map((item, i) => (
              <View style={GlobalStyles.barItem} key={i}>
                <View style={[GlobalStyles.bar, { height: [40, 100, 40, 70][i] }]} />
                <Text style={GlobalStyles.barLabel}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default Dashboard;