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

export interface Alert {
  type: 'info' | 'warning' | 'danger';
  message: string;
  action: string;
}

// ✅ INTERFAZ ACTUALIZADA CON PREDICCIONES AVANZADAS
export interface PredictionData {
  // Predicciones básicas
  predictedBalance30Days: number;
  predictedBalance60Days: number;
  predictedBalance90Days: number;
  cashFlowRisk: 'low' | 'medium' | 'high';
  recommendedActions: string[];
  alerts: Alert[];
  
  // ✅ NUEVOS CAMPOS DEL MODELO PREDICTIVO
  businessStage?: 'startup' | 'growing' | 'stable' | 'struggling';
  sustainabilityScore?: string;
  cashRunway?: string;
  growthTrend?: number;
  volatility?: number;
  
  // ✅ PRONÓSTICO ESTACIONAL
  seasonalForecast?: {
    nextPeakMonth: string;
    nextPeakRevenue: number;
    nextLowMonth: string;
    nextLowRevenue: number;
  };
  
  // ✅ MÉTRICAS ADICIONALES DEL MODELO
  monthlyRevenue?: number;
  monthlyExpenses?: number;
  netCashFlow?: number;
  seasonalityFactor?: number;
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

// ✅ INTERFACES ADICIONALES PARA EL MODELO PREDICTIVO
export interface ActionableInsight {
  category: 'revenue' | 'expenses' | 'cashflow' | 'growth' | 'risk';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionSteps: string[];
  potentialImpact: string;
  timeframe: string;
}

export interface EmergencyAlert {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  immediateActions: string[];
  deadline: string;
}

export interface MicroBusinessMetrics {
  // Métricas básicas
  monthlyRevenue: number;
  monthlyExpenses: number;
  netCashFlow: number;
  
  // Patrones estacionales
  seasonalityFactor: number;
  growthTrend: number;
  volatility: number;
  
  // Indicadores de salud
  cashFlowRisk: 'low' | 'medium' | 'high';
  businessStage: 'startup' | 'growing' | 'stable' | 'struggling';
  
  // Predicciones
  predictions: {
    next30Days: number;
    next60Days: number;
    next90Days: number;
    nextSeasonHigh: { month: string; expectedRevenue: number };
    nextSeasonLow: { month: string; expectedRevenue: number };
  };
  
  // Recomendaciones accionables
  actionableInsights: ActionableInsight[];
  emergencyAlerts: EmergencyAlert[];
}

// ✅ INTERFACES PARA MOCK DATA GENERATOR
export interface MockTransaction extends Transaction {}

export interface MockDashboardData extends DashboardData {}