
export interface MockTransaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: Date;
  createdAt: Date;
}

export interface MockDashboardData {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  profitMargin: number;
  incomeByCategory: Array<{ category: string; amount: number; percentage: number }>;
  expensesByCategory: Array<{ category: string; amount: number; percentage: number }>;
  monthlyTrend: Array<{ month: string; income: number; expenses: number; balance: number }>;
  predictions: {
    cashFlowRisk: 'low' | 'medium' | 'high';
    recommendedActions: string[];
    predictedBalance30Days: number;
    predictedBalance60Days: number;
    predictedBalance90Days: number;
    alerts: Array<{
      type: 'info' | 'warning' | 'danger';
      message: string;
      action: string;
    }>;
  };
}

const INCOME_CATEGORIES = [
  'Ventas',
  'Servicios', 
  'Consultoría',
  'Comisiones',
  'Productos Digitales',
  'Suscripciones',
  'Eventos'
];

const EXPENSE_CATEGORIES = [
  'Nómina',
  'Marketing',
  'Alquiler',
  'Suministros',
  'Servicios',
  'Transporte',
  'Tecnología',
  'Legal',
  'Contabilidad',
  'Seguros'
];

const INCOME_DESCRIPTIONS = {
  'Ventas': ['Venta online', 'Venta en tienda', 'Venta mayorista', 'Venta retail'],
  'Servicios': ['Consultoría técnica', 'Soporte premium', 'Implementación', 'Mantenimiento'],
  'Consultoría': ['Asesoría estratégica', 'Consultoría digital', 'Análisis de negocio'],
  'Comisiones': ['Comisión por venta', 'Comisión afiliados', 'Comisión referidos'],
  'Productos Digitales': ['Curso online', 'E-book', 'Software license', 'App premium'],
  'Suscripciones': ['Plan mensual', 'Plan anual', 'Membresía premium'],
  'Eventos': ['Workshop', 'Conferencia', 'Seminario', 'Networking']
};

const EXPENSE_DESCRIPTIONS = {
  'Nómina': ['Salarios equipo', 'Bonos performance', 'Prestaciones', 'Outsourcing'],
  'Marketing': ['Publicidad digital', 'Google Ads', 'Facebook Ads', 'Email marketing', 'SEO'],
  'Alquiler': ['Renta oficina', 'Coworking', 'Bodega', 'Local comercial'],
  'Suministros': ['Materiales oficina', 'Equipos', 'Mobiliario', 'Inventario'],
  'Servicios': ['Internet', 'Teléfono', 'Software subscriptions', 'Cloud services'],
  'Transporte': ['Gasolina', 'Uber', 'Envíos', 'Logística'],
  'Tecnología': ['Hardware', 'Software licenses', 'Hosting', 'Dominios'],
  'Legal': ['Abogados', 'Trámites', 'Registro marca', 'Contratos'],
  'Contabilidad': ['Contador', 'Auditoría', 'Software contable', 'Impuestos'],
  'Seguros': ['Seguro médico', 'Seguro oficina', 'Seguro responsabilidad']
};

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateTransactionId(): string {
  return 'trans_' + Math.random().toString(36).substr(2, 9);
}

