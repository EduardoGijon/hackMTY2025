"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  ChevronDown,
} from "lucide-react";

// Color palette constants - Capital One Theme
const COLORS = {
  primary: "#004879", // Deep Blue - Azul oscuro Capital One
  secondary: "#DA1F2C", // Card Red - Rojo distintivo Capital One
  tertiary: "#E8F4F8", // Light Blue - Azul claro complementario
  quaternary: "#F5F5F5", // Light Gray - Gris claro neutro
  white: "#FFFFFF",
  text: {
    dark: "#004879",
    light: "#FFFFFF",
  },
} as const;

// Mock data for income
const incomeData = [
  { category: "Ventas", monto: 45000 },
  { category: "Servicios", monto: 32000 },
  { category: "Consultoría", monto: 28000 },
  { category: "Comisiones", monto: 15000 },
  { category: "Otros", monto: 8000 },
];

// Mock data for expenses
const expensesData = [
  { category: "Nómina", monto: 35000 },
  { category: "Alquiler", monto: 12000 },
  { category: "Marketing", monto: 18000 },
  { category: "Suministros", monto: 8500 },
  { category: "Servicios", monto: 6500 },
];

// Calculate totals
const totalIncome = incomeData.reduce((sum, item) => sum + item.monto, 0);
const totalExpenses = expensesData.reduce((sum, item) => sum + item.monto, 0);
const netBalance = totalIncome - totalExpenses;
const profitMargin = ((netBalance / totalIncome) * 100).toFixed(1);

