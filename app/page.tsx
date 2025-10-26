"use client";

import { useState, useEffect } from 'react';
import { DashboardData } from '@/types';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import ChartsSection from '@/components/dashboard/ChartsSection';
import RecommendationsSection from '@/components/dashboard/RecommendationsSections';
import ExportButton from '@/components/ui/ExportButton';
import { BookOpen, BarChart3, Circle } from 'lucide-react';
import { generateMockDashboardData, generateAvailableYears } from '@/lib/mockDataGenerator';

const COLORS = {
  primary: "#004879",
  secondary: "#DA1F2C",
  tertiary: "#E8F4F8",
  quaternary: "#F5F5F5",
  white: "#FFFFFF",
  text: {
    dark: "#004879",
    light: "#FFFFFF",
  },
} as const;

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('2024-10');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [isSimpleMode, setIsSimpleMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Generar años disponibles dinámicamente
  const availableYears = generateAvailableYears();

  // Generar meses disponibles
  const generateAvailableMonths = (year: string) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const yearNum = parseInt(year);
    
    const months = [
      { value: '01', label: 'Enero' },
      { value: '02', label: 'Febrero' },
      { value: '03', label: 'Marzo' },
      { value: '04', label: 'Abril' },
      { value: '05', label: 'Mayo' },
      { value: '06', label: 'Junio' },
      { value: '07', label: 'Julio' },
      { value: '08', label: 'Agosto' },
      { value: '09', label: 'Septiembre' },
      { value: '10', label: 'Octubre' },
      { value: '11', label: 'Noviembre' },
      { value: '12', label: 'Diciembre' }
    ];

    // Si es el año actual, solo mostrar hasta el mes actual
    if (yearNum === currentYear) {
      return months.slice(0, currentMonth);
    }
    
    return months;
  };

  const availableMonths = generateAvailableMonths(selectedYear);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Simular un pequeño delay para mostrar el loading
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Parsear año y mes seleccionados
        const year = parseInt(selectedYear);
        const month = parseInt(selectedMonth.split('-')[1]);
        
        // Generar datos usando el mock generator
        const mockData = generateMockDashboardData(
          'user_demo_123', // ID de usuario demo
          year,
          month,
          true // incluir datos históricos
        );

        // Convertir al formato esperado por DashboardData
        const dashboardData: DashboardData = {
          totalIncome: mockData.totalIncome,
          totalExpenses: mockData.totalExpenses,
          netBalance: mockData.netBalance,
          profitMargin: mockData.profitMargin,
          incomeByCategory: mockData.incomeByCategory,
          expensesByCategory: mockData.expensesByCategory,
          monthlyTrend: mockData.monthlyTrend,
          predictions: mockData.predictions
        };

        setDashboardData(dashboardData);
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // En caso de error, usar datos de fallback
        setDashboardData({
          totalIncome: 0,
          totalExpenses: 0,
          netBalance: 0,
          profitMargin: 0,
          incomeByCategory: [],
          expensesByCategory: [],
          monthlyTrend: [],
          predictions: {
            predictedBalance30Days: 0,
            predictedBalance60Days: 0,
            predictedBalance90Days: 0,
            cashFlowRisk: 'low',
            recommendedActions: ['No hay datos disponibles'],
            alerts: []
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedMonth, selectedYear]);

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.tertiary }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generando datos para {selectedMonth}...</p>
          <p className="mt-2 text-sm text-gray-500">
            {isSimpleMode ? 'Preparando vista simple' : 'Preparando análisis avanzado'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.tertiary }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header con Toggle */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Título y descripción */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.primary }}>
                Dashboard Financiero
              </h1>
              <p className="text-gray-600">
                {isSimpleMode ? 'Análisis simple de tu negocio' : 'Análisis integral de tu negocio'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Mostrando datos de {availableMonths.find(m => m.value === selectedMonth.split('-')[1])?.label} {selectedYear}
              </p>
            </div>

            {/* Toggle Simple/Avanzado */}
            <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-3 border">
              <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isSimpleMode ? 'text-blue-600' : 'text-gray-500'
              }`}>
                <BookOpen className="w-4 h-4" />
                <span>Simple</span>
              </div>
              
              <button
                onClick={() => setIsSimpleMode(!isSimpleMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isSimpleMode ? 'bg-blue-600' : 'bg-gray-400'
                }`}
                aria-label="Toggle modo simple/avanzado"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isSimpleMode ? 'translate-x-1' : 'translate-x-6'
                  }`}
                />
              </button>
              
              <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                !isSimpleMode ? 'text-blue-600' : 'text-gray-500'
              }`}>
                <BarChart3 className="w-4 h-4" />
                <span>Avanzado</span>
              </div>
            </div>

            {/* Selectores de fecha */}
            <div className="flex items-center space-x-3">
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  // Resetear mes si el año cambia
                  const newMonths = generateAvailableMonths(e.target.value);
                  const currentSelectedMonth = selectedMonth.split('-')[1];
                  const monthExists = newMonths.some(m => m.value === currentSelectedMonth);
                  if (!monthExists) {
                    setSelectedMonth(`${e.target.value}-${newMonths[newMonths.length - 1].value}`);
                  } else {
                    setSelectedMonth(`${e.target.value}-${currentSelectedMonth}`);
                  }
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableMonths.map(month => (
                  <option key={month.value} value={`${selectedYear}-${month.value}`}>
                    {month.label}
                  </option>
                ))}
              </select>

              <ExportButton data={dashboardData} />
            </div>
          </div>

          {/* Indicador de modo activo */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Circle className={`w-2 h-2 fill-current ${isSimpleMode ? 'text-green-500' : 'text-blue-500'}`} />
              <span>
                Modo activo: <strong>{isSimpleMode ? 'Simple' : 'Avanzado'}</strong>
              </span>
              <span className="text-gray-400">•</span>
              <span>
                {isSimpleMode 
                  ? 'Perfecto para microempresarios que usan libreta' 
                  : 'Análisis profesional con KPIs y métricas avanzadas'
                }
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-xs">
                Datos generados: {dashboardData.incomeByCategory.length + dashboardData.expensesByCategory.length} transacciones
              </span>
            </div>
          </div>
        </div>

        {/* Componentes del Dashboard */}
        <div className="space-y-8">
          {/* Summary Cards */}
          <SummaryCards 
            data={dashboardData} 
            colors={COLORS} 
            isSimpleMode={isSimpleMode} 
          />

          {/* Charts Section */}
          <ChartsSection 
            data={dashboardData} 
            colors={COLORS} 
            isSimpleMode={isSimpleMode} 
          />

          {/* Recommendations Section */}
          <RecommendationsSection 
            data={dashboardData} 
            colors={COLORS} 
            isSimpleMode={isSimpleMode} 
          />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Dashboard Pulso • {isSimpleMode ? 'Modo Simple' : 'Modo Avanzado'} • 
            Datos generados para {availableMonths.find(m => m.value === selectedMonth.split('-')[1])?.label} {selectedYear}
          </p>
          <p className="mt-1 text-xs">
            Balance: ${dashboardData.netBalance.toLocaleString()} • 
            Margen: {dashboardData.profitMargin.toFixed(1)}% • 
            Riesgo: {dashboardData.predictions.cashFlowRisk.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}