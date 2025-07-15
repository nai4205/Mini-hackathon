import { StyleSheet } from 'react-native';

// Color palette
export const Colors = {
  // Primary colors
  primary: '#3b82f6',
  primaryLight: '#dbeafe',
  
  // Background colors
  background: '#f9fafb',
  cardBackground: '#ffffff',
  summaryBackground: '#e5e7eb',
  
  // Text colors
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textLight: '#9ca3af',
  
  // Status colors
  success: '#10b981',
  warning: '#f97316',
  error: '#ef4444',
  
  // Border colors
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
};

// Typography
export const Typography = {
  // Font sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 22,
  '3xl': 32,
  
  // Font weights
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  
  // Line heights
  lineHeightTight: 1.2,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
};

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
};

// Border radius
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 50,
};

// Global Styles
export const GlobalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  containerPadded: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  
  // Card styles
  card: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.summaryBackground,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  
  // Typography styles
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    marginVertical: Spacing.xl,
    color: Colors.textPrimary,
  },
  
  subtitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  
  label: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  
  value: {
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  
  subValue: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  
  bodyText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: Typography.base * Typography.lineHeightNormal,
  },
  
  smallText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  
  // Status text colors
  positiveText: {
    color: Colors.success,
  },
  
  negativeText: {
    color: Colors.warning,
  },
  
  errorText: {
    color: Colors.error,
  },
  
  // Layout styles
  row: {
    flexDirection: 'row',
  },
  
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  flex1: {
    flex: 1,
  },
  
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Spacing utilities
  marginTopXs: { marginTop: Spacing.xs },
  marginTopSm: { marginTop: Spacing.sm },
  marginTopMd: { marginTop: Spacing.md },
  marginTopLg: { marginTop: Spacing.lg },
  marginTopXl: { marginTop: Spacing.xl },
  
  marginBottomXs: { marginBottom: Spacing.xs },
  marginBottomSm: { marginBottom: Spacing.sm },
  marginBottomMd: { marginBottom: Spacing.md },
  marginBottomLg: { marginBottom: Spacing.lg },
  marginBottomXl: { marginBottom: Spacing.xl },
  
  paddingXs: { padding: Spacing.xs },
  paddingSm: { padding: Spacing.sm },
  paddingMd: { padding: Spacing.md },
  paddingLg: { padding: Spacing.lg },
  paddingXl: { padding: Spacing.xl },
  
  // Gap utilities
  gapXs: { gap: Spacing.xs },
  gapSm: { gap: Spacing.sm },
  gapMd: { gap: Spacing.md },
  gapLg: { gap: Spacing.lg },
  gapXl: { gap: Spacing.xl },
  
  // Chart and visualization styles
  chart: {
    height: 120,
    marginBottom: Spacing.sm,
  },
  
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginTop: Spacing.lg,
    height: 100,
  },
  
  barItem: {
    alignItems: 'center',
  },
  
  bar: {
    width: 30,
    backgroundColor: Colors.primaryLight,
    borderTopLeftRadius: BorderRadius.sm,
    borderTopRightRadius: BorderRadius.sm,
  },
  
  barLabel: {
    marginTop: Spacing.xs,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  
  monthLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  
  monthLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  
  // Button styles
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  
  buttonText: {
    color: '#ffffff',
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  
  buttonSecondaryText: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
  },
  
  // Input styles
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    backgroundColor: Colors.cardBackground,
  },
  
  inputFocused: {
    borderColor: Colors.primary,
  },
  
  // Shadow styles
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  shadowMd: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  
  shadowLg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
});

// Component-specific styles that can be extended
export const ComponentStyles = {
  // Summary container styles
  summaryContainer: {
    flexDirection: 'row' as const,
    marginTop: Spacing.lg,
    gap: Spacing.lg,
  },
  
  // Navigation styles
  footer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    paddingBottom: Spacing['2xl'],
    marginTop: Spacing.sm,
  },
  
  navItem: {
    alignItems: 'center' as const,
  },
  
  navLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  
  navLabelActive: {
    color: Colors.textPrimary,
    fontWeight: Typography.semibold,
  },
};

// Export everything for easy importing
export {
    GlobalStyles as default
};

