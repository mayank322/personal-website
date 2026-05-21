'use client';

import { useState } from 'react';

const blogPosts = [
  { tag: 'AI', tagColor: 'bg-indigo-50 text-indigo-700', title: 'Why I think LLMs will change how we learn', read: '6 min read' },
  { tag: 'Personal', tagColor: 'bg-amber-50 text-amber-700', title: 'What I learned from tracking my habits for a year', read: '4 min read' },
  { tag: 'Tech', tagColor: 'bg-stone-100 text-stone-600', title: 'Building in public — why I started this site', read: '3 min read' },
];

const projects = [
  { status: 'Live', statusColor: 'bg-emerald-50 text-emerald-700', dotColor: 'bg-emerald-500', name: 'This website', desc: 'Built in public — personal site with private dashboard' },
  { status: 'Building', statusColor: 'bg-amber-50 text-amber-700', dotColor: 'bg-amber-400', name: 'Personal finance dashboard', desc: 'MF portfolio tracker with projections & goals' },
  { status: 'Idea', statusColor: 'bg-stone-100 text-stone-600', dotColor: 'bg-stone-400', name: 'AI reading companion', desc: 'Summarise & discuss any book using an LLM' },
];

const mediaCovers = [
  { bg: 'bg-indigo-100', color: 'text-indigo-400', letter: 'M' },
  { bg: 'bg-emerald-100', color: 'text-emerald-400', letter: 'B' },
  { bg: 'bg-amber-100', color: 'text-amber-400', letter: 'S' },
  { bg: 'bg-rose-100', color: 'text-rose-400', letter: 'M' },
  { bg: 'bg-sky-100', color: 'text-sky-400', letter: 'B' },
  { bg: 'bg-stone-100', color: 'text-stone-400', letter: 'S' },
];

const ideas = [
  { num: 1, title: 'What if AI could predict your regrets before you make a decision?', tag: 'AI', tagColor: 'bg-indigo-50 text-indigo-700', date: 'May 12' },
  { num: 2, title: 'The case for doing nothing — why boredom is underrated', tag: 'Life', tagColor: 'bg-amber-50 text-amber-700', date: 'May 9' },
  { num: 3, title: 'Micro-monopolies — small businesses that own a niche completely', tag: 'Business', tagColor: 'bg-indigo-50 text-indigo-700', date: 'May 3' },
  { num: 4, title: 'Why the best interfaces disappear', tag: 'Tech', tagColor: 'bg-stone-100 text-stone-600', date: 'Apr 28' },
];

