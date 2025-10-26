import { Card, CardHeader, CardContent } from '@/components/ui/card'; 
import { DashboardData } from '@/types';

interface SummaryCardsProps {
  data: DashboardData;
  colors: any;
}

export function SummaryCards({ data, colors }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card style={{ backgroundColor: colors.white, borderColor: colors.tertiary }}>
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold" style={{ color: colors.primary }}>
            Ingresos Totales
          </h3>
          <p className="text-2xl font-bold" style={{ color: colors.secondary }}>
            ${data.totalIncome.toLocaleString()}
          </p>
        </CardHeader>
      </Card>

      <Card style={{ backgroundColor: colors.white, borderColor: colors.tertiary }}>
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold" style={{ color: colors.primary }}>
            Gastos Totales
          </h3>
          <p className="text-2xl font-bold" style={{ color: colors.secondary }}>
            ${data.totalExpenses.toLocaleString()}
          </p>
        </CardHeader>
      </Card>

      <Card style={{ backgroundColor: colors.white, borderColor: colors.tertiary }}>
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold" style={{ color: colors.primary }}>
            Balance Neto
          </h3>
          <p 
            className="text-2xl font-bold"
            style={{ 
              color: data.netBalance >= 0 ? '#10B981' : colors.secondary 
            }}
          >
            ${data.netBalance.toLocaleString()}
          </p>
          <p className="text-sm" style={{ color: colors.primary }}>
            Margen: {data.profitMargin.toFixed(1)}%
          </p>
        </CardHeader>
      </Card>
    </div>
  );
}