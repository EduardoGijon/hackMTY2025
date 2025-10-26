import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { DashboardData } from '@/types'; 

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get transactions for the selected month
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: new Date(`${month}-01`),
          lt: new Date(`${month}-31`)
        }
      }
    });

    // Calculate dashboard data
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');

    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? ((netBalance / totalIncome) * 100) : 0;

    // Group by category
    const incomeByCategory = groupByCategory(incomeTransactions);
    const expensesByCategory = groupByCategory(expenseTransactions);

    // Generate predictions and alerts
    const predictions = generatePredictions(transactions, netBalance, totalIncome, totalExpenses);

    const dashboardData: DashboardData = {
      totalIncome,
      totalExpenses,
      netBalance,
      profitMargin,
      incomeByCategory,
      expensesByCategory,
      monthlyTrend: [], // Implement monthly trend logic
      predictions
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function groupByCategory(transactions: any[]) {
  const grouped = transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});

  const total = Object.values(grouped).reduce((sum: number, amount: any) => sum + amount, 0);
  
  return Object.entries(grouped).map(([category, amount]) => ({
    category,
    amount: amount as number,
    percentage: total > 0 ? ((amount as number / total) * 100) : 0
  }));
}

function generatePredictions(transactions: any[], netBalance: number, totalIncome: number, totalExpenses: number) {
  const alerts = [];
  let cashFlowRisk: 'low' | 'medium' | 'high' = 'low';
  const recommendedActions = [];

  // Cash flow analysis
  if (netBalance < 0) {
    cashFlowRisk = 'high';
    alerts.push({
      type: 'danger' as const,
      message: `Flujo de caja negativo: -$${Math.abs(netBalance).toLocaleString()}`,
      action: 'Revisar gastos urgentemente'
    });
    recommendedActions.push('Reducir gastos no esenciales inmediatamente');
  } else if (netBalance < totalIncome * 0.1) {
    cashFlowRisk = 'medium';
    alerts.push({
      type: 'warning' as const,
      message: 'Margen de ganancia muy bajo',
      action: 'Optimizar costos'
    });
  }

  // High expense categories
  const expenseRatio = totalExpenses / totalIncome;
  if (expenseRatio > 0.8) {
    alerts.push({
      type: 'warning' as const,
      message: 'Gastos representan más del 80% de ingresos',
      action: 'Revisar estructura de costos'
    });
    recommendedActions.push('Analizar y reducir gastos principales');
  }

  return {
    cashFlowRisk,
    recommendedActions,
    predictedBalance30Days: netBalance * 1.1, // Simple prediction
    alerts
  };
}

// ...existing code...

function generateAdvancedPredictions(transactions: any[], currentBalance: number, totalIncome: number, totalExpenses: number) {
  // 1. ANÁLISIS TEMPORAL
  const monthlyData = getMonthlyTrends(transactions);
  const growthRate = calculateGrowthRate(monthlyData);
  const volatility = calculateVolatility(monthlyData);
  
  // 2. PREDICCIONES AVANZADAS
  const predictions = {
    // Predicción basada en tendencia
    next30Days: predictWithTrend(currentBalance, growthRate),
    next60Days: predictWithTrend(currentBalance, growthRate, 60),
    next90Days: predictWithTrend(currentBalance, growthRate, 90),
    
    // Análisis de riesgo mejorado
    cashFlowRisk: assessAdvancedRisk(currentBalance, volatility, growthRate),
    
    // Recomendaciones inteligentes
    recommendations: generateSmartRecommendations(monthlyData, currentBalance, volatility),
    
    // Alertas predictivas
    alerts: generatePredictiveAlerts(monthlyData, growthRate, volatility)
  };

  return predictions;
}

