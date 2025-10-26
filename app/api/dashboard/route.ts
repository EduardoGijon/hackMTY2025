
import { NextRequest, NextResponse } from 'next/server';
import { generateMockDashboardData } from '@/lib/mockDataGenerator';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';
    const monthParam = searchParams.get('month') || new Date().toISOString().slice(0, 7);
    
    // Parsear año y mes
    const [year, month] = monthParam.split('-').map(Number);
    
    // Generar datos mock realistas
    const dashboardData = generateMockDashboardData(userId, year, month, true);
    
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}