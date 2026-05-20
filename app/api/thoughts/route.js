import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export async function GET() {
  try {
    const thoughts = await redis.get('thoughts');
    return NextResponse.json(thoughts || []);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const thoughts = await redis.get('thoughts') || [];
    const newThought = {
      id: Date.now(),
      text: body.text,
      parentId: body.parentId || null,
      createdAt: new Date().toISOString(),
    };
    const updated = [newThought, ...thoughts];
    await redis.set('thoughts', updated);
    return NextResponse.json(newThought);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const thoughts = await redis.get('thoughts') || [];
    const updated = thoughts.filter(t => t.id !== id && t.parentId !== id);
    await redis.set('thoughts', updated);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}