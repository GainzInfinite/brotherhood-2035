import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const incomeLogs = await prisma.incomeLog.findMany({
      where: { userId: user.id },
      orderBy: { receivedDate: 'desc' },
    });
    return NextResponse.json({ success: true, data: incomeLogs });
  } catch (error) {
    console.error('Error fetching income logs:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { amount, source, currency, incomeType, receivedDate } = body;

    if (!amount || !source || !receivedDate) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newLog = await prisma.incomeLog.create({
      data: {
        userId: user.id,
        amount: Number(amount),
        source,
        currency: currency || 'USD',
        incomeType: incomeType || 'SALARY',
        receivedDate: new Date(receivedDate),
      },
    });

    return NextResponse.json({ success: true, data: newLog }, { status: 201 });
  } catch (error) {
    console.error('Error creating income log:', error);
    if (error instanceof Error && error.name === 'PrismaClientValidationError') {
        return NextResponse.json({ success: false, error: 'Invalid data provided.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