export function generateMockTransactions(
  userId: string, 
  year: number, 
  month: number, 
  baseIncomeLevel: 'low' | 'medium' | 'high' = 'medium'
): MockTransaction[] {
  const transactions: MockTransaction[] = [];
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // Configurar niveles base según el tipo de negocio
  const incomeLevels = {
    low: { min: 5000, max: 15000, frequency: 8 },
    medium: { min: 15000, max: 40000, frequency: 12 },
    high: { min: 40000, max: 80000, frequency: 18 }
  };
  
  const expenseLevels = {
    low: { min: 3000, max: 10000, frequency: 6 },
    medium: { min: 8000, max: 25000, frequency: 10 },
    high: { min: 20000, max: 50000, frequency: 15 }
  };

  const incomeConfig = incomeLevels[baseIncomeLevel];
  const expenseConfig = expenseLevels[baseIncomeLevel];

  // Generar ingresos
  const numIncomeTransactions = randomBetween(
    Math.max(1, incomeConfig.frequency - 3), 
    incomeConfig.frequency + 3
  );
  
  for (let i = 0; i < numIncomeTransactions; i++) {
    const category = randomChoice(INCOME_CATEGORIES);
    const description = randomChoice(INCOME_DESCRIPTIONS[category as keyof typeof INCOME_DESCRIPTIONS]);
    const day = randomBetween(1, daysInMonth);
    
    // Variación estacional (más ventas en ciertos meses)
    let seasonalMultiplier = 1;
    if ([11, 12].includes(month)) seasonalMultiplier = 1.3; // Nov-Dic
    if ([6, 7, 8].includes(month)) seasonalMultiplier = 0.8; // Jun-Ago
    
    const baseAmount = randomFloat(incomeConfig.min, incomeConfig.max);
    const amount = Math.round(baseAmount * seasonalMultiplier);
    
    transactions.push({
      id: generateTransactionId(),
      userId,
      type: 'income',
      category,
      amount,
      description,
      date: new Date(year, month - 1, day, randomBetween(8, 18), randomBetween(0, 59)),
      createdAt: new Date()
    });
  }

  // Generar gastos
  const numExpenseTransactions = randomBetween(
    Math.max(1, expenseConfig.frequency - 2), 
    expenseConfig.frequency + 2
  );
  
  for (let i = 0; i < numExpenseTransactions; i++) {
    const category = randomChoice(EXPENSE_CATEGORIES);
    const description = randomChoice(EXPENSE_DESCRIPTIONS[category as keyof typeof EXPENSE_DESCRIPTIONS]);
    const day = randomBetween(1, daysInMonth);
    
    // Gastos fijos vs variables
    let amount: number;
    if (['Nómina', 'Alquiler', 'Seguros'].includes(category)) {
      // Gastos fijos - más consistentes
      amount = Math.round(randomFloat(expenseConfig.min * 0.8, expenseConfig.max * 0.6));
    } else {
      // Gastos variables
      amount = Math.round(randomFloat(expenseConfig.min * 0.3, expenseConfig.max * 0.8));
    }
    
    transactions.push({
      id: generateTransactionId(),
      userId,
      type: 'expense',
      category,
      amount,
      description,
      date: new Date(year, month - 1, day, randomBetween(8, 18), randomBetween(0, 59)),
      createdAt: new Date()
    });
  }

  return transactions.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function generateMockDashboardData(
  userId: string, 
  year: number, 
  month: number,
  includeHistorical: boolean = true
): MockDashboardData {
  // Generar datos del mes actual
  const currentTransactions = generateMockTransactions(userId, year, month, 'medium');
  
  // Generar datos históricos (últimos 6 meses)
  const historicalData: Array<{ month: string; income: number; expenses: number; balance: number }> = [];
  
  if (includeHistorical) {
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(year, month - 1 - i, 1);
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth() + 1;
      
      const monthTransactions = generateMockTransactions(userId, targetYear, targetMonth, 'medium');
      const monthIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const monthExpenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      historicalData.push({
        month: `${targetYear}-${targetMonth.toString().padStart(2, '0')}`,
        income: monthIncome,
        expenses: monthExpenses,
        balance: monthIncome - monthExpenses
      });
    }
  }

  // Calcular métricas del mes actual
  const incomeTransactions = currentTransactions.filter(t => t.type === 'income');
  const expenseTransactions = currentTransactions.filter(t => t.type === 'expense');
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? ((netBalance / totalIncome) * 100) : 0;

  // Agrupar por categorías
  const incomeByCategory = groupTransactionsByCategory(incomeTransactions);
  const expensesByCategory = groupTransactionsByCategory(expenseTransactions);

  // Generar predicciones inteligentes
  const predictions = generateSmartPredictions(historicalData, netBalance, totalIncome, totalExpenses);

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    profitMargin,
    incomeByCategory,
    expensesByCategory,
    monthlyTrend: historicalData,
    predictions
  };
}

function groupTransactionsByCategory(transactions: MockTransaction[]) {
  const grouped = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(grouped).reduce((sum, amount) => sum + amount, 0);
  
  return Object.entries(grouped)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? ((amount / total) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);
}

function generateSmartPredictions(
  historicalData: Array<{ month: string; income: number; expenses: number; balance: number }>,
  currentBalance: number,
  currentIncome: number,
  currentExpenses: number
) {
  const alerts = [];
  let cashFlowRisk: 'low' | 'medium' | 'high' = 'low';
  const recommendedActions = [];

  // Análisis de tendencia
  const avgBalance = historicalData.length > 0 
    ? historicalData.reduce((sum, d) => sum + d.balance, 0) / historicalData.length 
    : currentBalance;
  
  const trend = historicalData.length > 1 
    ? ((currentBalance - historicalData[0].balance) / historicalData[0].balance) * 100 
    : 0;

  // Determinar riesgo
  if (currentBalance < 0) {
    cashFlowRisk = 'high';
    alerts.push({
      type: 'danger' as const,
      message: `Flujo de caja negativo: -$${Math.abs(currentBalance).toLocaleString()}`,
      action: 'Revisar gastos urgentemente y buscar fuentes de ingresos adicionales'
    });
    recommendedActions.push('Implementar plan de recuperación financiera inmediato');
    recommendedActions.push('Reducir gastos no esenciales en 30%');
  } else if (currentBalance < currentIncome * 0.1) {
    cashFlowRisk = 'medium';
    alerts.push({
      type: 'warning' as const,
      message: 'Margen de ganancia muy bajo (menos del 10%)',
      action: 'Optimizar estructura de costos'
    });
    recommendedActions.push('Revisar y optimizar gastos operativos');
  } else {
    alerts.push({
      type: 'info' as const,
      message: `Excelente margen de ganancia: ${((currentBalance/currentIncome)*100).toFixed(1)}%`,
      action: 'Mantener las buenas prácticas financieras'
    });
    recommendedActions.push('Considerar inversión en crecimiento del negocio');
  }

  // Análisis de tendencia
  if (trend > 20) {
    alerts.push({
      type: 'info' as const,
      message: `Crecimiento excepcional: +${trend.toFixed(1)}% vs período anterior`,
      action: 'Analizar factores de éxito para replicar'
    });
    recommendedActions.push('Escalar estrategias exitosas');
  } else if (trend < -15) {
    alerts.push({
      type: 'warning' as const,
      message: `Tendencia decreciente: ${trend.toFixed(1)}% vs período anterior`,
      action: 'Implementar medidas correctivas'
    });
    recommendedActions.push('Analizar causas de la disminución');
  }

  // Predicciones basadas en tendencia
  const growthRate = trend / 100;
  const predictedBalance30Days = currentBalance * (1 + (growthRate * 0.33));
  const predictedBalance60Days = currentBalance * (1 + (growthRate * 0.67));
  const predictedBalance90Days = currentBalance * (1 + growthRate);

  return {
    cashFlowRisk,
    recommendedActions: recommendedActions.length > 0 ? recommendedActions : ['Mantener la estrategia actual'],
    predictedBalance30Days: Math.round(predictedBalance30Days),
    predictedBalance60Days: Math.round(predictedBalance60Days),
    predictedBalance90Days: Math.round(predictedBalance90Days),
    alerts
  };
}

// Función helper para generar años disponibles
export function generateAvailableYears(): string[] {
  const currentYear = new Date().getFullYear();
  return [
    currentYear.toString(),
    (currentYear - 1).toString(),
    (currentYear - 2).toString()
  ];
}