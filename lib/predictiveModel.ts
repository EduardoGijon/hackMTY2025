// CREAR ESTE ARCHIVO NUEVO en la carpeta lib/

import { Transaction } from '@/types';

interface MicroBusinessMetrics {
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

interface ActionableInsight {
  category: 'revenue' | 'expenses' | 'cashflow' | 'growth' | 'risk';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionSteps: string[];
  potentialImpact: string;
  timeframe: string;
}

interface EmergencyAlert {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  immediateActions: string[];
  deadline: string;
}

export class MicroBusinessPredictor {

  /**
   * Analiza el patrón de negocio específico para microempresas
   */
  static analyzeBusinessPattern(transactions: Transaction[], userId: string): MicroBusinessMetrics {
    const monthlyData = this.getMonthlyAggregates(transactions);
    const seasonalPattern = this.detectSeasonality(monthlyData);
    const growthAnalysis = this.analyzeGrowthPattern(monthlyData);
    const riskAssessment = this.assessMicroBusinessRisk(monthlyData);

    return {
      monthlyRevenue: this.getAverageMonthlyRevenue(monthlyData),
      monthlyExpenses: this.getAverageMonthlyExpenses(monthlyData),
      netCashFlow: this.getAverageNetCashFlow(monthlyData),
      seasonalityFactor: seasonalPattern.factor,
      growthTrend: growthAnalysis.trendPercentage,
      volatility: growthAnalysis.volatility,
      cashFlowRisk: riskAssessment.riskLevel,
      businessStage: this.identifyBusinessStage(monthlyData, growthAnalysis),
      predictions: this.generateMicroBusinessPredictions(monthlyData, seasonalPattern, growthAnalysis),
      actionableInsights: this.generateActionableInsights(monthlyData, riskAssessment, growthAnalysis),
      emergencyAlerts: this.generateEmergencyAlerts(monthlyData, riskAssessment)
    };
  }

  /**
   * Detecta patrones estacionales típicos de microempresas
   */
  private static detectSeasonality(monthlyData: any[]): { factor: number; peakMonths: number[]; lowMonths: number[] } {
    if (monthlyData.length < 12) {
      // Si no hay suficiente historial, usar patrones típicos mexicanos
      return {
        factor: 1.2, // Variación estacional moderada
        peakMonths: [11, 12, 5], // Nov, Dec (navidad), Mayo (día de las madres)
        lowMonths: [1, 2, 8] // Enero (post-navidad), Feb, Agosto (regreso a clases)
      };
    }

    // Calcular variación por mes
    const monthlyAverages = this.calculateMonthlyAverages(monthlyData);
    const overallAverage = monthlyAverages.reduce((sum, avg) => sum + avg, 0) / 12;

    const variations = monthlyAverages.map(avg => avg / overallAverage);
    const maxVariation = Math.max(...variations);
    const minVariation = Math.min(...variations);

    return {
      factor: maxVariation / minVariation,
      peakMonths: variations.map((v, i) => v > 1.15 ? i + 1 : null).filter(Boolean) as number[],
      lowMonths: variations.map((v, i) => v < 0.85 ? i + 1 : null).filter(Boolean) as number[]
    };
  }

  /**
   * Analiza el crecimiento específico para microempresas
   */
  private static analyzeGrowthPattern(monthlyData: any[]): {
    trendPercentage: number;
    volatility: number;
    isConsistent: boolean;
    sustainabilityScore: number;
  } {
    if (monthlyData.length < 3) {
      return { trendPercentage: 0, volatility: 0, isConsistent: false, sustainabilityScore: 50 };
    }

    // Calcular tendencia usando regresión lineal simple
    const x = monthlyData.map((_, i) => i);
    const y = monthlyData.map(d => d.balance);
    const trend = this.calculateLinearTrend(x, y);

    // Calcular volatilidad (desviación estándar de cambios mensuales)
    const monthlyChanges = [];
    for (let i = 1; i < monthlyData.length; i++) {
      const change = (monthlyData[i].balance - monthlyData[i - 1].balance) / Math.abs(monthlyData[i - 1].balance || 1);
      monthlyChanges.push(change);
    }

    const volatility = this.calculateStandardDeviation(monthlyChanges);

    // Evaluar consistencia (menos del 30% de meses negativos)
    const negativeMonths = monthlyData.filter(d => d.balance < 0).length;
    const isConsistent = (negativeMonths / monthlyData.length) < 0.3;

    // Score de sostenibilidad (0-100)
    let sustainabilityScore = 50;
    if (trend > 0) sustainabilityScore += 20;
    if (isConsistent) sustainabilityScore += 15;
    if (volatility < 0.3) sustainabilityScore += 15;

    return {
      trendPercentage: trend * 100,
      volatility,
      isConsistent,
      sustainabilityScore: Math.min(100, Math.max(0, sustainabilityScore))
    };
  }

