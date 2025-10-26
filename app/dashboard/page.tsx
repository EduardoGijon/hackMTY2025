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
  const [selectedMonth, setSelectedMonth] = useState("2025-10");
  const userId = "user123"; // Get from auth context

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard?userId=${userId}&month=${selectedMonth}`);
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

            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border rounded-lg"
                style={{
                  borderColor: COLORS.tertiary,
                  backgroundColor: COLORS.white,
                  color: COLORS.primary
                }}
              >
                <option value="2025-10">Octubre 2025</option>
                <option value="2025-09">Septiembre 2025</option>
                <option value="2025-08">Agosto 2025</option>
              </select>
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