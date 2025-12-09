import { NextResponse } from 'next/server';
import { getCurrentUser } from "@/lib/auth";
import { subDays, startOfDay } from 'date-fns';

import { prisma } from '@/lib/prisma';

const calculateAverage = (data: (number | null)[]) => {
  const filteredData = data.filter(d => d !== null) as number[];
  if (filteredData.length === 0) return 0;
  return filteredData.reduce((acc, val) => acc + val, 0) / filteredData.length;
};

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = startOfDay(new Date());
    const sevenDaysAgo = startOfDay(subDays(today, 7));
    const thirtyDaysAgo = startOfDay(subDays(today, 30));

    const logs = await prisma.dailyLog.findMany({
      where: {
        userId: user.id,
        date: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    const latestLog = logs[0] || {};

    const sevenDayLogs = logs.filter(log => log.date >= sevenDaysAgo);
    const thirtyDayLogs = logs;

    // Weight
    const latestWeight = latestLog.weight || 0;
    const sevenDayAvgWeight = calculateAverage(sevenDayLogs.map(l => l.weight));
    const thirtyDayOldestLog = thirtyDayLogs[thirtyDayLogs.length - 1];
    const thirtyDayDeltaWeight = latestWeight && thirtyDayOldestLog?.weight ? latestWeight - thirtyDayOldestLog.weight : 0;

    // Pushups
    const todayPushups = latestLog.pushups || 0;
    const sevenDayTotalPushups = sevenDayLogs.reduce((sum, log) => sum + (log.pushups || 0), 0);
    const thirtyDayBestPushups = Math.max(...thirtyDayLogs.map(l => l.pushups || 0), 0);

    // Steps
    const todaySteps = latestLog.steps || 0;
    const sevenDayAvgSteps = calculateAverage(sevenDayLogs.map(l => l.steps));
    const thirtyDayAvgSteps = calculateAverage(thirtyDayLogs.map(l => l.steps));
    const trend = thirtyDayAvgSteps > 0 ? ((sevenDayAvgSteps - thirtyDayAvgSteps) / thirtyDayAvgSteps) * 100 : 0;

    const healthData = {
      weight: {
        latest: latestWeight,
        sevenDayAvg: parseFloat(sevenDayAvgWeight.toFixed(1)),
        thirtyDayDelta: parseFloat(thirtyDayDeltaWeight.toFixed(1)),
      },
      pushups: {
        today: todayPushups,
        sevenDayTotal: sevenDayTotalPushups,
        thirtyDayBest: thirtyDayBestPushups,
      },
      steps: {
        today: todaySteps,
        sevenDayAvg: Math.round(sevenDayAvgSteps),
        thirtyDayTrend: `${trend > 0 ? '+' : ''}${trend.toFixed(1)}%`,
      },
      training: {
        weightTraining: latestLog.weightTraining || false,
        bikeMinutes: latestLog.bikeMinutes || 0,
        waterIntake: latestLog.waterIntake || 0,
      },
    };

    return NextResponse.json({ success: true, data: healthData });
  } catch (error) {
    console.error('Error fetching health data:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
