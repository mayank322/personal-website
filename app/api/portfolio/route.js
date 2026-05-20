import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function GET() {
  try {
    const data = await redis.get('portfolio');
    if (!data) {
      return Response.json({ portfolio: null });
    }
    return Response.json({ portfolio: data });
  } catch (err) {
    return Response.json({ error: 'Failed to load portfolio' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { summary, funds, lastUpdated } = body;

    if (!summary || !funds) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const portfolioData = { summary, funds, lastUpdated };
    await redis.set('portfolio', portfolioData);

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: 'Failed to save portfolio' }, { status: 500 });
  }
}