  /**
   * Evalúa riesgos específicos de microempresas
   */
  private static assessMicroBusinessRisk(monthlyData: any[]): {
    riskLevel: 'low' | 'medium' | 'high';
    riskFactors: string[];
    cashRunway: number; // meses que puede sobrevivir
  } {
    if (monthlyData.length === 0) {
      return { riskLevel: 'high', riskFactors: ['No hay datos suficientes'], cashRunway: 0 };
    }

    const currentMonth = monthlyData[monthlyData.length - 1];
    const riskFactors: string[] = [];
    let riskScore = 0;

    // Factor 1: Balance actual
    if (currentMonth.balance < 0) {
      riskScore += 40;
      riskFactors.push('Balance negativo actual');
    } else if (currentMonth.balance < currentMonth.income * 0.1) {
      riskScore += 20;
      riskFactors.push('Margen muy bajo (menos del 10%)');
    }

    // Factor 2: Tendencia reciente (últimos 3 meses)
    if (monthlyData.length >= 3) {
      const recent3Months = monthlyData.slice(-3);
      const decreasingTrend = recent3Months.every((month, i) =>
        i === 0 || month.balance <= recent3Months[i - 1].balance
      );

      if (decreasingTrend) {
        riskScore += 25;
        riskFactors.push('Tendencia decreciente en últimos 3 meses');
      }
    }

    // Factor 3: Volatilidad alta
    const revenues = monthlyData.map(d => d.income);
    const revenueVolatility = this.calculateStandardDeviation(revenues) / (this.calculateMean(revenues) || 1);

    if (revenueVolatility > 0.4) {
      riskScore += 15;
      riskFactors.push('Ingresos muy variables');
    }

    // Calcular runway de efectivo
    const avgMonthlyBurn = this.calculateAverageMonthlyBurn(monthlyData);
    const currentCash = Math.max(0, currentMonth.balance);
    const cashRunway = avgMonthlyBurn > 0 ? currentCash / avgMonthlyBurn : 12;

    if (cashRunway < 2) {
      riskScore += 30;
      riskFactors.push(`Solo ${cashRunway.toFixed(1)} meses de efectivo disponible`);
    }

    const riskLevel: 'low' | 'medium' | 'high' =
      riskScore >= 60 ? 'high' :
        riskScore >= 30 ? 'medium' : 'low';

    return { riskLevel, riskFactors, cashRunway };
  }

  /**
   * Genera predicciones específicas para microempresas
   */
  private static generateMicroBusinessPredictions(
    monthlyData: any[],
    seasonality: any,
    growth: any
  ) {
    const baseRevenue = this.getAverageMonthlyRevenue(monthlyData);
    const baseExpenses = this.getAverageMonthlyExpenses(monthlyData);
    const currentMonth = new Date().getMonth() + 1;

    // Predicción 30 días (próximo mes)
    const next30Days = this.predictNextMonth(baseRevenue, baseExpenses, growth.trendPercentage, currentMonth + 1, seasonality);

    // Predicción 60 días 
    const next60Days = this.predictNextMonth(baseRevenue, baseExpenses, growth.trendPercentage, currentMonth + 2, seasonality);

    // Predicción 90 días
    const next90Days = this.predictNextMonth(baseRevenue, baseExpenses, growth.trendPercentage, currentMonth + 3, seasonality);

    // Predecir próxima temporada alta y baja
    const nextSeasonHigh = this.predictNextSeasonalPeak(seasonality.peakMonths, baseRevenue, growth.trendPercentage);
    const nextSeasonLow = this.predictNextSeasonalLow(seasonality.lowMonths, baseRevenue, growth.trendPercentage);

    return {
      next30Days,
      next60Days,
      next90Days,
      nextSeasonHigh,
      nextSeasonLow
    };
  }

