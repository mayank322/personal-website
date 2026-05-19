'use client';

import { useState } from 'react';

const ideas = [
  {
    id: 1,
    title: 'What if AI could predict your regrets before you make a decision?',
    tag: 'AI',
    date: 'May 12, 2026',
    body: `Most decision-making tools help you optimise for outcomes. But what if you could model the emotional residue of a choice — not just whether it works out, but whether you'll feel at peace with having made it?\n\nThis feels like a genuinely underexplored problem. Regret is not just a function of outcome — it's a function of process, identity, and counterfactual thinking. An AI trained on enough introspective data might surface patterns you can't see yourself.\n\nStill thinking through whether this is a product idea or just a thought experiment.`,
  },
  {
    id: 2,
    title: 'The case for doing nothing — why boredom is underrated',
    tag: 'Life',
    date: 'May 9, 2026',
    body: `We've optimised every idle moment out of existence. Podcast on the commute. Scroll during lunch. Read before bed. There's no space left where nothing is happening.\n\nBut boredom is where the brain makes unexpected connections. It's the cognitive equivalent of letting a field lie fallow — it looks unproductive but it's actually restoring something.\n\nI've been trying to build deliberate boredom into my day. No phone, no input, just sitting. It's uncomfortable in a way that feels important.`,
  },
  {
    id: 3,
    title: 'Micro-monopolies — small businesses that own a niche completely',
    tag: 'Business',
    date: 'May 3, 2026',
    body: `There's a class of business that doesn't try to be big — it tries to be the only option in a small world. The one lab that does a specific test. The one supplier of a particular part. The one consultant who understands a specific regulatory edge case.\n\nThese businesses are nearly invisible from the outside but extraordinarily profitable and defensible. No VC funding, no growth hacking, just deep specialisation and patient relationship-building.\n\nI think there are more of these to be built in India than people realise, especially at the intersection of climate, agriculture, and data.`,
  },
  {
    id: 4,
    title: 'Why the best interfaces disappear',
    tag: 'Tech',
    date: 'Apr 28, 2026',
    body: `The goal of good design is to remove itself from the equation. You don't think about the door handle — you just open the door. You don't think about the search bar — you just find what you need.\n\nThe more you notice an interface, the more it's failing. This is why the best software feels obvious in retrospect but is incredibly hard to build. You're engineering invisibility.\n\nThis principle extends beyond software. The best processes, the best management, the best writing — all of them disappear into the thing they're serving.`,
  },
  {
    id: 5,
    title: 'Second-order effects of everyone having a personal AI',
    tag: 'AI',
    date: 'Apr 21, 2026',
    body: `The first-order effect is obvious: people get things done faster. But what happens when everyone has a powerful thinking partner available at all times?\n\nMy guess: the bottleneck shifts from information processing to taste and judgment. Anyone can produce a decent essay, a reasonable plan, a functional piece of code. The differentiator becomes knowing what's worth making in the first place.\n\nIt also changes collaboration. If your AI and my AI both drafted this document, who owns it? Who learned from it? These questions don't have good answers yet.`,
  },
];

const tagColors = {
  AI: { bg: '#eef2ff', color: '#4338ca' },
  Life: { bg: '#fffbeb', color: '#b45309' },
  Business: { bg: '#eef2ff', color: '#4338ca' },
  Tech: { bg: '#f5f5f4', color: '#57534e' },
  Climate: { bg: '#E1F5EE', color: '#085041' },
};

const allTags = ['All', ...Array.from(new Set(ideas.map(i => i.tag)))];

export default function Ideas() {
  const [activeIdea, setActiveIdea] = useState(null);
  const [activeTag, setActiveTag] = useState('All');

  const filtered = activeTag === 'All' ? ideas : ideas.filter(i => i.tag === activeTag);

  return (
    <div style={{ background: '#faf9f7', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '0.5px solid #e5e2d9', padding: '18px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#faf9f7', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#1a1714', textDecoration: 'none' }}>Mayank Prasad</a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {[['Blog', '/blog'], ['Projects', '/projects'], ['Media', '/media'], ['Ideas', '/ideas'], ['About', '/about']].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: '13px', color: label === 'Ideas' ? '#1a1714' : '#7a7670', textDecoration: 'none', fontWeight: label === 'Ideas' ? '500' : '400' }}>
              {label}
            </a>
          ))}
          <a href="/login" style={{ fontSize: '12px', color: '#c8c4ba', padding: '5px 10px', border: '0.5px solid #e5e2d9', borderRadius: '6px', textDecoration: 'none' }}>🔒</a>
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 48px' }}>

        {/* Header */}
        <section style={{ padding: '64px 0 40px' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4338A0', marginBottom: '12px' }}>Thinking out loud</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: '#1a1714', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '12px' }}>Ideas</h1>
          <p style={{ fontSize: '15px', color: '#7a7670', lineHeight: 1.6 }}>Raw thoughts, half-baked theories, and questions worth sitting with.</p>
        </section>

        {/* Filters + count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {allTags.map(tag => (
              <button key={tag} onClick={() => setActiveTag(tag)}
                style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', border: '0.5px solid', borderColor: activeTag === tag ? '#1a1714' : '#e5e2d9', background: activeTag === tag ? '#1a1714' : 'transparent', color: activeTag === tag ? '#faf9f7' : '#7a7670', cursor: 'pointer', transition: 'all 0.15s' }}>
                {tag}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '12px', color: '#c8c4ba' }}>{filtered.length} ideas</span>
        </div>

        {/* Ideas list */}
        <section style={{ paddingBottom: '64px' }}>
          <div style={{ border: '0.5px solid #e5e2d9', borderRadius: '10px', overflow: 'hidden' }}>
            {filtered.map((idea, i) => {
              const tc = tagColors[idea.tag] || tagColors.Tech;
              const isActive = activeIdea?.id === idea.id;
              const isLast = i === filtered.length - 1;
              return (
                <div key={idea.id}
                  onClick={() => setActiveIdea(isActive ? null : idea)}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: isActive ? '#f5f3ef' : '#fff', borderBottom: isLast ? 'none' : '0.5px solid #e5e2d9', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f5f3ef'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = '#fff'; }}>
                  <span style={{ fontSize: '11px', color: '#c8c4ba', width: '20px', textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: '13px', color: '#1a1714', flex: 1, lineHeight: 1.4 }}>{idea.title}</span>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', flexShrink: 0, background: tc.bg, color: tc.color }}>{idea.tag}</span>
                  <span style={{ fontSize: '11px', color: '#c8c4ba', flexShrink: 0, width: '60px', textAlign: 'right' }}>
                    {idea.date.split(',')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Side panel */}
      {activeIdea && (
        <div style={{
          position: 'fixed', top: 0, right: 0, width: '420px', height: '100vh',
          background: '#fff', borderLeft: '0.5px solid #e5e2d9', zIndex: 100,
          display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 24px rgba(26,23,20,0.08)',
          animation: 'slideIn 0.25s ease'
        }}>
          <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #e5e2d9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#7a7670' }}>Idea</span>
            <button onClick={() => setActiveIdea(null)}
              style={{ fontSize: '12px', color: '#7a7670', background: 'transparent', border: '0.5px solid #e5e2d9', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>
              ✕ close
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
            {(() => { const tc = tagColors[activeIdea.tag] || tagColors.Tech; return (
              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: tc.bg, color: tc.color, display: 'inline-block', marginBottom: '14px' }}>{activeIdea.tag}</span>
            ); })()}
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#1a1714', fontWeight: 400, lineHeight: 1.4, marginBottom: '8px' }}>{activeIdea.title}</h2>
            <p style={{ fontSize: '12px', color: '#c8c4ba', marginBottom: '20px' }}>{activeIdea.date}</p>
            <div style={{ fontSize: '14px', color: '#3d3a36', lineHeight: 1.85 }}>
              {activeIdea.body.split('\n\n').map((para, i) => (
                <p key={i} style={{ marginBottom: '16px' }}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid #e5e2d9', padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#c8c4ba' }}>Mayank Prasad</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          {[['Twitter', 'https://x.com/MayankPrasad322'], ['LinkedIn', 'https://www.linkedin.com/in/mayank-prasad-863277131/'], ['Email', 'mailto:mayank.prasad322@gmail.com']].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: '12px', color: '#c8c4ba', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = '#7a7670'}
              onMouseLeave={e => e.target.style.color = '#c8c4ba'}>
              {label}
            </a>
          ))}
        </div>
      </footer>

    </div>
  );
}