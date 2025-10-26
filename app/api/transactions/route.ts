import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, category, amount, description, date } = body;

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type,
        category,
        amount: parseFloat(amount),
        description,
        date: new Date(date)
      }
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Transaction creation error:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Transactions fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}