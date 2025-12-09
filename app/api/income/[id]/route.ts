import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const log = await prisma.incomeLog.findUnique({
      where: { id },
    });

    if (!log) {
      return NextResponse.json({ success: false, error: 'Log not found' }, { status: 404 });
    }

    if (log.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: log });
  } catch (error) {
    console.error('Error fetching income log:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
  }

  try {
    // Verify ownership
    const log = await prisma.incomeLog.findUnique({
      where: { id },
    });

    if (!log) {
      return NextResponse.json({ success: false, error: 'Log not found' }, { status: 404 });
    }

    if (log.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.incomeLog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting income log:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { amount, source, currency, incomeType, receivedDate } = body;

    // Verify ownership
    const log = await prisma.incomeLog.findUnique({
      where: { id },
    });

    if (!log) {
      return NextResponse.json({ success: false, error: 'Log not found' }, { status: 404 });
    }

    if (log.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const updatedLog = await prisma.incomeLog.update({
      where: { id },
      data: {
        amount: amount ? Number(amount) : undefined,
        source,
        currency,
        incomeType,
        receivedDate: receivedDate ? new Date(receivedDate) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: updatedLog });
  } catch (error) {
    console.error('Error updating income log:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
