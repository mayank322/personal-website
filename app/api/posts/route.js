import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// GET — fetch all posts
export async function GET() {
  try {
    const posts = await redis.get('posts');
    return NextResponse.json(posts || []);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

// POST — save a new post
export async function POST(request) {
  try {
    const body = await request.json();
    const posts = await redis.get('posts') || [];
    const newPost = {
      id: Date.now(),
      title: body.title,
      tag: body.tag,
      summary: body.summary,
      body: body.body,
      status: body.status || 'draft',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      read: body.read || '3 min read',
      external: false,
      link: null,
    };
    const updated = [newPost, ...posts];
    await redis.set('posts', updated);
    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}

// PUT — update an existing post
export async function PUT(request) {
  try {
    const body = await request.json();
    const posts = await redis.get('posts') || [];
    const updated = posts.map(p => p.id === body.id ? { ...p, ...body } : p);
    await redis.set('posts', updated);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// DELETE — remove a post
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const posts = await redis.get('posts') || [];
    const updated = posts.filter(p => p.id !== id);
    await redis.set('posts', updated);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}