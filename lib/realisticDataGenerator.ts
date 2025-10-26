// CREAR ESTE ARCHIVO NUEVO

import { Transaction } from '@/types';

// Simulación de un negocio de comida/productos típico mexicano
const BUSINESS_PROFILE = {
    name: 'Negocio Típico Mexicano',
    type: 'food_retail', // Comida y productos
    baseMonthlyIncome: 28000,
    baseMonthlyExpenses: 21000,
    location: 'México',
    startDate: new Date('2022-01-01'),
    owner: 'user_demo_123'
};

// Patrones estacionales mexicanos reales
const SEASONAL_PATTERNS = {
    1: 0.65,  // Enero - muy bajo post-navidad
    2: 0.75,  // Febrero - bajo, cuesta de enero
    3: 0.85,  // Marzo - recuperación lenta
    4: 0.95,  // Abril - casi normal
    5: 1.35,  // Mayo - DÍA DE LAS MADRES (muy alto)
    6: 1.05,  // Junio - normal alto
    7: 0.85,  // Julio - bajo, vacaciones de verano
    8: 0.80,  // Agosto - bajo, regreso a clases
    9: 1.15,  // Septiembre - FIESTAS PATRIAS
    10: 1.10, // Octubre - bueno, día de muertos
    11: 1.45, // Noviembre - BUEN FIN, muy alto
    12: 1.70  // Diciembre - NAVIDAD, el más alto del año
};

// Eventos especiales que afectan ingresos por día
const SPECIAL_EVENTS = {
    // Días que aumentan ventas
    high_days: [
        { month: 2, day: 14, multiplier: 1.8, name: 'Día del Amor y la Amistad' },
        { month: 3, day: 8, multiplier: 1.4, name: 'Día de la Mujer' },
        { month: 5, day: 10, multiplier: 2.2, name: 'Día de las Madres' },
        { month: 6, day: 15, multiplier: 1.3, name: 'Día del Padre' },
        { month: 9, day: 15, multiplier: 1.8, name: 'Grito de Independencia' },
        { month: 9, day: 16, multiplier: 1.6, name: 'Día de la Independencia' },
        { month: 11, day: 2, multiplier: 1.5, name: 'Día de Muertos' },
        { month: 12, day: 12, multiplier: 1.7, name: 'Día de la Virgen' },
        { month: 12, day: 24, multiplier: 2.0, name: 'Nochebuena' },
        { month: 12, day: 25, multiplier: 1.5, name: 'Navidad' },
        { month: 12, day: 31, multiplier: 1.8, name: 'Año Nuevo' }
    ],
    // Días que bajan ventas
    low_days: [
        { month: 1, day: 1, multiplier: 0.3, name: 'Año Nuevo' },
        { month: 1, day: 2, multiplier: 0.4, name: 'Post Año Nuevo' },
        { month: 1, day: 6, multiplier: 0.8, name: 'Reyes Magos' }
    ]
};

// Crecimiento del negocio año tras año
const YEARLY_GROWTH = {
    2022: 1.0,    // Año base
    2023: 1.12,   // 12% crecimiento segundo año
    2024: 1.25,   // 25% crecimiento tercer año (acumulativo)
    2025: 1.40    // Proyección 40% (para predicciones)
};

// Categorías de ingresos con pesos realistas
const INCOME_CATEGORIES = [
    { name: 'Main Sales', weight: 0.65, variance: 0.15 },
    { name: 'Complementary Products', weight: 0.20, variance: 0.25 },
    { name: 'Additional Services', weight: 0.10, variance: 0.30 },
    { name: 'Special Promotions', weight: 0.05, variance: 0.40 }
];

// Categorías de gastos con pesos realistas  
const EXPENSE_CATEGORIES = [
    { name: 'Raw Materials', weight: 0.35, fixed: false, variance: 0.20 },
    { name: 'Staff', weight: 0.25, fixed: true, variance: 0.05 },
    { name: 'Rent', weight: 0.15, fixed: true, variance: 0.02 },
    { name: 'Utilities', weight: 0.12, fixed: true, variance: 0.10 },
    { name: 'Marketing', weight: 0.08, fixed: false, variance: 0.50 },
    { name: 'Other Expenses', weight: 0.05, fixed: false, variance: 0.35 }
];

