import React from 'react';
import { Download, FileText, Mail } from 'lucide-react';
import { DashboardData } from '@/types';

interface ExportButtonProps {
    data: DashboardData;
    dashboardData: any;
    selectedMonth: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ dashboardData, selectedMonth }) => {
    const generateReport = () => {
        if (!dashboardData) return;

        const reportText = `
REPORTE FINANCIERO - ${selectedMonth}
=====================================

RESUMEN EJECUTIVO:
- Ingresos Totales: $${dashboardData.totalIncome?.toLocaleString() || '0'}
- Gastos Totales: $${dashboardData.totalExpenses?.toLocaleString() || '0'}
- Balance Neto: $${dashboardData.netBalance?.toLocaleString() || '0'}
- Margen de Ganancia: ${dashboardData.profitMargin?.toFixed(1) || '0'}%

PREDICCIONES:
- Riesgo de Flujo de Caja: ${dashboardData.predictions?.cashFlowRisk || 'N/A'}
- Proyección 30 días: $${dashboardData.predictions?.predictedBalance30Days?.toLocaleString() || '0'}
- Proyección 60 días: $${dashboardData.predictions?.predictedBalance60Days?.toLocaleString() || '0'}
- Proyección 90 días: $${dashboardData.predictions?.predictedBalance90Days?.toLocaleString() || '0'}

RECOMENDACIONES:
${dashboardData.predictions?.recommendedActions?.map((action: string, i: number) => `${i + 1}. ${action}`).join('\n') || 'No hay recomendaciones'}

Generado con Pulso Analytics
    `;

        const blob = new Blob([reportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-financiero-${selectedMonth}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={generateReport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={!dashboardData}
        >
            <Download className="w-4 h-4" />
            Export
        </button>
    );
};

export default ExportButton;