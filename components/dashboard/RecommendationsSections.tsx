import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { DashboardData } from '@/types';
import { CheckCircle, Shield, TrendingUp, Heart } from 'lucide-react'; // Agregar imports

interface RecommendationsSectionProps {
    data: DashboardData;
    colors: any;
}

export function RecommendationsSection({ data, colors }: RecommendationsSectionProps) {
    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'high': return '#EF4444';
            case 'medium': return '#F59E0B';
            case 'low': return '#10B981';
            default: return colors.primary;
        }
    };

    const getRiskText = (risk: string) => {
        switch (risk) {
            case 'high': return 'ALTO RIESGO';
            case 'medium': return 'RIESGO MEDIO';
            case 'low': return 'BAJO RIESGO';
            default: return 'EVALUANDO';
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alerts Section */}
            <Card style={{ backgroundColor: colors.white, borderColor: colors.tertiary }}>
                <CardHeader>
                    <h3 className="text-xl font-semibold" style={{ color: colors.primary }}>
                        Alertas Importantes
                    </h3>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.predictions.alerts.length > 0 ? (
                            data.predictions.alerts.map((alert, index) => (
                                <Alert key={index} variant={alert.type as any}>
                                    <div className="flex flex-col space-y-2">
                                        <p className="font-semibold">{alert.message}</p>
                                        {alert.action && (
                                            <p className="text-sm opacity-80">
                                                <strong>Acción:</strong> {alert.action}
                                            </p>
                                        )}
                                    </div>
                                </Alert>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <CheckCircle
                                    className="w-16 h-16 mx-auto mb-4"
                                    style={{ color: '#10B981' }}
                                />
                                <p style={{ color: colors.primary }}>
                                    ¡Todo se ve bien! No hay alertas críticas.
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Recommendations Section */}
            <Card style={{ backgroundColor: colors.white, borderColor: colors.tertiary }}>
                <CardHeader>
                    <h3 className="text-xl font-semibold" style={{ color: colors.primary }}>
                        Análisis Predictivo
                    </h3>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm">Riesgo de Flujo de Caja:</span>
                        <span
                            className="px-3 py-1 rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: getRiskColor(data.predictions.cashFlowRisk) }}
                        >
                            {getRiskText(data.predictions.cashFlowRisk)}
                        </span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* 30-day prediction */}
                        <div className="p-4 rounded-lg" style={{ backgroundColor: colors.tertiary }}>
                            <h4 className="font-semibold mb-2" style={{ color: colors.primary }}>
                                Proyección 30 días
                            </h4>
                            <p className="text-2xl font-bold" style={{
                                color: data.predictions.predictedBalance30Days >= 0 ? '#10B981' : colors.secondary
                            }}>
                                ${data.predictions.predictedBalance30Days.toLocaleString()}
                            </p>
                        </div>

                        {/* Recommendations */}
                        <div>
                            <h4 className="font-semibold mb-3" style={{ color: colors.primary }}>
                                Recomendaciones
                            </h4>
                            <div className="space-y-2">
                                {data.predictions.recommendedActions.length > 0 ? (
                                    data.predictions.recommendedActions.map((action, index) => (
                                        <div key={index} className="flex items-start space-x-2">
                                            <span style={{ color: colors.secondary }}>•</span>
                                            <span className="text-sm" style={{ color: colors.text.dark }}>
                                                {action}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm" style={{ color: colors.primary }}>
                                        Continúa con tu estrategia actual. Los números se ven bien.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}