export default function Home() {
  const [email, setEmail] = useState('');

  return (
    <div style={{ background: '#faf9f7', minHeight: '100vh', fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '0.5px solid #e5e2d9', padding: '18px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#faf9f7', position: 'sticky', top: 0, zIndex: 50 }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#1a1714', letterSpacing: '-0.01em', fontWeight: 400 }}>Mayank Prasad</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {['Blog', 'Projects', 'Fitness', 'Media', 'Ideas', 'About'].map(link => (
            <a key={link} href={`/${link.toLowerCase()}`} style={{ fontSize: '13px', color: '#7a7670', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = '#1a1714'}
              onMouseLeave={e => e.target.style.color = '#7a7670'}>
              {link}
            </a>
          ))}
          <a href="/login" style={{ fontSize: '12px', color: '#c8c4ba', padding: '5px 10px', border: '0.5px solid #e5e2d9', borderRadius: '6px', textDecoration: 'none', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.target.style.color = '#7a7670'; e.target.style.borderColor = '#c8c4ba'; }}
            onMouseLeave={e => { e.target.style.color = '#c8c4ba'; e.target.style.borderColor = '#e5e2d9'; }}>
            🔒
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 48px' }}>

        {/* Hero */}
        <section style={{ padding: '72px 0 56px', borderBottom: '0.5px solid #e5e2d9' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4338A0', marginBottom: '16px' }}>Hello, I'm</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '42px', color: '#1a1714', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '24px', fontWeight: 400 }}>Mayank Prasad</h1>
          <div style={{ fontSize: '15px', color: '#3d3a36', lineHeight: 1.8, maxWidth: '560px', marginBottom: '32px' }}>
            <p style={{ marginBottom: '12px' }}>I lead on-ground operations at Alt Carbon, a climate tech startup, which means I spend a lot of time in fields, tea gardens, and places where Google Maps politely gives up.</p>
            <p>When I'm not working, I'm thinking about cricket, food, books I want to read, and meta questions that have no good answers. This site is where I keep track of all of it.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href="/blog" style={{ padding: '10px 20px', background: '#4338A0', color: '#fff', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', border: 'none', cursor: 'pointer' }}>Read my blog</a>
            <a href="/about" style={{ padding: '10px 20px', background: 'transparent', color: '#4338A0', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', border: '1px solid #4338A0', cursor: 'pointer' }}>About me</a>
          </div>
        </section>

        {/* Blog */}
        <section style={{ padding: '40px 0', borderBottom: '0.5px solid #e5e2d9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#1a1714', fontWeight: 400 }}>Writing</h2>
            <a href="/blog" style={{ fontSize: '12px', color: '#4338A0', textDecoration: 'none' }}>All posts →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
            {blogPosts.map((post, i) => (
              <div key={i} style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '10px', padding: '16px', cursor: 'pointer', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#c8c4ba'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e2d9'}>
                <span className={`${post.tagColor}`} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', display: 'inline-block', marginBottom: '10px', background: post.tagColor.includes('indigo') ? '#eef2ff' : post.tagColor.includes('amber') ? '#fffbeb' : '#f5f5f4', color: post.tagColor.includes('indigo') ? '#4338ca' : post.tagColor.includes('amber') ? '#b45309' : '#57534e' }}>{post.tag}</span>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#1a1714', lineHeight: 1.5, marginBottom: '10px' }}>{post.title}</p>
                <p style={{ fontSize: '11px', color: '#7a7670' }}>{post.read}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, height: '36px', background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '6px', padding: '0 12px', fontSize: '13px', color: '#3d3a36', outline: 'none', fontFamily: 'inherit' }} />
            <button style={{ height: '36px', padding: '0 16px', background: '#4338A0', color: '#fff', borderRadius: '6px', fontSize: '13px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>Subscribe</button>
          </div>
        </section>

        {/* Projects */}
        <section style={{ padding: '40px 0', borderBottom: '0.5px solid #e5e2d9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#1a1714', fontWeight: 400 }}>AI Projects</h2>
            <a href="/projects" style={{ fontSize: '12px', color: '#4338A0', textDecoration: 'none' }}>Full board →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {projects.map((p, i) => (
              <div key={i} style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '10px', padding: '14px', cursor: 'pointer', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#c8c4ba'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e2d9'}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', marginBottom: '10px', background: p.status === 'Live' ? '#ecfdf5' : p.status === 'Building' ? '#fffbeb' : '#f5f5f4', color: p.status === 'Live' ? '#065f46' : p.status === 'Building' ? '#b45309' : '#57534e' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: p.status === 'Live' ? '#10b981' : p.status === 'Building' ? '#f59e0b' : '#a8a29e' }}></div>
                  {p.status}
                </div>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#1a1714', lineHeight: 1.4, marginBottom: '5px' }}>{p.name}</p>
                <p style={{ fontSize: '11px', color: '#7a7670', lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Media */}
        <section style={{ padding: '40px 0', borderBottom: '0.5px solid #e5e2d9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#1a1714', fontWeight: 400 }}>Recently watched & read</h2>
            <a href="/media" style={{ fontSize: '12px', color: '#4338A0', textDecoration: 'none' }}>All media →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
            {mediaCovers.map((cover, i) => (
              <div key={i} style={{ aspectRatio: '2/3', borderRadius: '6px', border: '0.5px solid #e5e2d9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', fontSize: '16px', transition: 'transform 0.15s', background: cover.bg === 'bg-indigo-100' ? '#e0e7ff' : cover.bg === 'bg-emerald-100' ? '#d1fae5' : cover.bg === 'bg-amber-100' ? '#fef3c7' : cover.bg === 'bg-rose-100' ? '#ffe4e6' : cover.bg === 'bg-sky-100' ? '#e0f2fe' : '#f5f5f4', color: cover.color === 'text-indigo-400' ? '#818cf8' : cover.color === 'text-emerald-400' ? '#34d399' : cover.color === 'text-amber-400' ? '#fbbf24' : cover.color === 'text-rose-400' ? '#fb7185' : cover.color === 'text-sky-400' ? '#38bdf8' : '#a8a29e' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                {cover.letter}
              </div>
            ))}
          </div>
        </section>

        {/* Ideas */}
        <section style={{ padding: '40px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#1a1714', fontWeight: 400 }}>Recent ideas</h2>
            <a href="/ideas" style={{ fontSize: '12px', color: '#4338A0', textDecoration: 'none' }}>All ideas →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {ideas.map((idea, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: i === 0 ? '10px 10px 0 0' : i === ideas.length - 1 ? '0 0 10px 10px' : '0', borderBottom: i !== ideas.length - 1 ? 'none' : '0.5px solid #e5e2d9', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f5f3ef'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                <span style={{ fontSize: '11px', color: '#c8c4ba', width: '18px', textAlign: 'right', flexShrink: 0 }}>{idea.num}</span>
                <span style={{ fontSize: '13px', color: '#1a1714', flex: 1, lineHeight: 1.4 }}>{idea.title}</span>
                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', flexShrink: 0, background: idea.tag === 'AI' || idea.tag === 'Business' ? '#eef2ff' : idea.tag === 'Life' ? '#fffbeb' : '#f5f5f4', color: idea.tag === 'AI' || idea.tag === 'Business' ? '#4338ca' : idea.tag === 'Life' ? '#b45309' : '#57534e' }}>{idea.tag}</span>
                <span style={{ fontSize: '11px', color: '#c8c4ba', flexShrink: 0 }}>{idea.date}</span>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid #e5e2d9', padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#c8c4ba' }}>Mayank Prasad</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          {['Twitter', 'LinkedIn', 'Email'].map(link => (
            <a key={link} href="#" style={{ fontSize: '12px', color: '#c8c4ba', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = '#7a7670'}
              onMouseLeave={e => e.target.style.color = '#c8c4ba'}>
              {link}
            </a>
          ))}
        </div>
      </footer>

    </div>
  );
}