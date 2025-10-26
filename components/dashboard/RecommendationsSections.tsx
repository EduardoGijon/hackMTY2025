import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle, DollarSign, Target, Lightbulb, Activity, BarChart3, Calculator, PieChart, Zap, Shield, TrendingUpIcon } from 'lucide-react';

export const RecommendationsSection = ({ data, colors, isSimpleMode = true }: { data: any, colors: any, isSimpleMode?: boolean }) => {
  if (!data) return null;

  const profit = data.netBalance || 0;
  const isGoodMonth = profit > 0;
  const profitPercentage = data.profitMargin || 0;
  const efficiencyRatio = data.totalIncome / Math.max(data.totalExpenses, 1);

  if (isSimpleMode) {
    // MODO SIMPLE
    return (
      <div className="space-y-6">
        {/* Resumen súper simple */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="text-center">
            <div className="mb-4">
              {isGoodMonth ? (
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              ) : (
                <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isGoodMonth ? 'Buen mes!' : 'Mes regular'}
            </h2>
            
            <p className="text-lg text-gray-600 mb-6">
              {isGoodMonth 
                ? `Ganaste $${profit.toLocaleString()} este mes`
                : `Perdiste $${Math.abs(profit).toLocaleString()} este mes`
              }
            </p>

            {/* Predicción simple */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5" />
                ¿Cómo va el próximo mes?
              </h3>
              <p className="text-blue-700">
                Si sigues así, el próximo mes tendrás aproximadamente{' '}
                <span className="font-bold">
                  ${(data.predictions?.predictedBalance30Days || 0).toLocaleString()}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Consejos en lenguaje simple */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            Consejos para tu negocio
          </h3>
          
          <div className="space-y-4">
            {profitPercentage < 10 ? (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Tip: Gana más dinero
                </h4>
                <p className="text-orange-700">
                  Por cada $100 que entra, solo te quedan ${profitPercentage.toFixed(0)}. 
                  Trata de que te queden al menos $20 de cada $100.
                </p>
                <p className="text-sm text-orange-600 mt-2 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <strong>¿Cómo?</strong> Sube un poquito los precios o busca gastos que puedas reducir.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Excelente!
                </h4>
                <p className="text-green-700">
                  De cada $100 que entra, te quedan ${profitPercentage.toFixed(0)}. 
                  ¡Eso está muy bien!
                </p>
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  <strong>Consejo:</strong> Guarda un poco para los meses difíciles.
                </p>
              </div>
            )}

            {/* Consejos simples */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Revisa tus números
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    ¿En qué gastas más?
                  </li>
                  <li className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    ¿Qué te da más dinero?
                  </li>
                  <li className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    ¿Puedes cobrar más?
                  </li>
                </ul>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Para el próximo mes
                </h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                    Anota todo lo que gastes
                  </li>
                  <li className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                    Busca más clientes
                  </li>
                  <li className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                    Ahorra un poquito
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Comparación simple */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Tu negocio vs. tu libreta
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-gray-600" />
                Antes (con libreta):
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  No sabías si ganabas o perdías
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  Te preocupabas por el dinero
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  Era difícil planear
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Ahora (con Pulso):
              </h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  Sabes exactamente cómo vas
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  Puedes tomar mejores decisiones
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  Sabes qué esperar el próximo mes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MODO AVANZADO
  const getPerformanceColor = (value: number, threshold: { good: number; warning: number }) => {
    if (value >= threshold.good) return 'text-green-600 bg-green-50 border-green-200';
    if (value >= threshold.warning) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Panel de predicciones avanzadas */}
      {data?.predictions && (
        <div className="space-y-6">
          {/* Risk Assessment */}
          <div className={`rounded-xl border-2 p-6 ${
            data.predictions.cashFlowRisk === 'low' ? 'text-green-600 bg-green-50 border-green-200' :
            data.predictions.cashFlowRisk === 'medium' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
            'text-red-600 bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              {data.predictions.cashFlowRisk === 'low' ? (
                <CheckCircle className="w-5 h-5" />
              ) : data.predictions.cashFlowRisk === 'medium' ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <h3 className="text-lg font-semibold">
                Cash Flow Risk Assessment: {
                  data.predictions.cashFlowRisk === 'low' ? 'Low Risk' : 
                  data.predictions.cashFlowRisk === 'medium' ? 'Medium Risk' : 'High Risk'
                }
              </h3>
            </div>
          </div>

          {/* Predictions Timeline */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUpIcon className="w-5 h-5 text-blue-500" />
              Financial Projections & Forecasting
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  ${(data.predictions.predictedBalance30Days || 0).toLocaleString()}
                </div>
                <div className="text-sm text-blue-500 mt-1">30-Day Projection</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  ${(data.predictions.predictedBalance60Days || 0).toLocaleString()}
                </div>
                <div className="text-sm text-blue-500 mt-1">60-Day Projection</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  ${(data.predictions.predictedBalance90Days || 0).toLocaleString()}
                </div>
                <div className="text-sm text-blue-500 mt-1">90-Day Projection</div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {data.predictions.alerts && data.predictions.alerts.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                Smart Business Alerts
              </h3>
              <div className="space-y-3">
                {data.predictions.alerts.map((alert: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                    {alert.type === 'info' && <CheckCircle className="w-4 h-4 text-blue-500" />}
                    {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                    {alert.type === 'danger' && <XCircle className="w-4 h-4 text-red-500" />}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{alert.message}</div>
                      <div className="text-sm text-gray-600 mt-1">{alert.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Análisis de rendimiento avanzado */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Advanced Performance Analytics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* EBITDA Margin */}
          <div className={`p-4 rounded-lg border-2 ${getPerformanceColor(profitPercentage, { good: 20, warning: 10 })}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">EBITDA Margin</div>
                <div className="text-2xl font-bold">{profitPercentage.toFixed(1)}%</div>
              </div>
              <Calculator className="w-8 h-8 opacity-60" />
            </div>
            <div className="text-xs mt-2">
              {profitPercentage >= 20 ? 'Excellent' : profitPercentage >= 10 ? 'Good' : 'Needs Improvement'}
            </div>
          </div>

          {/* Operating Efficiency */}
          <div className={`p-4 rounded-lg border-2 ${getPerformanceColor(efficiencyRatio, { good: 1.5, warning: 1.1 })}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Operating Efficiency</div>
                <div className="text-2xl font-bold">{efficiencyRatio.toFixed(2)}x</div>
              </div>
              <PieChart className="w-8 h-8 opacity-60" />
            </div>
            <div className="text-xs mt-2">
              {efficiencyRatio >= 1.5 ? 'Excellent' : efficiencyRatio >= 1.1 ? 'Good' : 'Critical'}
            </div>
          </div>

          {/* Cash Flow Health */}
          <div className="p-4 rounded-lg border-2 text-blue-600 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Cash Flow Health</div>
                <div className="text-2xl font-bold">
                  {data.predictions?.cashFlowRisk === 'low' ? 'Strong' : 
                   data.predictions?.cashFlowRisk === 'medium' ? 'Stable' : 'Weak'}
                </div>
              </div>
              <Shield className="w-8 h-8 opacity-60" />
            </div>
            <div className="text-xs mt-2">
              Based on trend analysis
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          Strategic Business Recommendations
        </h3>
        
        <div className="space-y-4">
          {/* Recomendaciones basadas en datos */}
          {profitPercentage < 10 && (
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <div className="font-medium text-red-800">Optimize Profit Margins</div>
                <div className="text-sm text-red-600 mt-1">
                  Current margin ({profitPercentage.toFixed(1)}%) is below industry standards. 
                  Consider implementing cost optimization strategies and pricing reviews.
                </div>
              </div>
            </div>
          )}

          {profitPercentage >= 20 && (
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-800">Excellent Performance</div>
                <div className="text-sm text-green-600 mt-1">
                  Profit margin ({profitPercentage.toFixed(1)}%) exceeds benchmarks. 
                  Consider reinvestment opportunities for sustainable growth.
                </div>
              </div>
            </div>
          )}

          {/* Recomendaciones estratégicas */}
          {data.predictions?.recommendedActions && data.predictions.recommendedActions.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                AI-Powered Insights
              </h4>
              {data.predictions.recommendedActions.slice(0, 3).map((action: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-600 mt-0.5">
                    {index === 0 && <Target className="w-4 h-4" />}
                    {index === 1 && <Lightbulb className="w-4 h-4" />}
                    {index === 2 && <DollarSign className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-blue-800 font-medium">Strategic Action {index + 1}</div>
                    <div className="text-blue-600 text-sm mt-1">{action}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-600" />
          Executive Summary & Next Steps
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium">Short-term Priorities (1-4 weeks)</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Review high-impact expense categories
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Optimize operational workflows
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Identify revenue growth opportunities
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Medium-term Goals (1-3 months)</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li className="flex items-center gap-2">
                <Target className="w-3 h-3 text-blue-500" />
                Implement growth strategies
              </li>
              <li className="flex items-center gap-2">
                <Target className="w-3 h-3 text-blue-500" />
                Diversify revenue streams
              </li>
              <li className="flex items-center gap-2">
                <Target className="w-3 h-3 text-blue-500" />
                Build financial reserves
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsSection;