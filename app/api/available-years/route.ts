import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Obtener todas las transacciones del usuario
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      select: { date: true },
      orderBy: { date: 'desc' }
    });

    // Extraer años únicos
    const years = [...new Set(
      transactions.map( (transaction: any) => 
        transaction.date.getFullYear().toString()
      )
    )].sort((a, b) => parseInt(b as unknown as string) - parseInt(a as unknown as string)); // Más reciente primero

    return NextResponse.json({ years });
  } catch (error) {
    console.error('Available years API error:', error);
    // Return empty array instead of error to prevent UI crashes
    return NextResponse.json({ years: [] });
  }
}