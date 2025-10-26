import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Prediction {
  cashFlowRisk: 'low' | 'medium' | 'high';
  recommendedActions: string[];
  predictedBalance30Days: number;
  predictedBalance60Days: number;
  predictedBalance90Days: number;
  alerts: Array<{
    type: 'info' | 'warning' | 'danger';
    message: string;
    action: string;
  }>;
}

interface PredictionsPanelProps {
  predictions: Prediction;
}

const PredictionsPanel: React.FC<PredictionsPanelProps> = ({ predictions }) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return <CheckCircle className="w-5 h-5" />;
      case 'medium': return <AlertTriangle className="w-5 h-5" />;
      case 'high': return <XCircle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'danger': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Assessment */}
      <div className={`rounded-xl border-2 p-6 ${getRiskColor(predictions.cashFlowRisk)}`}>
        <div className="flex items-center gap-3 mb-4">
          {getRiskIcon(predictions.cashFlowRisk)}
          <h3 className="text-lg font-semibold">
            Evaluación de Riesgo: {predictions.cashFlowRisk === 'low' ? 'Bajo' : 
                                   predictions.cashFlowRisk === 'medium' ? 'Medio' : 'Alto'}
          </h3>
        </div>
      </div>

      {/* Predictions Timeline */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Proyecciones Financieras
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              ${predictions.predictedBalance30Days.toLocaleString()}
            </div>
            <div className="text-sm text-blue-500 mt-1">30 días</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              ${predictions.predictedBalance60Days.toLocaleString()}
            </div>
            <div className="text-sm text-blue-500 mt-1">60 días</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              ${predictions.predictedBalance90Days.toLocaleString()}
            </div>
            <div className="text-sm text-blue-500 mt-1">90 días</div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {predictions.alerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas Inteligentes</h3>
          <div className="space-y-3">
            {predictions.alerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{alert.message}</div>
                  <div className="text-sm text-gray-600 mt-1">{alert.action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones</h3>
        <div className="space-y-2">
          {predictions.recommendedActions.map((action, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-gray-700">{action}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionsPanel;