import { ComponentStyles, GlobalStyles } from '@/constants/Styles'
import React from 'react'
import { Text, View } from 'react-native'

const SummaryContainer = () => {
  return (
        <View style={ComponentStyles.summaryContainer}>
            <View style={GlobalStyles.summaryCard}>
            <Text style={GlobalStyles.label}>Total Expenditure</Text>
            <Text style={GlobalStyles.value}>$12,500</Text>
            </View>
            <View style={GlobalStyles.summaryCard}>
            <Text style={GlobalStyles.label}>Net Profit</Text>
            <Text style={GlobalStyles.value}>$8,750</Text>
            </View>
        </View>
  )
}

export default SummaryContainer