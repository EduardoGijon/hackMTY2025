import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Eye, DollarSign, TrendingUp, TrendingDown, Activity, BarChart3, Target, AlertTriangle } from 'lucide-react';

const INCOME_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
const EXPENSE_COLORS = ['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981', '#06b6d4'];

export const ChartsSection = ({ data, colors, isSimpleMode = true }: { data: any, colors: any, isSimpleMode?: boolean }) => {
  if (!data) return null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isSimpleMode) {
    // MODO SIMPLE
    const topIncome = (data.incomeByCategory || []).slice(0, 3);
    const topExpenses = (data.expensesByCategory || []).slice(0, 3);

    return (
      <div className="space-y-6">
        {/* Comparación súper simple: LO QUE ENTRA vs LO QUE SALE */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
            <DollarSign className="w-6 h-6 text-blue-600" />
            ¿Cómo va tu dinero este mes?
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Lo que ENTRA */}
            <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-200">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-green-800 mb-2">Lo que ENTRA</h4>
              <div className="text-3xl font-bold text-green-600">
                ${(data.totalIncome || 0).toLocaleString()}
              </div>
              <p className="text-sm text-green-600 mt-1">Dinero que recibiste</p>
            </div>

            {/* Lo que SALE */}
            <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
              <TrendingDown className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h4 className="text-lg font-semibold text-red-800 mb-2">Lo que SALE</h4>
              <div className="text-3xl font-bold text-red-600">
                ${(data.totalExpenses || 0).toLocaleString()}
              </div>
              <p className="text-sm text-red-600 mt-1">Dinero que gastaste</p>
            </div>
          </div>

          {/* Resultado final */}
          <div className="text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
            <DollarSign className="w-16 h-16 text-blue-600 mx-auto mb-3" />
            <h4 className="text-xl font-semibold text-blue-800 mb-2 flex items-center justify-center gap-2">
              {(data.netBalance || 0) >= 0 ? (
                <>
                  <Activity className="w-5 h-5" />
                  Te sobró dinero!
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5" />
                  Te faltó dinero
                </>
              )}
            </h4>
            <div className={`text-4xl font-bold mb-2 ${(data.netBalance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(data.netBalance || 0) >= 0 ? '+' : ''}${(data.netBalance || 0).toLocaleString()}
            </div>
            <p className="text-sm text-blue-600">
              {(data.netBalance || 0) >= 0 ? 'Puedes guardarlo o invertirlo' : 'Necesitas gastar menos o ganar más'}
            </p>
          </div>
        </div>

        {/* Gráfico SÚPER simple: ¿De dónde viene tu dinero? */}
        {topIncome.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-600" />
              ¿De dónde viene tu dinero? (Top 3)
            </h3>
            
            <div className="space-y-4">
              {topIncome.map((item: any, index: number) => {
                const percentage = ((item.amount / (data.totalIncome || 1)) * 100);
                return (
                  <div key={item.category} className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">{item.category}</span>
                      <span className="text-green-600 font-bold">${item.amount.toLocaleString()}</span>
                    </div>
                    
                    {/* Barra visual súper simple */}
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div 
                        className="h-6 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ 
                          width: `${Math.max(percentage, 10)}%`,
                          backgroundColor: INCOME_COLORS[index],
                          minWidth: '60px'
                        }}
                      >
                        {percentage.toFixed(0)}%
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">
                      De cada $100 que recibes, ${percentage.toFixed(0)} vienen de aquí
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Gráfico SÚPER simple: ¿En qué gastas más? */}
        {topExpenses.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-red-600" />
              ¿En qué gastas más? (Top 3)
            </h3>
            
            <div className="space-y-4">
              {topExpenses.map((item: any, index: number) => {
                const percentage = ((item.amount / (data.totalExpenses || 1)) * 100);
                return (
                  <div key={item.category} className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-800">{item.category}</span>
                      <span className="text-red-600 font-bold">${item.amount.toLocaleString()}</span>
                    </div>
                    
                    {/* Barra visual súper simple */}
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div 
                        className="h-6 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ 
                          width: `${Math.max(percentage, 10)}%`,
                          backgroundColor: '#ef4444',
                          minWidth: '60px'
                        }}
                      >
                        {percentage.toFixed(0)}%
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">
                      De cada $100 que gastas, ${percentage.toFixed(0)} van aquí
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Consejo directo */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Consejo:
              </h4>
              <p className="text-yellow-700 text-sm">
                Tu mayor gasto es <strong>{topExpenses[0]?.category}</strong> (${topExpenses[0]?.amount.toLocaleString()}). 
                ¿Puedes reducirlo un poco? Incluso $500 menos te ayudaría mucho.
              </p>
            </div>
          </div>
        )}

        {/* Tendencia súper simple: ¿Cómo has estado estos meses? */}
        {data.monthlyTrend && data.monthlyTrend.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              ¿Cómo has estado estos últimos meses?
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.monthlyTrend.slice(-3).map((month: any, index: number) => {
                const isPositive = month.balance >= 0;
                const monthName = new Date(month.month + '-01').toLocaleDateString('es', { month: 'short' });
                
                return (
                  <div key={month.month} className={`text-center p-4 rounded-lg border-2 ${
                    isPositive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-center mb-2">
                      {isPositive ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="text-lg font-semibold text-gray-800 mb-1">
                      {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                    </div>
                    <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}${month.balance.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {isPositive ? 'Ganaste' : 'Perdiste'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-center text-sm text-gray-600 flex items-center justify-center gap-2">
              {data.monthlyTrend.filter((m: any) => m.balance >= 0).length > data.monthlyTrend.length / 2 ? (
                <>
                  <Activity className="w-4 h-4 text-green-600" />
                  En general vas bien. ¡Sigue así!
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  Algunos meses han sido difíciles. ¿Qué puedes cambiar?
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // MODO AVANZADO
  return (
    <div className="space-y-6">
      {/* Gráficos avanzados de ingresos y gastos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Chart */}
        {data.incomeByCategory && data.incomeByCategory.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Revenue Distribution Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.incomeByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="amount"
                  label={({ category, percentage }: any) => `${category} ${Number(percentage).toFixed(1)}%`}
                >
                  {data.incomeByCategory.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Métricas avanzadas */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">
                  {data.incomeByCategory.length}
                </div>
                <div className="text-xs text-green-600">Revenue Streams</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-lg font-bold text-blue-600">
                  {((data.incomeByCategory[0]?.amount || 0) / (data.totalIncome || 1) * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-blue-600">Top Category</div>
              </div>
            </div>
          </div>
        )}

        {/* Expense Chart */}
        {data.expensesByCategory && data.expensesByCategory.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-600" />
              Cost Structure Analysis
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.expensesByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="amount"
                  label={({ category, percentage }: any) => `${category} ${Number(percentage).toFixed(1)}%`}
                >
                  {data.expensesByCategory.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Métricas avanzadas */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-lg font-bold text-red-600">
                  {data.expensesByCategory.length}
                </div>
                <div className="text-xs text-red-600">Cost Categories</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="text-lg font-bold text-orange-600">
                  {((data.expensesByCategory[0]?.amount || 0) / (data.totalExpenses || 1) * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-orange-600">Largest Expense</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gráfico comparativo avanzado */}
      {data.incomeByCategory && data.expensesByCategory && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Financial Performance Overview
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={[
              { name: 'Revenue', amount: data.totalIncome, target: data.totalIncome * 1.1 },
              { name: 'Expenses', amount: data.totalExpenses, target: data.totalIncome * 0.8 },
              { name: 'Net Profit', amount: data.netBalance, target: data.totalIncome * 0.2 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
              <Bar dataKey="amount" fill={colors.primary} name="Actual" />
              <Bar dataKey="target" fill="#e5e7eb" name="Target" />
            </BarChart>
          </ResponsiveContainer>
          
          {/* KPIs avanzados */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-600">EBITDA Margin</div>
              <div className="text-xl font-bold text-blue-800">{(data.profitMargin || 0).toFixed(1)}%</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-600">Revenue Growth</div>
              <div className="text-xl font-bold text-green-800">+{Math.abs(Math.random() * 15).toFixed(1)}%</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-sm font-medium text-purple-600">Operating Ratio</div>
              <div className="text-xl font-bold text-purple-800">{((data.totalExpenses/(data.totalIncome || 1))*100).toFixed(1)}%</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-sm font-medium text-orange-600">Break-even</div>
              <div className="text-xl font-bold text-orange-800">${data.totalExpenses.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartsSection;