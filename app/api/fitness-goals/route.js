// app/api/fitness-goals/route.js
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function GET() {
  try {
    const goals = await redis.get('fitness-goals');
    return Response.json({ goals: goals || defaultGoals });
  } catch (err) {
    return Response.json({ goals: defaultGoals });
  }
}

export async function POST(request) {
  try {
    const { goals } = await request.json();
    await redis.set('fitness-goals', goals);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: 'Failed to save goals' }, { status: 500 });
  }
}

const defaultGoals = {
  race: {
    label: '10K race goal',
    targetMins: 50,
    currentMins: null,
    startMins: 70,
    raceDate: '2026-10-18',
  },
  weight: {
    label: 'Weight',
    target: 72,
    current: 77.5,
    start: 77.5,
    unit: 'kg',
  },
  steps: {
    label: 'Steps today',
    target: 10500,
    current: null,
  },
  yearlyKm: {
    label: 'Run 500km in 2026',
    target: 500,
  },
};