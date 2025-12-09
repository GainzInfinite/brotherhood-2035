import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from "@/lib/auth";
import { subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfDay } from 'date-fns';



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
    const now = new Date();
    const today = startOfDay(new Date());
    const sevenDaysAgo = startOfDay(subDays(today, 7));
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);
    const startOfCurrentYear = startOfYear(now);
    const endOfCurrentYear = endOfYear(now);

    // Fetch all relevant logs in parallel
    const [dailyLogs, monthlyIncomeLogs, ytdIncomeLogs] = await Promise.all([
      prisma.dailyLog.findMany({
        where: { userId: user.id, date: { gte: sevenDaysAgo } },
        orderBy: { date: 'desc' },
      }),
      prisma.incomeLog.findMany({
        where: { userId: user.id, receivedDate: { gte: startOfCurrentMonth, lte: endOfCurrentMonth } },
      }),
      prisma.incomeLog.findMany({
        where: { userId: user.id, receivedDate: { gte: startOfCurrentYear, lte: endOfCurrentYear } },
      }),
    ]);

    // Monthly Income
    const monthlyTotal = monthlyIncomeLogs.reduce((sum, log) => sum + log.amount, 0);
    const monthlyPassive = monthlyIncomeLogs.filter(log => log.incomeType === 'passive').reduce((sum, log) => sum + log.amount, 0);
    const monthlyLabor = monthlyTotal - monthlyPassive;
    const ytdTotal = ytdIncomeLogs.reduce((sum, log) => sum + log.amount, 0);

    // Daily Spend
    const latestLog = dailyLogs[0] || {};
    const todaySpend = latestLog.spendToday || 0;
    const sevenDayAvgSpend = calculateAverage(dailyLogs.map(l => l.spendToday));
    const previousSevenDayLogs = await prisma.dailyLog.findMany({
        where: { userId: user.id, date: { gte: startOfDay(subDays(today, 14)), lt: sevenDaysAgo } },
    });
    const previousSevenDayAvgSpend = calculateAverage(previousSevenDayLogs.map(l => l.spendToday));
    const spendTrend = previousSevenDayAvgSpend > 0 ? ((sevenDayAvgSpend - previousSevenDayAvgSpend) / previousSevenDayAvgSpend) * 100 : 0;

    // Savings (Income - Spend)
    const todayIncome = latestLog.incomeToday || 0;
    const todaySavings = todayIncome - todaySpend;
    const sevenDayAvgSavings = calculateAverage(dailyLogs.map(l => (l.incomeToday || 0) - (l.spendToday || 0)));

    // Net Worth & Debt (Mock data for now as we don't have a full balance sheet yet)
    // In a real app, this would come from a separate table or aggregation of assets/liabilities
    const netWorth = { value: 0, change: 0 };
    const debt = { total: 0, change: 0 };
    
    // Savings Rate
    const monthlySavingsRate = monthlyTotal > 0 ? ((monthlyTotal - (sevenDayAvgSpend * 30)) / monthlyTotal) * 100 : 0;
    const ytdSavingsRate = monthlySavingsRate; // Approximation

    const wealthData = {
      netWorth,
      income: {
        monthly: monthlyTotal,
        ytd: ytdTotal,
      },
      savingsRate: {
        monthly: monthlySavingsRate,
        ytd: ytdSavingsRate,
      },
      debt,
    };

    return NextResponse.json({ success: true, data: wealthData });
  } catch (error) {
    console.error('Error fetching wealth data:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