// Generate last 12 months
const generateMonths = () => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return Array.from({ length: 12 }, (_, i) => {
    const monthIndex = (currentMonth - i + 12) % 12;
    const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
    return {
      label: `${months[monthIndex]} ${year}`,
      value: `${year}-${String(monthIndex + 1).padStart(2, "0")}`,
    };
  });
};

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState("Octubre 2025");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const months = generateMonths();

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
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: COLORS.primary }}
              >
                Dashboard Financiero
              </h1>
              <p style={{ color: COLORS.primary }}>
                Análisis de ingresos, gastos y recomendaciones
              </p>
            </div>

            {/* Month Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90 transition-colors shadow-sm"
                style={{
                  backgroundColor: COLORS.secondary,
                  color: COLORS.white,
                }}
              >
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">{selectedMonth}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
                  style={{ borderColor: COLORS.tertiary }}
                >
                  {months.map((month) => (
                    <button
                      key={month.value}
                      onClick={() => {
                        setSelectedMonth(month.label);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:opacity-80 transition-colors ${
                        selectedMonth === month.label ? "font-medium" : ""
                      }`}
                      style={{
                        backgroundColor:
                          selectedMonth === month.label
                            ? COLORS.tertiary
                            : "transparent",
                        color:
                          selectedMonth === month.label
                            ? COLORS.primary
                            : "#666",
                      }}
                    >
                      {month.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            style={{
              backgroundColor: COLORS.white,
              borderColor: COLORS.tertiary,
            }}
          >
            <CardHeader className="pb-3">
              <CardDescription style={{ color: COLORS.secondary }}>
                Ingresos Totales
              </CardDescription>
              <CardTitle
                className="flex items-center gap-2 text-2xl"
                style={{ color: COLORS.primary }}
              >
                <TrendingUp className="w-5 h-5" />$
                {totalIncome.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card
            style={{
              backgroundColor: COLORS.white,
              borderColor: COLORS.tertiary,
            }}
          >
            <CardHeader className="pb-3">
              <CardDescription style={{ color: COLORS.secondary }}>
                Gastos Totales
              </CardDescription>
              <CardTitle
                className="flex items-center gap-2 text-2xl"
                style={{ color: COLORS.secondary }}
              >
                <TrendingDown className="w-5 h-5" />$
                {totalExpenses.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card
            style={{
              backgroundColor: COLORS.white,
              borderColor: COLORS.tertiary,
            }}
          >
            <CardHeader className="pb-3">
              <CardDescription style={{ color: COLORS.secondary }}>
                Balance Neto
              </CardDescription>
              <CardTitle
                className="flex items-center gap-2 text-2xl"
                style={{
                  color: netBalance >= 0 ? COLORS.primary : COLORS.secondary,
                }}
              >
                {netBalance >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                ${netBalance.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Income Chart */}
          <Card
            style={{
              backgroundColor: COLORS.white,
              borderColor: COLORS.tertiary,
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: COLORS.primary }}>
                Ingresos por Categoría
              </CardTitle>
              <CardDescription style={{ color: COLORS.secondary }}>
                Desglose de fuentes de ingresos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={incomeData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={COLORS.tertiary}
                  />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={100} />
                  <Tooltip
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    contentStyle={{
                      borderRadius: "8px",
                      backgroundColor: COLORS.quaternary,
                      borderColor: COLORS.tertiary,
                      color: COLORS.primary,
                    }}
                  />
                  <Bar
                    dataKey="monto"
                    fill={COLORS.primary}
                    radius={[0, 8, 8, 0]}
                  >
                    {incomeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index % 2 === 0 ? COLORS.primary : COLORS.secondary
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Expenses Chart */}
          <Card
            style={{
              backgroundColor: COLORS.white,
              borderColor: COLORS.tertiary,
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: COLORS.primary }}>
                Gastos por Categoría
              </CardTitle>
              <CardDescription style={{ color: COLORS.secondary }}>
                Desglose de gastos operativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={expensesData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={COLORS.tertiary}
                  />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={100} />
                  <Tooltip
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    contentStyle={{
                      borderRadius: "8px",
                      backgroundColor: COLORS.quaternary,
                      borderColor: COLORS.tertiary,
                      color: COLORS.primary,
                    }}
                  />
                  <Bar
                    dataKey="monto"
                    fill={COLORS.primary}
                    radius={[0, 8, 8, 0]}
                  >
                    {expensesData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index % 2 === 0 ? COLORS.primary : COLORS.secondary
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary and Warnings Section */}
        <Card
          style={{
            backgroundColor: COLORS.white,
            borderColor: COLORS.tertiary,
          }}
        >
          <CardHeader>
            <CardTitle
              className="flex items-center gap-2"
              style={{ color: COLORS.primary }}
            >
              <AlertTriangle className="w-5 h-5" />
              Resumen y Advertencias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert
              style={{
                backgroundColor: COLORS.primary,
                border: "none",
              }}
            >
              <AlertTitle style={{ color: COLORS.white }}>
                Resumen del Período
              </AlertTitle>
              <AlertDescription style={{ color: COLORS.white }}>
                Durante este período, se han registrado ingresos totales de{" "}
                <strong>${totalIncome.toLocaleString()}</strong> con gastos de{" "}
                <strong>${totalExpenses.toLocaleString()}</strong>, resultando
                en un balance neto
                {netBalance >= 0 ? " positivo " : " negativo "}
                de <strong>${Math.abs(netBalance).toLocaleString()}</strong>. El
                margen de beneficio es del <strong>{profitMargin}%</strong>.
              </AlertDescription>
            </Alert>

            {netBalance < 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Advertencia: Balance Negativo</AlertTitle>
                <AlertDescription>
                  Los gastos superan a los ingresos. Se requiere acción
                  inmediata para reducir costos o aumentar ingresos.
                </AlertDescription>
              </Alert>
            )}

            {expensesData[0].monto > totalIncome * 0.3 && (
              <Alert
                style={{
                  backgroundColor: COLORS.primary,
                  border: "none",
                }}
              >
                <AlertTriangle
                  className="h-4 w-4"
                  style={{ color: COLORS.white }}
                />
                <AlertTitle style={{ color: COLORS.white }}>
                  Atención: Nómina Elevada
                </AlertTitle>
                <AlertDescription style={{ color: COLORS.white }}>
                  El gasto en nómina representa más del 30% de los ingresos
                  totales. Considere revisar la eficiencia operativa.
                </AlertDescription>
              </Alert>
            )}

            <Alert
              style={{
                backgroundColor: COLORS.secondary,
                border: "none",
              }}
            >
              <AlertTitle style={{ color: COLORS.white }}>
                Análisis de Categorías
              </AlertTitle>
              <AlertDescription style={{ color: COLORS.white }}>
                La principal fuente de ingresos es{" "}
                <strong>{incomeData[0].category}</strong> ($
                {incomeData[0].monto.toLocaleString()}). El mayor gasto es{" "}
                <strong>{expensesData[0].category}</strong> ($
                {expensesData[0].monto.toLocaleString()}).
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Recommendations Section */}
        <Card
          style={{
            backgroundColor: COLORS.white,
            borderColor: COLORS.tertiary,
          }}
        >
          <CardHeader>
            <CardTitle
              className="flex items-center gap-2"
              style={{ color: COLORS.primary }}
            >
              <Lightbulb className="w-5 h-5" />
              Recomendaciones
            </CardTitle>
            <CardDescription style={{ color: COLORS.secondary }}>
              Acciones sugeridas para mejorar el rendimiento financiero
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className="flex gap-3 p-4 rounded-lg"
                style={{
                  backgroundColor: COLORS.primary,
                }}
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold"
                  style={{
                    backgroundColor: COLORS.white,
                    color: COLORS.primary,
                  }}
                >
                  1
                </div>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ color: COLORS.white }}
                  >
                    Diversificar Fuentes de Ingresos
                  </h3>
                  <p className="text-sm" style={{ color: COLORS.white }}>
                    Aunque las ventas son la principal fuente de ingresos,
                    considere aumentar los ingresos de servicios y consultoría
                    para reducir la dependencia de una sola fuente.
                  </p>
                </div>
              </div>

              <div
                className="flex gap-3 p-4 rounded-lg"
                style={{
                  backgroundColor: COLORS.secondary,
                }}
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold"
                  style={{
                    backgroundColor: COLORS.primary,
                    color: COLORS.white,
                  }}
                >
                  2
                </div>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ color: COLORS.white }}
                  >
                    Optimizar Gastos de Marketing
                  </h3>
                  <p className="text-sm" style={{ color: COLORS.white }}>
                    Los gastos de marketing ($18,000) son significativos.
                    Analice el ROI de cada canal y reasigne el presupuesto hacia
                    las estrategias más efectivas.
                  </p>
                </div>
              </div>

              <div
                className="flex gap-3 p-4 rounded-lg"
                style={{
                  backgroundColor: COLORS.primary,
                }}
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold"
                  style={{
                    backgroundColor: COLORS.white,
                    color: COLORS.primary,
                  }}
                >
                  3
                </div>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ color: COLORS.white }}
                  >
                    Revisar Contratos de Servicios
                  </h3>
                  <p className="text-sm" style={{ color: COLORS.white }}>
                    Evalúe los contratos de servicios y suministros para
                    identificar oportunidades de negociación o cambio a
                    proveedores más económicos.
                  </p>
                </div>
              </div>

              <div
                className="flex gap-3 p-4 rounded-lg"
                style={{
                  backgroundColor: COLORS.primary,
                }}
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold"
                  style={{
                    backgroundColor: COLORS.white,
                    color: COLORS.primary,
                  }}
                >
                  4
                </div>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ color: COLORS.white }}
                  >
                    Establecer Metas de Crecimiento
                  </h3>
                  <p className="text-sm" style={{ color: COLORS.white }}>
                    Con un margen de beneficio del {profitMargin}%, establezca
                    objetivos para alcanzar un margen del 40-50% mediante el
                    aumento de ingresos y la optimización de costos.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
