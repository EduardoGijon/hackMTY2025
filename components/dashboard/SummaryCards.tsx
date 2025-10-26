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
                {/* Super simple main card */}
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
                            {isGoodMonth ? 'Good month!' : 'Tough month'}
                        </h2>

                        <div className={`text-4xl font-bold mb-3 ${isGoodMonth ? 'text-green-600' : 'text-red-600'}`}>
                            {isGoodMonth ? '+' : ''}${data.netBalance.toLocaleString()}
                        </div>

                        <p className="text-lg text-gray-700">
                            {isGoodMonth
                                ? `You had money left this month`
                                : `You spent more than you earned`
                            }
                        </p>

                        {/* Super simple explanation */}
                        <div className="mt-4 p-3 bg-white rounded-lg border">
                            <p className="text-sm text-gray-600">
                                <strong>In simple words:</strong> Out of every $100 you earned,
                                you kept <span className={`font-bold ${isHealthyMargin ? 'text-green-600' : 'text-orange-600'}`}>
                                    ${profitPercentage.toFixed(0)}
                                </span> for yourself
                            </p>
                            <div className="flex items-center justify-center mt-2">
                                {isHealthyMargin ? (
                                    <div className="flex items-center gap-1 text-xs text-green-600">
                                        <CheckCircle className="w-3 h-3" />
                                        <span>That's really good!</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-xs text-orange-600">
                                        <AlertTriangle className="w-3 h-3" />
                                        <span>Try to keep at least $15</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Simple detail cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-2 border-green-200 bg-green-50">
                        <CardHeader className="text-center pb-4">
                            <TrendingUp className="w-10 h-10 text-green-600 mx-auto mb-2" />
                            <h3 className="text-lg font-semibold text-green-800 flex items-center justify-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Money IN
                            </h3>
                            <p className="text-3xl font-bold text-green-600 mb-2">${data.totalIncome.toLocaleString()}</p>
                            <p className="text-sm text-green-700">All the money you received</p>
                            <div className="mt-3 p-2 bg-white rounded text-xs text-green-600 flex items-center justify-center gap-1">
                                <Calculator className="w-3 h-3" />
                                <span>Like {Math.round(data.totalIncome / 1000)} bills of $1,000</span>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card className="border-2 border-red-200 bg-red-50">
                        <CardHeader className="text-center pb-4">
                            <TrendingDown className="w-10 h-10 text-red-600 mx-auto mb-2" />
                            <h3 className="text-lg font-semibold text-red-800 flex items-center justify-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Money OUT
                            </h3>
                            <p className="text-3xl font-bold text-red-600 mb-2">${data.totalExpenses.toLocaleString()}</p>
                            <p className="text-sm text-red-700">Everything you spent</p>
                            <div className="mt-3 p-2 bg-white rounded text-xs text-red-600 flex items-center justify-center gap-1">
                                <Calculator className="w-3 h-3" />
                                <span>You spent {((data.totalExpenses / data.totalIncome) * 100).toFixed(0)}% of what you earned</span>
                            </div>
                        </CardHeader>
                    </Card>

                    <Card className={`border-2 ${isGoodMonth ? 'border-blue-200 bg-blue-50' : 'border-orange-200 bg-orange-50'}`}>
                        <CardHeader className="text-center pb-4">
                            <Target className={`w-10 h-10 mx-auto mb-2 ${isGoodMonth ? 'text-blue-600' : 'text-orange-600'}`} />
                            <h3 className={`text-lg font-semibold ${isGoodMonth ? 'text-blue-800' : 'text-orange-800'} flex items-center justify-center gap-2`}>
                                <Activity className="w-5 h-5" />
                                RESULT
                            </h3>
                            <p className={`text-3xl font-bold mb-2 ${isGoodMonth ? 'text-blue-600' : 'text-orange-600'}`}>
                                {isGoodMonth ? '+' : ''}${data.netBalance.toLocaleString()}
                            </p>
                            <p className={`text-sm ${isGoodMonth ? 'text-blue-700' : 'text-orange-700'}`}>
                                {isGoodMonth ? 'You had money left' : 'You came up short'}
                            </p>
                            <div className="mt-3 p-2 bg-white rounded text-xs flex items-center justify-center gap-1">
                                {isGoodMonth ? (
                                    <>
                                        <CheckCircle className="w-3 h-3 text-blue-600" />
                                        <span className="text-blue-600">Save it or reinvest it</span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingUp className="w-3 h-3 text-orange-600" />
                                        <span className="text-orange-600">Earn more or spend less</span>
                                    </>
                                )}
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                {/* Personalized advice */}
                <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Context for micro-entrepreneur */}
                            <div>
                                <h4 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" />
                                    To help you understand better:
                                </h4>
                                <div className="space-y-2 text-sm text-purple-700">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>You earned: <strong>${data.totalIncome.toLocaleString()}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendingDown className="w-4 h-4" />
                                        <span>You spent: <strong>${data.totalExpenses.toLocaleString()}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Target className="w-4 h-4" />
                                        <span>Your real profit: <strong>${data.netBalance.toLocaleString()}</strong></span>
                                    </div>
                                    <div className="mt-3 p-2 bg-white rounded">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-purple-600" />
                                            <strong>Is it good?</strong>
                                        </div>
                                        <p className="text-xs mt-1">
                                            {profitPercentage >= 20 ? 'Excellent! You have a very profitable business' :
                                                profitPercentage >= 10 ? 'Good, but you can improve a bit more' :
                                                    profitPercentage >= 0 ? 'Average, you need to optimize your expenses' :
                                                        'Complicated, urgent need to review numbers'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Next step */}
                            <div>
                                <h4 className="text-lg font-semibold text-pink-800 mb-3 flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Your next step:
                                </h4>
                                <div className="space-y-3">
                                    {profitPercentage < 0 ? (
                                        <div className="p-3 bg-red-100 rounded-lg">
                                            <div className="flex items-center gap-2 font-medium text-red-800">
                                                <AlertTriangle className="w-4 h-4" />
                                                <span>Urgent:</span>
                                            </div>
                                            <p className="text-sm text-red-700 mt-1">Review your biggest expenses and see which ones you can reduce</p>
                                        </div>
                                    ) : profitPercentage < 10 ? (
                                        <div className="p-3 bg-yellow-100 rounded-lg">
                                            <div className="flex items-center gap-2 font-medium text-yellow-800">
                                                <AlertTriangle className="w-4 h-4" />
                                                <span>Improve:</span>
                                            </div>
                                            <p className="text-sm text-yellow-700 mt-1">Try to raise your prices a little or reduce expenses</p>
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-green-100 rounded-lg">
                                            <div className="flex items-center gap-2 font-medium text-green-800">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Keep it up:</span>
                                            </div>
                                            <p className="text-sm text-green-700 mt-1">Save part of the profits for the tough months</p>
                                        </div>
                                    )}

                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <div className="flex items-center gap-2 font-medium text-blue-800">
                                            <Activity className="w-4 h-4" />
                                            <span>Tip:</span>
                                        </div>
                                        <p className="text-sm text-blue-700 mt-1">
                                            Compare this month with the previous one to see if you're improving
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
            {/* Executive dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

                {/* Main KPI */}
                <Card className="lg:col-span-2 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Activity className="w-6 h-6 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Period Performance</h3>
                        </div>
                        <div className={`text-5xl font-bold mb-2 ${isGoodMonth ? 'text-green-600' : 'text-red-600'}`}>
                            {isGoodMonth ? '+' : ''}${data.netBalance.toLocaleString()}
                        </div>
                        <p className="text-gray-600">Net Balance</p>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{profitPercentage.toFixed(1)}%</div>
                                <div className="text-sm text-blue-500 flex items-center justify-center gap-1">
                                    <PieChart className="w-3 h-3" />
                                    Profit Margin
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{efficiencyRatio.toFixed(2)}x</div>
                                <div className="text-sm text-purple-500 flex items-center justify-center gap-1">
                                    <BarChart3 className="w-3 h-3" />
                                    Revenue/Expense Ratio
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Key metrics */}
                <Card className="border-l-4 border-green-500">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <TrendingUp className="w-8 h-8 text-green-600" />
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">${data.totalIncome.toLocaleString()}</div>
                                <div className="text-sm text-gray-500">Total Revenue</div>
                                <div className="text-xs text-green-600 mt-1 flex items-center justify-end gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Target achieved
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
                                <div className="text-sm text-gray-500">Operating Expenses</div>
                                <div className="text-xs text-red-600 mt-1 flex items-center justify-end gap-1">
                                    <Calculator className="w-3 h-3" />
                                    {((data.totalExpenses / data.totalIncome) * 100).toFixed(1)}% of revenue
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </div>

            {/* Advanced analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Profitability Analysis */}
                <Card className="border border-green-200">
                    <CardHeader>
                        <h4 className="font-semibold text-green-800 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Profitability Analysis
                        </h4>
                        <div className="space-y-3 mt-4">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                    <Activity className="w-3 h-3" />
                                    Operating ROI:
                                </span>
                                <span className="font-medium text-green-600">{((data.netBalance / data.totalExpenses) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                    <Target className="w-3 h-3" />
                                    Cost Efficiency:
                                </span>
                                <span className="font-medium">{(100 - (data.totalExpenses / data.totalIncome) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                    <Calculator className="w-3 h-3" />
                                    Break-even Ratio:
                                </span>
                                <span className="font-medium text-blue-600">{(data.totalExpenses / data.totalIncome).toFixed(3)}</span>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Performance Metrics */}
                <Card className="border border-blue-200">
                    <CardHeader>
                        <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                            <PieChart className="w-5 h-5" />
                            Performance KPIs
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
                                            Positive
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle className="w-3 h-3" />
                                            Negative
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Executive Projections */}
                <Card className="border border-purple-200">
                    <CardHeader>
                        <h4 className="font-semibold text-purple-800 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Executive Projections
                        </h4>
                        <div className="space-y-3 mt-4">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    30-day Trend:
                                </span>
                                <span className="font-medium text-green-600">
                                    ${(data.predictions?.predictedBalance30Days || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    Cash Flow Risk:
                                </span>
                                <span className={`font-medium text-xs px-2 py-1 rounded flex items-center gap-1 ${data.predictions?.cashFlowRisk === 'low' ? 'bg-green-100 text-green-800' :
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
                                    Recommendation:
                                </span>
                                <span className="font-medium text-blue-600 text-xs flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    {profitPercentage >= 15 ? 'EXPAND' : profitPercentage >= 5 ? 'OPTIMIZE' : 'RESTRUCTURE'}
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
}