  /**
   * Genera insights accionables específicos para microempresarios
   */
  private static generateActionableInsights(monthlyData: any[], risk: any, growth: any): ActionableInsight[] {
    const insights: ActionableInsight[] = [];

    // Insight 1: Cash flow optimization
    if (risk.cashRunway < 6) {
      insights.push({
        category: 'cashflow',
        priority: 'high',
        title: 'Improve cash flow urgently',
        description: `You only have ${risk.cashRunway.toFixed(1)} months of cash. It's critical to act now.`,
        actionSteps: [
          'Collect all pending accounts this week',
          'Negotiate payment terms with suppliers',
          'Offer early payment discounts to customers',
          'Reduce non-essential expenses immediately'
        ],
        potentialImpact: 'Extend runway to 3-6 months',
        timeframe: '1-2 weeks'
      });
    }

    // Insight 2: Sustainable growth
    if (growth.trendPercentage > 0 && growth.sustainabilityScore > 70) {
      insights.push({
        category: 'growth',
        priority: 'medium',
        title: 'Capitalize on growth momentum',
        description: 'Your business is growing sustainably. It\'s time to invest strategically.',
        actionSteps: [
          'Reinvest 20% of profits in marketing',
          'Extend operating hours on high-sales days',
          'Train staff to improve customer service',
          'Explore new complementary products/services'
        ],
        potentialImpact: 'Accelerate growth 15-25%',
        timeframe: '1-3 months'
      });
    }

    // Insight 3: Revenue stabilization
    if (growth.volatility > 0.3) {
      insights.push({
        category: 'revenue',
        priority: 'medium',
        title: 'Stabilize monthly income',
        description: 'Your income varies greatly month to month. This creates financial uncertainty.',
        actionSteps: [
          'Create recurring service packages',
          'Implement layaway/pre-sale system',
          'Diversify products for different seasons',
          'Seek medium-term contracts with frequent customers'
        ],
        potentialImpact: 'Reduce income variation 30-40%',
        timeframe: '2-4 months'
      });
    }

    // Insight 4: Cost optimization
    const avgExpenseRatio = this.getAverageExpenseRatio(monthlyData);
    if (avgExpenseRatio > 0.8) {
      insights.push({
        category: 'expenses',
        priority: 'high',
        title: 'Reduce operating costs',
        description: `Your expenses represent ${(avgExpenseRatio * 100).toFixed(0)}% of income. Ideal would be 70-75%.`,
        actionSteps: [
          'Review all monthly fixed expenses',
          'Negotiate better prices with main suppliers',
          'Eliminate non-essential subscriptions and services',
          'Optimize delivery or distribution routes'
        ],
        potentialImpact: 'Improve margin 5-15%',
        timeframe: '2-6 weeks'
      });
    }

    return insights.slice(0, 3); // Máximo 3 insights para no abrumar
  }

  /**
   * Genera alertas de emergencia específicas
   */
  private static generateEmergencyAlerts(monthlyData: any[], risk: any): EmergencyAlert[] {
    const alerts: EmergencyAlert[] = [];

    // Alerta crítica: Sin efectivo
    if (risk.cashRunway < 1) {
      alerts.push({
        severity: 'critical',
        title: 'EMERGENCY: No cash available',
        message: 'Your business cannot operate next month without cash injection.',
        immediateActions: [
          'Contact bank for emergency credit line',
          'Collect ALL accounts receivable TODAY',
          'Sell inventory with aggressive discounts',
          'Seek investor or family loan'
        ],
        deadline: 'This week'
      });
    }

    // Negative trend alert
    if (monthlyData.length >= 3) {
      const last3Months = monthlyData.slice(-3);
      const allNegative = last3Months.every(month => month.balance < 0);

      if (allNegative) {
        alerts.push({
          severity: 'warning',
          title: 'Sustained negative trend',
          message: 'You have had losses for 3 consecutive months. The business needs structural changes.',
          immediateActions: [
            'Review complete business model',
            'Analyze competition and market prices',
            'Consider pivot or strategy change',
            'Seek business advisory'
          ],
          deadline: '2 weeks'
        });
      }
    }

    return alerts;
  }