// FUNCIONES DE ANÁLISIS AVANZADO
function getMonthlyTrends(transactions: any[]) {
  const monthlyGroups = transactions.reduce((acc, transaction) => {
    const monthKey = transaction.date.toISOString().slice(0, 7); // YYYY-MM
    if (!acc[monthKey]) {
      acc[monthKey] = { income: 0, expenses: 0, balance: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[monthKey].income += transaction.amount;
    } else {
      acc[monthKey].expenses += transaction.amount;
    }
    acc[monthKey].balance = acc[monthKey].income - acc[monthKey].expenses;
    
    return acc;
  }, {});

  return Object.entries(monthlyGroups).map(([month, data]) => ({
    month,
    ...data
  })).sort((a, b) => a.month.localeCompare(b.month));
}

function calculateGrowthRate(monthlyData: any[]) {
  if (monthlyData.length < 2) return 0;
  
  const firstMonth = monthlyData[0].balance;
  const lastMonth = monthlyData[monthlyData.length - 1].balance;
  
  if (firstMonth === 0) return 0;
  
  return ((lastMonth - firstMonth) / firstMonth) * 100;
}

function calculateVolatility(monthlyData: any[]) {
  if (monthlyData.length < 2) return 0;
  
  const balances = monthlyData.map(m => m.balance);
  const mean = balances.reduce((sum, val) => sum + val, 0) / balances.length;
  
  const variance = balances.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / balances.length;
  
  return Math.sqrt(variance);
}

function predictWithTrend(currentBalance: number, growthRate: number, days: number = 30) {
  const monthlyGrowth = growthRate / 100;
  const dailyGrowth = monthlyGrowth / 30;
  
  return currentBalance * (1 + (dailyGrowth * days));
}

function assessAdvancedRisk(balance: number, volatility: number, growthRate: number): 'low' | 'medium' | 'high' {
  // Balance negativo = alto riesgo
  if (balance < 0) return 'high';
  
  // Alta volatilidad + crecimiento negativo = alto riesgo
  if (volatility > balance * 0.3 && growthRate < -10) return 'high';
  
  // Volatilidad media o crecimiento bajo = riesgo medio
  if (volatility > balance * 0.2 || growthRate < 0) return 'medium';
  
  return 'low';
}

function generateSmartRecommendations(monthlyData: any[], currentBalance: number, volatility: number) {
  const recommendations = [];
  
  // Recomendaciones basadas en volatilidad
  if (volatility > currentBalance * 0.25) {
    recommendations.push('Crear un fondo de emergencia del 20% de ingresos mensuales');
    recommendations.push('Diversificar fuentes de ingresos para reducir volatilidad');
  }
  
  // Recomendaciones basadas en tendencias
  const lastMonthBalance = monthlyData[monthlyData.length - 1]?.balance || 0;
  const previousMonthBalance = monthlyData[monthlyData.length - 2]?.balance || 0;
  
  if (lastMonthBalance < previousMonthBalance) {
    recommendations.push('Revisar gastos del último mes - hay una tendencia decreciente');
    recommendations.push('Implementar estrategias para incrementar ingresos');
  }
  
  // Análisis de categorías con mayor crecimiento
  const expenseCategories = analyzeExpenseGrowth(monthlyData);
  if (expenseCategories.length > 0) {
    recommendations.push(`Revisar gastos en: ${expenseCategories.join(', ')}`);
  }
  
  return recommendations.length > 0 ? recommendations : ['Mantener la estrategia actual'];
}

function generatePredictiveAlerts(monthlyData: any[], growthRate: number, volatility: number) {
  const alerts = [];
  
  // Alert por tendencia negativa
  if (growthRate < -15) {
    alerts.push({
      type: 'danger' as const,
      message: `Tendencia decreciente del ${Math.abs(growthRate).toFixed(1)}% mensual`,
      action: 'Implementar medidas correctivas inmediatamente'
    });
  }
  
  // Alert por alta volatilidad
  if (volatility > 20000) {
    alerts.push({
      type: 'warning' as const,
      message: 'Alta variabilidad en flujos de caja',
      action: 'Crear estrategias de estabilización'
    });
  }
  
  // Alert por crecimiento positivo
  if (growthRate > 20) {
    alerts.push({
      type: 'info' as const,
      message: `Excelente crecimiento del ${growthRate.toFixed(1)}%`,
      action: 'Considerar reinversión en el negocio'
    });
  }
  
  return alerts;
}

function analyzeExpenseGrowth(monthlyData: any[]) {
  // Esta función podría analizar qué categorías de gastos están creciendo más
  // Por simplicidad, retornamos categorías comunes que suelen ser problemáticas
  return ['Marketing', 'Suministros'];
}