import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from "@/lib/auth";
import { subDays, startOfDay } from 'date-fns';

 

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

    // Learning (Study + Reading)
    const todayLearning = (latestLog.studyMinutes || 0) + (latestLog.readingMinutes || 0);
    const sevenDayTotalLearning = sevenDayLogs.reduce((sum, log) => sum + (log.studyMinutes || 0) + (log.readingMinutes || 0), 0);

    // Rituals (Proxy: AM = Meditation, PM = Reading for now)
    const amRitual = (latestLog.meditationMinutes || 0) > 0;
    const pmRitual = (latestLog.readingMinutes || 0) > 0;

    // Clarity (Proxy: Meditation consistency or duration)
    // Since we don't have a direct rating, we'll calculate a score out of 10 based on meditation duration (target 20 mins)
    const clarityRating = Math.min(Math.round(((latestLog.meditationMinutes || 0) / 20) * 10), 10);
    
    // Calculate previous clarity for delta
    const previousSevenDayLogs = thirtyDayLogs.filter(log => log.date < sevenDaysAgo && log.date >= startOfDay(subDays(today, 14)));
    const previousAvgMeditation = calculateAverage(previousSevenDayLogs.map(l => l.meditationMinutes));
    const currentAvgMeditation = calculateAverage(sevenDayLogs.map(l => l.meditationMinutes));
    const clarityDelta = previousAvgMeditation > 0 ? Math.round(((currentAvgMeditation - previousAvgMeditation) / previousAvgMeditation) * 100) : 0;

    const mindData = {
      clarity: {
        rating: clarityRating,
        delta: clarityDelta,
      },
      learning: {
        today: todayLearning,
        weekly: sevenDayTotalLearning,
      },
      rituals: {
        am: amRitual,
        pm: pmRitual,
      },
    };

    return NextResponse.json({ success: true, data: mindData });
  } catch (error) {
    console.error('Error fetching mind data:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