  // Métodos auxiliares de cálculo
  private static getMonthlyAggregates(transactions: Transaction[]) {
    // Implementar agrupación por mes
    const groups: { [key: string]: { income: number; expenses: number; balance: number } } = {};

    transactions.forEach(t => {
      const monthKey = new Date(t.date).toISOString().slice(0, 7);
      if (!groups[monthKey]) {
        groups[monthKey] = { income: 0, expenses: 0, balance: 0 };
      }

      if (t.type === 'income') {
        groups[monthKey].income += t.amount;
      } else {
        groups[monthKey].expenses += t.amount;
      }
      groups[monthKey].balance = groups[monthKey].income - groups[monthKey].expenses;
    });

    return Object.entries(groups)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private static calculateLinearTrend(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  private static calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(avgSquareDiff);
  }

  private static calculateMean(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private static getAverageMonthlyRevenue(monthlyData: any[]): number {
    return this.calculateMean(monthlyData.map(d => d.income));
  }

  private static getAverageMonthlyExpenses(monthlyData: any[]): number {
    return this.calculateMean(monthlyData.map(d => d.expenses));
  }

  private static getAverageNetCashFlow(monthlyData: any[]): number {
    return this.calculateMean(monthlyData.map(d => d.balance));
  }

  private static calculateAverageMonthlyBurn(monthlyData: any[]): number {
    const expenses = monthlyData.map(d => d.expenses);
    return this.calculateMean(expenses);
  }

  private static getAverageExpenseRatio(monthlyData: any[]): number {
    const ratios = monthlyData
      .filter(d => d.income > 0)
      .map(d => d.expenses / d.income);
    return ratios.length > 0 ? this.calculateMean(ratios) : 0;
  }

  private static identifyBusinessStage(monthlyData: any[], growth: any): 'startup' | 'growing' | 'stable' | 'struggling' {
    if (monthlyData.length < 6) return 'startup';

    const avgRevenue = this.getAverageMonthlyRevenue(monthlyData);
    const isGrowing = growth.trendPercentage > 5;
    const isConsistent = growth.isConsistent;

    if (!isConsistent && growth.trendPercentage < -5) return 'struggling';
    if (isGrowing && growth.sustainabilityScore > 70) return 'growing';
    if (isConsistent && Math.abs(growth.trendPercentage) < 5) return 'stable';

    return 'startup';
  }

  private static calculateMonthlyAverages(monthlyData: any[]): number[] {
    // Implementar cálculo de promedios por mes del año
    const monthlyRevenues: { [key: number]: number[] } = {};

    monthlyData.forEach(data => {
      const month = new Date(data.month + '-01').getMonth() + 1;
      if (!monthlyRevenues[month]) monthlyRevenues[month] = [];
      monthlyRevenues[month].push(data.income);
    });

    const averages: number[] = [];
    for (let i = 1; i <= 12; i++) {
      if (monthlyRevenues[i] && monthlyRevenues[i].length > 0) {
        averages.push(this.calculateMean(monthlyRevenues[i]));
      } else {
        averages.push(0);
      }
    }

    return averages;
  }

  private static predictNextMonth(
    baseRevenue: number,
    baseExpenses: number,
    trendPercentage: number,
    targetMonth: number,
    seasonality: any
  ): number {
    // ✅ VALIDAR INPUTS
    if (!isFinite(baseRevenue) || !isFinite(baseExpenses) || !isFinite(trendPercentage)) {
      console.warn('Invalid inputs:', { baseRevenue, baseExpenses, trendPercentage });
      return Math.max(1000, baseRevenue - baseExpenses); // Valor de fallback
    }

    // ✅ LIMITAR TENDENCIA A UN RANGO RAZONABLE
    const safeTrendPercentage = Math.max(-50, Math.min(50, trendPercentage)); // Entre -50% y +50%

    // Aplicar tendencia de crecimiento
    const monthlyGrowth = safeTrendPercentage / 100;
    const adjustedRevenue = baseRevenue * (1 + monthlyGrowth);

    // Aplicar factor estacional (limitado)
    const isSeasonalHigh = seasonality.peakMonths?.includes(targetMonth);
    const isSeasonalLow = seasonality.lowMonths?.includes(targetMonth);

    let seasonalAdjustment = 1;
    if (isSeasonalHigh) seasonalAdjustment = 1.2; // Máximo 20% más
    if (isSeasonalLow) seasonalAdjustment = 0.8;  // Máximo 20% menos

    const finalRevenue = adjustedRevenue * seasonalAdjustment;
    const finalExpenses = baseExpenses * (1 + monthlyGrowth * 0.7); // Los gastos crecen más lento

    const rawPrediction = finalRevenue - finalExpenses;

    // ✅ VALIDAR Y LIMITAR EL RESULTADO
    return this.validateAndClampPrediction(rawPrediction, baseRevenue - baseExpenses);
  }

  private static predictNextSeasonalPeak(peakMonths: number[], baseRevenue: number, trendPercentage: number): { month: string; expectedRevenue: number } {
    const currentMonth = new Date().getMonth() + 1;
    const nextPeak = peakMonths.find(month => month > currentMonth) || peakMonths[0] + 12;
    const monthsToNextPeak = nextPeak > 12 ? nextPeak - 12 - currentMonth + 12 : nextPeak - currentMonth;

    const projectedRevenue = baseRevenue * Math.pow(1 + trendPercentage / 100, monthsToNextPeak) * 1.2;

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    return {
      month: monthNames[(nextPeak - 1) % 12],
      expectedRevenue: projectedRevenue
    };
  }

  private static predictNextSeasonalLow(lowMonths: number[], baseRevenue: number, trendPercentage: number): { month: string; expectedRevenue: number } {
    const currentMonth = new Date().getMonth() + 1;
    const nextLow = lowMonths.find(month => month > currentMonth) || lowMonths[0] + 12;
    const monthsToNextLow = nextLow > 12 ? nextLow - 12 - currentMonth + 12 : nextLow - currentMonth;

    const projectedRevenue = baseRevenue * Math.pow(1 + trendPercentage / 100, monthsToNextLow) * 0.8;

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    return {
      month: monthNames[(nextLow - 1) % 12],
      expectedRevenue: projectedRevenue
    };
  }

  private static validateAndClampPrediction(prediction: number, baseAmount: number): number {
    // Validar que no sea NaN o Infinity
    if (!isFinite(prediction)) {
      console.warn('Prediction is not finite:', prediction);
      return baseAmount * 1.1; // Crecimiento conservador del 10%
    }

    // Limitar a un rango razonable (entre -500% y +500% del monto base)
    const maxChange = Math.abs(baseAmount) * 5;
    const minPrediction = baseAmount - maxChange;
    const maxPrediction = baseAmount + maxChange;

    if (prediction < minPrediction) {
      console.warn('Prediction too negative, clamping:', prediction, 'to', minPrediction);
      return minPrediction;
    }

    if (prediction > maxPrediction) {
      console.warn('Prediction too positive, clamping:', prediction, 'to', maxPrediction);
      return maxPrediction;
    }

    return prediction;
  }

}

// Función principal para usar en tu API
export function generateMicroBusinessPredictions(transactions: Transaction[], userId: string): MicroBusinessMetrics {
  return MicroBusinessPredictor.analyzeBusinessPattern(transactions, userId);
}