function getDateKey(month: number, day: number): string {
    return `${month}-${day}`;
}

function getSpecialEventMultiplier(month: number, day: number): number {
    const dateKey = getDateKey(month, day);

    // Buscar eventos especiales
    const highEvent = SPECIAL_EVENTS.high_days.find(e => e.month === month && e.day === day);
    if (highEvent) return highEvent.multiplier;

    const lowEvent = SPECIAL_EVENTS.low_days.find(e => e.month === month && e.day === day);
    if (lowEvent) return lowEvent.multiplier;

    return 1.0; // Día normal
}

function getDayOfWeekMultiplier(date: Date): number {
    const dayOfWeek = date.getDay(); // 0 = domingo, 6 = sábado

    // Patrón típico mexicano
    switch (dayOfWeek) {
        case 0: return 0.7;  // Domingo - bajo
        case 1: return 0.85; // Lunes - bajo-medio  
        case 2: return 0.95; // Martes - casi normal
        case 3: return 1.0;  // Miércoles - normal
        case 4: return 1.1;  // Jueves - bueno
        case 5: return 1.25; // Viernes - muy bueno
        case 6: return 1.15; // Sábado - bueno
        default: return 1.0;
    }
}

function generateDailyAmount(
    baseAmount: number,
    category: any,
    date: Date,
    seasonalMultiplier: number,
    yearlyGrowth: number,
    eventMultiplier: number,
    dayOfWeekMultiplier: number
): number {
    // Calcular monto base para la categoría
    const categoryBaseAmount = baseAmount * category.weight;

    // Aplicar todos los multiplicadores
    let finalAmount = categoryBaseAmount
        * seasonalMultiplier
        * yearlyGrowth
        * eventMultiplier
        * dayOfWeekMultiplier;

    // Agregar variación aleatoria controlada
    const variance = category.variance || 0.15;
    const randomFactor = 1 + (Math.random() - 0.5) * variance;
    finalAmount *= randomFactor;

    return Math.max(0, Math.round(finalAmount));
}

function generateTransactionDescription(type: 'income' | 'expense', category: string, date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (type === 'income') {
        const eventMultiplier = getSpecialEventMultiplier(month, day);
        if (eventMultiplier > 1.3) {
            const event = SPECIAL_EVENTS.high_days.find(e => e.month === month && e.day === day);
            return `Special sale - ${event?.name || 'Special event'}`;
        }

        const descriptions = {
            'Main Sales': ['Main product sale', 'Regular customer order', 'Counter sale'],
            'Complementary Products': ['Complementary sale', 'Additional product', 'Special combo'],
            'Additional Services': ['Extra service', 'Consultation', 'Custom service'],
            'Special Promotions': ['Daily offer', 'Special promotion', 'Discount applied']
        };

        const categoryDescriptions = descriptions[category as keyof typeof descriptions] || ['General sale'];
        return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
    } else {
        const descriptions = {
            'Raw Materials': ['Ingredient purchase', 'Main supplies', 'Raw materials'],
            'Staff': ['Payroll payment', 'Employee salary', 'Benefits'],
            'Rent': ['Local rent', 'Rental payment', 'Monthly rent'],
            'Utilities': ['Electricity', 'Water', 'Gas', 'Internet', 'Phone'],
            'Marketing': ['Facebook ads', 'Flyers', 'Promotion'],
            'Other Expenses': ['Unexpected expense', 'Maintenance', 'Miscellaneous']
        };

        const categoryDescriptions = descriptions[category as keyof typeof descriptions] || ['General expense'];
        return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
    }
}

