"use client";

import { useState, useEffect } from 'react';
import { DashboardData } from '@/types';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { RecommendationsSection } from '@/components/dashboard/RecommendationsSections';

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
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("10");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [availableYears, setAvailableYears] = useState<string[]>([]); // Años disponibles
  const userId = "user123";

  const selectedDate = `${selectedYear}-${selectedMonth.padStart(2, '0')}`;

  // Obtener años disponibles al cargar la página
  useEffect(() => {
    fetchAvailableYears();
  }, []);

  // Obtener datos cuando cambia mes o año
  useEffect(() => {
    if (availableYears.length > 0) {
      fetchDashboardData();
    }
  }, [selectedMonth, selectedYear, availableYears]);

  const fetchAvailableYears = async () => {
    try {
      const response = await fetch(`/api/available-years?userId=${userId}`);
      const data = await response.json();
      setAvailableYears(data.years);
      
      // Si el año seleccionado no está disponible, usar el más reciente
      if (data.years.length > 0 && !data.years.includes(selectedYear)) {
        setSelectedYear(data.years[0]); // El primer año (más reciente)
      }
    } catch (error) {
      console.error('Error fetching available years:', error);
      // Fallback a años por defecto
      setAvailableYears(['2025']);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard?userId=${userId}&month=${selectedDate}`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ backgroundColor: COLORS.quaternary }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg" style={{ color: COLORS.primary }}>
            Cargando datos financieros...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{
        background: `linear-gradient(135deg, ${COLORS.quaternary} 0%, ${COLORS.tertiary} 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: COLORS.primary }}>
                Dashboard Financiero
              </h1>
              <p style={{ color: COLORS.secondary }}>
                Análisis integral de tu negocio
              </p>
            </div>

            {/* Date Selectors */}
            <div className="flex items-center space-x-3">
              {/* Month Selector */}
              <div className="flex flex-col">
                <label className="text-xs mb-1" style={{ color: COLORS.primary }}>
                  Mes
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                  style={{
                    borderColor: COLORS.tertiary,
                    backgroundColor: COLORS.white,
                    color: COLORS.primary
                  }}
                >
                  <option value="1">Enero</option>
                  <option value="2">Febrero</option>
                  <option value="3">Marzo</option>
                  <option value="4">Abril</option>
                  <option value="5">Mayo</option>
                  <option value="6">Junio</option>
                  <option value="7">Julio</option>
                  <option value="8">Agosto</option>
                  <option value="9">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </select>
              </div>

              {/* Year Selector - Solo años con datos */}
              <div className="flex flex-col">
                <label className="text-xs mb-1" style={{ color: COLORS.primary }}>
                  Año
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                  style={{
                    borderColor: COLORS.tertiary,
                    backgroundColor: COLORS.white,
                    color: COLORS.primary
                  }}
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Current Selection Display */}
              <div className="flex flex-col justify-end">
                <div
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: COLORS.secondary,
                    color: COLORS.white
                  }}
                >
                  {getMonthName(selectedMonth)} {selectedYear}
                </div>
              </div>
            </div>
          </div>
        </div>

        <SummaryCards data={dashboardData} colors={COLORS} />
        <ChartsSection data={dashboardData} colors={COLORS} />
        <RecommendationsSection data={dashboardData} colors={COLORS} />
      </div>
    </div>
  );
}

// Helper function to get month name
function getMonthName(monthNumber: string) {
  const months = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[parseInt(monthNumber)];
}