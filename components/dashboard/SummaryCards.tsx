import { Card, CardHeader, CardContent } from '@/components/ui/card'; 
import { DashboardData } from '@/types';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, CheckCircle, Target, BarChart3, PieChart, Calculator, Activity } from 'lucide-react';

interface SummaryCardsProps {
  data: DashboardData;
  colors: any;
  isSimpleMode?: boolean;
}

export function SummaryCards({ data, colors, isSimpleMode = true }: SummaryCardsProps) {
  const isGoodMonth = data.netBalance >= 0;
  const profitPercentage = data.profitMargin || 0;
  const isHealthyMargin = profitPercentage >= 15;
  const efficiencyRatio = data.totalIncome / Math.max(data.totalExpenses, 1);

  if (isSimpleMode) {
    // MODO SIMPLE - Para usuarios de libreta
    return (
      <div className="space-y-6">
        {/* Tarjeta principal súper simple */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardHeader className="text-center pb-6">
            <div className="mb-4">
              {isGoodMonth ? (
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              ) : (
                <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isGoodMonth ? 'Buen mes!' : 'Mes complicado'}
            </h2>
            
            <div className={`text-4xl font-bold mb-3 ${isGoodMonth ? 'text-green-600' : 'text-red-600'}`}>
              {isGoodMonth ? '+' : ''}${data.netBalance.toLocaleString()}
            </div>
            
            <p className="text-lg text-gray-700">
              {isGoodMonth 
                ? `Te sobró dinero este mes`
                : `Gastaste más de lo que ganaste`
              }
            </p>

            {/* Explicación súper simple */}
            <div className="mt-4 p-3 bg-white rounded-lg border">
              <p className="text-sm text-gray-600">
                <strong>En palabras simples:</strong> De cada $100 que ganaste, 
                te quedaron <span className={`font-bold ${isHealthyMargin ? 'text-green-600' : 'text-orange-600'}`}>
                  ${profitPercentage.toFixed(0)}
                </span> para ti
              </p>
              <div className="flex items-center justify-center mt-2">
                {isHealthyMargin ? (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    <span>Eso está muy bien!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-orange-600">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Trata de que sean al menos $15</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tarjetas detalle simples */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="text-center pb-4">
              <TrendingUp className="w-10 h-10 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-green-800 flex items-center justify-center gap-2">
                <DollarSign className="w-5 h-5" />
                Lo que ENTRA
              </h3>
              <p className="text-3xl font-bold text-green-600 mb-2">${data.totalIncome.toLocaleString()}</p>
              <p className="text-sm text-green-700">Todo el dinero que recibiste</p>
              <div className="mt-3 p-2 bg-white rounded text-xs text-green-600 flex items-center justify-center gap-1">
                <Calculator className="w-3 h-3" />
                <span>Son como {Math.round(data.totalIncome / 1000)} billetes de $1,000</span>
              </div>
            </CardHeader>
          </Card>

          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader className="text-center pb-4">
              <TrendingDown className="w-10 h-10 text-red-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-red-800 flex items-center justify-center gap-2">
                <DollarSign className="w-5 h-5" />
                Lo que SALE
              </h3>
              <p className="text-3xl font-bold text-red-600 mb-2">${data.totalExpenses.toLocaleString()}</p>
              <p className="text-sm text-red-700">Todo lo que gastaste</p>
              <div className="mt-3 p-2 bg-white rounded text-xs text-red-600 flex items-center justify-center gap-1">
                <Calculator className="w-3 h-3" />
                <span>Gastaste {((data.totalExpenses / data.totalIncome) * 100).toFixed(0)}% de lo que ganaste</span>
              </div>
            </CardHeader>
          </Card>

          <Card className={`border-2 ${isGoodMonth ? 'border-blue-200 bg-blue-50' : 'border-orange-200 bg-orange-50'}`}>
            <CardHeader className="text-center pb-4">
              <Target className={`w-10 h-10 mx-auto mb-2 ${isGoodMonth ? 'text-blue-600' : 'text-orange-600'}`} />
              <h3 className={`text-lg font-semibold ${isGoodMonth ? 'text-blue-800' : 'text-orange-800'} flex items-center justify-center gap-2`}>
                <Activity className="w-5 h-5" />
                RESULTADO
              </h3>
              <p className={`text-3xl font-bold mb-2 ${isGoodMonth ? 'text-blue-600' : 'text-orange-600'}`}>
                {isGoodMonth ? '+' : ''}${data.netBalance.toLocaleString()}
              </p>
              <p className={`text-sm ${isGoodMonth ? 'text-blue-700' : 'text-orange-700'}`}>
                {isGoodMonth ? 'Te sobró dinero' : 'Te faltó dinero'}
              </p>
              <div className="mt-3 p-2 bg-white rounded text-xs flex items-center justify-center gap-1">
                {isGoodMonth ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-blue-600" />
                    <span className="text-blue-600">Ahórralo o reinviértelo</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-3 h-3 text-orange-600" />
                    <span className="text-orange-600">Gana más o gasta menos</span>
                  </>
                )}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Consejo personalizado */}
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contexto para microempresario */}
              <div>
                <h4 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Para que lo entiendas mejor:
                </h4>
                <div className="space-y-2 text-sm text-purple-700">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Ganaste: <strong>${data.totalIncome.toLocaleString()}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    <span>Gastaste: <strong>${data.totalExpenses.toLocaleString()}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>Tu ganancia real: <strong>${data.netBalance.toLocaleString()}</strong></span>
                  </div>
                  <div className="mt-3 p-2 bg-white rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                      <strong>¿Es bueno?</strong>
                    </div>
                    <p className="text-xs mt-1">
                      {profitPercentage >= 20 ? 'Excelente! Tienes un negocio muy rentable' :
                       profitPercentage >= 10 ? 'Bien, pero puedes mejorar un poco más' :
                       profitPercentage >= 0 ? 'Regular, necesitas optimizar tus gastos' :
                       'Complicado, urgente revisar números'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Siguiente paso */}
              <div>
                <h4 className="text-lg font-semibold text-pink-800 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Tu próximo paso:
                </h4>
                <div className="space-y-3">
                  {profitPercentage < 0 ? (
                    <div className="p-3 bg-red-100 rounded-lg">
                      <div className="flex items-center gap-2 font-medium text-red-800">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Urgente:</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">Revisa tus gastos más grandes y ve cuáles puedes reducir</p>
                    </div>
                  ) : profitPercentage < 10 ? (
                    <div className="p-3 bg-yellow-100 rounded-lg">
                      <div className="flex items-center gap-2 font-medium text-yellow-800">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Mejora:</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">Trata de subir un poco tus precios o reducir gastos</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-green-100 rounded-lg">
                      <div className="flex items-center gap-2 font-medium text-green-800">
                        <CheckCircle className="w-4 h-4" />
                        <span>Sigue así:</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">Ahorra parte de las ganancias para los meses difíciles</p>
                    </div>
                  )}
                  
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <div className="flex items-center gap-2 font-medium text-blue-800">
                      <Activity className="w-4 h-4" />
                      <span>Consejo:</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Compara este mes con el anterior para ver si vas mejorando
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // MODO AVANZADO - Para usuarios con más conocimiento
  return (
    <div className="space-y-6">
      {/* Dashboard ejecutivo */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* KPI Principal */}
        <Card className="lg:col-span-2 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Activity className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Rendimiento del Período</h3>
            </div>
            <div className={`text-5xl font-bold mb-2 ${isGoodMonth ? 'text-green-600' : 'text-red-600'}`}>
              {isGoodMonth ? '+' : ''}${data.netBalance.toLocaleString()}
            </div>
            <p className="text-gray-600">Balance Neto</p>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{profitPercentage.toFixed(1)}%</div>
                <div className="text-sm text-blue-500 flex items-center justify-center gap-1">
                  <PieChart className="w-3 h-3" />
                  Margen de Ganancia
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{efficiencyRatio.toFixed(2)}x</div>
                <div className="text-sm text-purple-500 flex items-center justify-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  Ratio Ingresos/Gastos
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Métricas clave */}
        <Card className="border-l-4 border-green-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">${data.totalIncome.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Ingresos Totales</div>
                <div className="text-xs text-green-600 mt-1 flex items-center justify-end gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Target alcanzado
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="border-l-4 border-red-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <TrendingDown className="w-8 h-8 text-red-600" />
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">${data.totalExpenses.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Gastos Operativos</div>
                <div className="text-xs text-red-600 mt-1 flex items-center justify-end gap-1">
                  <Calculator className="w-3 h-3" />
                  {((data.totalExpenses/data.totalIncome)*100).toFixed(1)}% de ingresos
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Análisis avanzado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Análisis de Rentabilidad */}
        <Card className="border border-green-200">
          <CardHeader>
            <h4 className="font-semibold text-green-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Análisis de Rentabilidad
            </h4>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  ROI Operativo:
                </span>
                <span className="font-medium text-green-600">{((data.netBalance/data.totalExpenses)*100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Eficiencia de Costos:
                </span>
                <span className="font-medium">{(100 - (data.totalExpenses/data.totalIncome)*100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <Calculator className="w-3 h-3" />
                  Break-even Ratio:
                </span>
                <span className="font-medium text-blue-600">{(data.totalExpenses/data.totalIncome).toFixed(3)}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Métricas de Performance */}
        <Card className="border border-blue-200">
          <CardHeader>
            <h4 className="font-semibold text-blue-800 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              KPIs de Performance
            </h4>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  EBITDA Margin:
                </span>
                <span className={`font-medium ${profitPercentage >= 15 ? 'text-green-600' : 'text-orange-600'}`}>
                  {profitPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Operating Leverage:
                </span>
                <span className="font-medium text-purple-600">{efficiencyRatio.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Cash Conversion:
                </span>
                <span className="font-medium text-blue-600 flex items-center gap-1">
                  {data.netBalance >= 0 ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      Positivo
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3" />
                      Negativo
                    </>
                  )}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Predicciones Ejecutivas */}
        <Card className="border border-purple-200">
          <CardHeader>
            <h4 className="font-semibold text-purple-800 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Proyecciones Ejecutivas
            </h4>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Tendencia 30d:
                </span>
                <span className="font-medium text-green-600">
                  ${(data.predictions?.predictedBalance30Days || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Riesgo de Flujo:
                </span>
                <span className={`font-medium text-xs px-2 py-1 rounded flex items-center gap-1 ${
                  data.predictions?.cashFlowRisk === 'low' ? 'bg-green-100 text-green-800' :
                  data.predictions?.cashFlowRisk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  <Activity className="w-3 h-3" />
                  {data.predictions?.cashFlowRisk?.toUpperCase() || 'LOW'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Recomendación:
                </span>
                <span className="font-medium text-blue-600 text-xs flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {profitPercentage >= 15 ? 'EXPANDIR' : profitPercentage >= 5 ? 'OPTIMIZAR' : 'REESTRUCTURAR'}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}