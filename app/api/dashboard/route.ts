import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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

        const totalIncome = incomeTransactions.reduce((sum: number, t: any) => sum + Number(t.amount), 0);
        const totalExpenses = expenseTransactions.reduce((sum: number, t: any) => sum + Number(t.amount), 0);
        const netBalance = totalIncome - totalExpenses;
        const profitMargin = totalIncome > 0 ? ((netBalance / totalIncome) * 100) : 0;

        // Group by category
        const incomeByCategory = groupByCategory(incomeTransactions);
        const expensesByCategory = groupByCategory(expenseTransactions);

        // Generate predictions and alerts
        const predictions = generatePredictions(transactions, netBalance, totalIncome, totalExpenses);

        const dashboardData = {
            totalIncome,
            totalExpenses,
            netBalance,
            profitMargin,
            incomeByCategory,
            expensesByCategory,
            predictions
        };

        return NextResponse.json(dashboardData);
    } catch (error) {
        console.error('Dashboard API error:', error);
        // Return empty data structure instead of error to prevent UI crashes
        return NextResponse.json({
            totalIncome: 0,
            totalExpenses: 0,
            netBalance: 0,
            profitMargin: 0,
            incomeByCategory: [],
            expensesByCategory: [],
            predictions: {
                alerts: [{
                    type: 'warning',
                    message: 'No se pudo conectar a la base de datos',
                    action: 'Verifica la configuración de Vercel'
                }],
                cashFlowRisk: 'medium',
                recommendedActions: ['Configura las variables de entorno en Vercel'],
                predictedBalance30Days: 0
            }
        });
    }
}

// ✅ FUNCIÓN CORREGIDA con tipos explícitos
function groupByCategory(transactions: any[]) {
    const grouped: { [key: string]: number } = transactions.reduce((acc: { [key: string]: number }, transaction: any) => {
        const category = transaction.category;
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += Number(transaction.amount);
        return acc;
    }, {});

    // Ahora TypeScript sabe que son números
    const total = Object.values(grouped).reduce((sum: number, amount: number) => sum + amount, 0);

    return Object.entries(grouped).map(([category, amount]: [string, number]) => ({
        category,
        amount,
        percentage: total > 0 ? ((amount / total) * 100) : 0
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
        predictedBalance30Days: netBalance * 1.1,
        alerts
    };
}

// ✅ FUNCIÓN CORREGIDA - Aquí estaba el problema del spread
function getMonthlyTrends(transactions: any[]) {
    const monthlyGroups = transactions.reduce((acc: any, transaction: any) => {
        const monthKey = transaction.date.toISOString().slice(0, 7);
        if (!acc[monthKey]) {
            acc[monthKey] = { income: 0, expenses: 0, balance: 0 };
        }

        if (transaction.type === 'income') {
            acc[monthKey].income += Number(transaction.amount);
        } else {
            acc[monthKey].expenses += Number(transaction.amount);
        }
        acc[monthKey].balance = acc[monthKey].income - acc[monthKey].expenses;

        return acc;
    }, {});

    // ✅ CAMBIO: En lugar de usar spread, construir objeto explícitamente
    return Object.entries(monthlyGroups).map(([month, data]: [string, any]) => ({
        month: month,
        income: data.income,
        expenses: data.expenses,
        balance: data.balance
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
    if (balance < 0) return 'high';
    if (volatility > balance * 0.3 && growthRate < -10) return 'high';
    if (volatility > balance * 0.2 || growthRate < 0) return 'medium';
    return 'low';
}

function generateSmartRecommendations(monthlyData: any[], currentBalance: number, volatility: number) {
    const recommendations = [];

    if (volatility > currentBalance * 0.25) {
        recommendations.push('Crear un fondo de emergencia del 20% de ingresos mensuales');
        recommendations.push('Diversificar fuentes de ingresos para reducir volatilidad');
    }

    const lastMonthBalance = monthlyData[monthlyData.length - 1]?.balance || 0;
    const previousMonthBalance = monthlyData[monthlyData.length - 2]?.balance || 0;

    if (lastMonthBalance < previousMonthBalance) {
        recommendations.push('Revisar gastos del último mes - hay una tendencia decreciente');
        recommendations.push('Implementar estrategias para incrementar ingresos');
    }

    const expenseCategories = analyzeExpenseGrowth(monthlyData);
    if (expenseCategories.length > 0) {
        recommendations.push(`Revisar gastos en: ${expenseCategories.join(', ')}`);
    }

    return recommendations.length > 0 ? recommendations : ['Mantener la estrategia actual'];
}

function generatePredictiveAlerts(monthlyData: any[], growthRate: number, volatility: number) {
    const alerts = [];

    if (growthRate < -15) {
        alerts.push({
            type: 'danger' as const,
            message: `Tendencia decreciente del ${Math.abs(growthRate).toFixed(1)}% mensual`,
            action: 'Implementar medidas correctivas inmediatamente'
        });
    }

    if (volatility > 20000) {
        alerts.push({
            type: 'warning' as const,
            message: 'Alta variabilidad en flujos de caja',
            action: 'Crear estrategias de estabilización'
        });
    }

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
    return ['Marketing', 'Suministros'];
}