import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// A helper function to get the start of the current day in UTC
const getStartOfTodayUTC = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const today = getStartOfTodayUTC();
    
    const dailyLog = await prisma.dailyLog.findFirst({
      where: {
        userId: userId,
        date: {
          gte: today,
        },
      },
    });

    if (dailyLog) {
      return NextResponse.json({ success: true, data: dailyLog });
    } else {
      // Return success false but not an error, it's a valid state
      return NextResponse.json({ success: false, error: 'No log found for today.' });
    }
  } catch (error) {
    console.error('Error fetching daily log:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const today = getStartOfTodayUTC();

    // Ensure numeric fields are numbers or null
    const numericFields = [
      'weight', 'pushups', 'steps', 'bikeMinutes', 'waterIntake',
      'consistencyScore'
    ];

    const dataToUpsert: any = { ...body };
    for (const field of numericFields) {
      if (dataToUpsert[field] !== null && dataToUpsert[field] !== undefined && dataToUpsert[field] !== '') {
        dataToUpsert[field] = Number(dataToUpsert[field]);
      } else {
        dataToUpsert[field] = null;
      }
    }
    
    // Handle booleans
    dataToUpsert.weightTraining = !!dataToUpsert.weightTraining;
    dataToUpsert.stretching = !!dataToUpsert.stretching;
    dataToUpsert.isSkipped = !!dataToUpsert.isSkipped;

    // Remove fields that shouldn't be updated via this endpoint if they were passed
    delete dataToUpsert.id;
    delete dataToUpsert.userId;
    delete dataToUpsert.date;
    delete dataToUpsert.createdAt;
    delete dataToUpsert.updatedAt;

    const dailyLog = await prisma.dailyLog.upsert({
      where: {
        userId_date: {
          userId: userId,
          date: today,
        },
      },
      update: dataToUpsert,
      create: {
        ...dataToUpsert,
        userId: userId,
        date: today,
      },
    });

    return NextResponse.json({ success: true, data: dailyLog });
  } catch (error) {
    console.error('Error saving daily log:', error);
    if (error instanceof Error && error.name === 'PrismaClientValidationError') {
        return NextResponse.json({ success: false, error: 'Invalid data provided.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
