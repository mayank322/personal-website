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
  race: { label: 'Sub-45 min 10K', targetSeconds: 2700, currentSeconds: null, raceDate: null },
  weight: { label: 'Weight goal', target: 75, current: null, unit: 'kg' },
  steps: { label: 'Daily steps', target: 10000, current: null },
  yearlyKm: { label: 'Run 1000km in 2026', target: 1000, current: 0 },
};