export function generateRealistic3YearData(userId: string = 'user_demo_123'): Transaction[] {
    const transactions: Transaction[] = [];
    let transactionCounter = 1;

    // Generar datos para 3 años (2022, 2023, 2024)
    for (let year = 2022; year <= 2024; year++) {
        const yearlyGrowth = YEARLY_GROWTH[year as keyof typeof YEARLY_GROWTH];

        for (let month = 1; month <= 12; month++) {
            const seasonalMultiplier = SEASONAL_PATTERNS[month as keyof typeof SEASONAL_PATTERNS];
            const daysInMonth = new Date(year, month, 0).getDate();

            // Calcular ingresos y gastos base para este mes
            const monthlyIncomeBase = BUSINESS_PROFILE.baseMonthlyIncome * seasonalMultiplier * yearlyGrowth;
            const monthlyExpensesBase = BUSINESS_PROFILE.baseMonthlyExpenses * yearlyGrowth;

            // Generar transacciones día por día
            for (let day = 1; day <= daysInMonth; day++) {
                const currentDate = new Date(year, month - 1, day);
                const eventMultiplier = getSpecialEventMultiplier(month, day);
                const dayOfWeekMultiplier = getDayOfWeekMultiplier(currentDate);

                // Generar entre 1-4 transacciones de ingresos por día
                const numIncomeTransactions = Math.floor(Math.random() * 4) + 1;

                for (let i = 0; i < numIncomeTransactions; i++) {
                    const category = INCOME_CATEGORIES[Math.floor(Math.random() * INCOME_CATEGORIES.length)];
                    const amount = generateDailyAmount(
                        monthlyIncomeBase / daysInMonth, // Promedio diario
                        category,
                        currentDate,
                        1, // Ya aplicamos seasonal al monthlyIncomeBase
                        1, // Ya aplicamos yearly al monthlyIncomeBase
                        eventMultiplier,
                        dayOfWeekMultiplier
                    );

                    if (amount > 0) {
                        transactions.push({
                            id: `income_${year}_${month}_${day}_${i}_${transactionCounter++}`,
                            userId,
                            type: 'income',
                            category: category.name,
                            amount,
                            description: generateTransactionDescription('income', category.name, currentDate),
                            date: new Date(year, month - 1, day, 8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60)).toISOString(),
                            createdAt: new Date().toISOString()
                        });
                    }
                }

                // Generar gastos (menos frecuentes, algunos días sin gastos)
                const shouldHaveExpenses = Math.random() > 0.3; // 70% de días tienen gastos

                if (shouldHaveExpenses) {
                    const numExpenseTransactions = Math.floor(Math.random() * 3) + 1;

                    for (let i = 0; i < numExpenseTransactions; i++) {
                        const category = EXPENSE_CATEGORIES[Math.floor(Math.random() * EXPENSE_CATEGORIES.length)];
                        const amount = generateDailyAmount(
                            monthlyExpensesBase / 30, // Promedio diario (base 30 días)
                            category,
                            currentDate,
                            1, // Los gastos no son tan estacionales
                            1, // Ya aplicamos yearly
                            1, // Los gastos no se afectan por eventos especiales
                            category.fixed ? 1 : dayOfWeekMultiplier * 0.8 // Gastos fijos no varían por día
                        );

                        if (amount > 0) {
                            transactions.push({
                                id: `expense_${year}_${month}_${day}_${i}_${transactionCounter++}`,
                                userId,
                                type: 'expense',
                                category: category.name,
                                amount,
                                description: generateTransactionDescription('expense', category.name, currentDate),
                                date: new Date(year, month - 1, day, 8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60)).toISOString(),
                                createdAt: new Date().toISOString()
                            });
                        }
                    }
                }
            }
        }
    }

    console.log(`📊 Generated ${transactions.length} realistic transactions over 3 years`);
    console.log(`💰 Income transactions: ${transactions.filter(t => t.type === 'income').length}`);
    console.log(`💸 Expense transactions: ${transactions.filter(t => t.type === 'expense').length}`);

    return transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Función para obtener estadísticas del dataset generado
export function getDatasetStats(transactions: Transaction[]) {
    const years = [...new Set(transactions.map(t => new Date(t.date).getFullYear()))];
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const monthlyStats = [];
    for (let year of years) {
        for (let month = 1; month <= 12; month++) {
            const monthTransactions = transactions.filter(t => {
                const date = new Date(t.date);
                return date.getFullYear() === year && date.getMonth() + 1 === month;
            });

            const monthIncome = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const monthExpenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

            monthlyStats.push({
                year,
                month,
                income: monthIncome,
                expenses: monthExpenses,
                balance: monthIncome - monthExpenses,
                transactions: monthTransactions.length
            });
        }
    }

    return {
        totalTransactions: transactions.length,
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
        years,
        monthlyStats,
        avgMonthlyProfit: monthlyStats.reduce((sum, m) => sum + m.balance, 0) / monthlyStats.length
    };
}