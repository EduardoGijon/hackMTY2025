export interface User {
  id: string;
  email: string;
  name: string;
  businessName: string;
  businessType: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

export interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  profitMargin: number;
  incomeByCategory: CategoryData[];
  expensesByCategory: CategoryData[];
  monthlyTrend: MonthlyData[];
  predictions: PredictionData;
}

export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface PredictionData {
  cashFlowRisk: 'low' | 'medium' | 'high';
  recommendedActions: string[];
  predictedBalance30Days: number;
  alerts: Alert[];
}

export interface Alert {
  type: 'warning' | 'danger' | 'info';
  message: string;
  action?: string;
}