import { Card, CardHeader, CardContent } from '../ui/card';
import { DashboardData } from '../../types';

interface ChartsSectionProps {
  data: DashboardData;
  colors: any;
}

export function ChartsSection({ data, colors }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Income Chart */}
      <Card style={{ backgroundColor: colors.white, borderColor: colors.tertiary }}>
        <CardHeader>
          <h3 className="text-xl font-semibold" style={{ color: colors.primary }}>
            Ingresos por Categoría
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.incomeByCategory.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: getColor(index, colors)
                    }}
                  />
                  <span style={{ color: colors.text.dark }}>{item.category}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold" style={{ color: colors.primary }}>
                    ${item.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expenses Chart */}
      <Card style={{ backgroundColor: colors.white, borderColor: colors.tertiary }}>
        <CardHeader>
          <h3 className="text-xl font-semibold" style={{ color: colors.primary }}>
            Gastos por Categoría
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.expensesByCategory.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: getExpenseColor(index, colors)
                    }}
                  />
                  <span style={{ color: colors.text.dark }}>{item.category}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold" style={{ color: colors.secondary }}>
                    ${item.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getColor(index: number, colors: any) {
  const colorOptions = [
    colors.primary,
    colors.secondary,
    '#10B981',
    '#F59E0B',
    '#8B5CF6'
  ];
  return colorOptions[index % colorOptions.length];
}

function getExpenseColor(index: number, colors: any) {
  const colorOptions = [
    colors.secondary,
    '#EF4444',
    '#F97316',
    '#84CC16',
    '#06B6D4'
  ];
  return colorOptions[index % colorOptions.length];
}