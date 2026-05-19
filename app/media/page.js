'use client';

import { useState } from 'react';

const media = {
  Movies: [
    { id: 1, title: 'Oppenheimer', year: 2023, rating: 5, take: 'Nolan at his best. The tension never lets up.', color: '#e0e7ff' },
    { id: 2, title: 'Past Lives', year: 2023, rating: 4, take: 'Quietly devastating. Lingers for days.', color: '#d1fae5' },
    { id: 3, title: 'Dune Part Two', year: 2024, rating: 4, take: 'Visually stunning. Story loses steam mid-way.', color: '#fef3c7' },
    { id: 4, title: 'The Holdovers', year: 2023, rating: 4, take: 'Warm, funny, human. Underrated gem.', color: '#ffe4e6' },
    { id: 5, title: 'Poor Things', year: 2023, rating: 3, take: 'Fascinating but exhausting. Not for everyone.', color: '#e0f2fe' },
    { id: 6, title: 'Robot Dreams', year: 2023, rating: 5, take: 'No dialogue. Pure emotion. Cried twice.', color: '#f5f5f4' },
  ],
  Shows: [
    { id: 7, title: 'Succession', year: 2023, rating: 5, take: 'The greatest show about power ever made.', color: '#eef2ff' },
    { id: 8, title: 'The Bear', year: 2023, rating: 5, take: 'Season 2 is a masterpiece. Stressful in the best way.', color: '#d1fae5' },
    { id: 9, title: 'Beef', year: 2023, rating: 4, take: 'Unexpected, funny, and deeply human.', color: '#fef3c7' },
    { id: 10, title: 'Scam 1992', year: 2020, rating: 5, take: 'The best Indian show ever made. Period.', color: '#ffe4e6' },
    { id: 11, title: 'Paatal Lok', year: 2020, rating: 4, take: 'Gritty and uncomfortable. Stays with you.', color: '#e0f2fe' },
    { id: 12, title: 'Panchayat', year: 2023, rating: 5, take: 'Quietly brilliant. Every character earns their moment.', color: '#f5f5f4' },
  ],
  Books: [
    { id: 13, title: 'The Ministry for the Future', year: 2020, rating: 5, take: 'Required reading for anyone working in climate. Frightening and hopeful in equal measure.', color: '#e0e7ff' },
    { id: 14, title: 'Thinking Fast and Slow', year: 2011, rating: 4, take: 'Dense but worth it. Changed how I think about thinking.', color: '#d1fae5' },
    { id: 15, title: 'Shoe Dog', year: 2016, rating: 5, take: 'The most honest startup memoir I\'ve read. Nike almost died a hundred times.', color: '#fef3c7' },
    { id: 16, title: 'The Almanack of Naval Ravikant', year: 2020, rating: 4, take: 'Read slowly. A lot of it sounds obvious until you actually apply it.', color: '#ffe4e6' },
    { id: 17, title: 'Sapiens', year: 2011, rating: 5, take: 'The book that reframed everything I thought I knew about humans.', color: '#e0f2fe' },
    { id: 18, title: 'Atomic Habits', year: 2018, rating: 4, take: 'Practical and well-structured. The 1% better framework actually works.', color: '#f5f5f4' },
  ],
};

const tabs = ['Movies', 'Shows', 'Books'];

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ fontSize: '11px', color: s <= rating ? '#EF9F27' : '#e5e2d9' }}>★</span>
      ))}
    </div>
  );
}

export default function Media() {
  const [activeTab, setActiveTab] = useState('Movies');
  const [activeItem, setActiveItem] = useState(null);
  const [filterRating, setFilterRating] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);

  const items = media[activeTab] || [];
  const filtered = filterRating > 0 ? items.filter(i => i.rating >= filterRating) : items;

  return (
    <div style={{ background: '#faf9f7', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '0.5px solid #e5e2d9', padding: '18px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#faf9f7', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#1a1714', textDecoration: 'none' }}>Mayank Prasad</a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {[['Blog', '/blog'], ['Projects', '/projects'], ['Media', '/media'], ['Ideas', '/ideas'], ['About', '/about']].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: '13px', color: label === 'Media' ? '#1a1714' : '#7a7670', textDecoration: 'none', fontWeight: label === 'Media' ? '500' : '400' }}>
              {label}
            </a>
          ))}
          <a href="/login" style={{ fontSize: '12px', color: '#c8c4ba', padding: '5px 10px', border: '0.5px solid #e5e2d9', borderRadius: '6px', textDecoration: 'none' }}>🔒</a>
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 48px' }}>

        {/* Header */}
        <section style={{ padding: '64px 0 40px' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4338A0', marginBottom: '12px' }}>What I've been watching & reading</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: '#1a1714', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '12px' }}>Media Log</h1>
          <p style={{ fontSize: '15px', color: '#7a7670', lineHeight: 1.6 }}>Movies, shows, and books — with a short take on each.</p>
        </section>

        {/* Tabs + filter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', borderBottom: '0.5px solid #e5e2d9', gap: '0' }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setActiveItem(null); setFilterRating(0); }}
                style={{ fontSize: '13px', padding: '8px 16px', background: 'transparent', border: 'none', borderBottom: activeTab === tab ? '2px solid #1a1714' : '2px solid transparent', color: activeTab === tab ? '#1a1714' : '#7a7670', cursor: 'pointer', fontWeight: activeTab === tab ? '500' : '400', marginBottom: '-0.5px', transition: 'all 0.15s' }}>
                {tab}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#7a7670' }}>Filter:</span>
            {[0, 3, 4, 5].map(r => (
              <button key={r} onClick={() => setFilterRating(r)}
                style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', border: '0.5px solid', borderColor: filterRating === r ? '#1a1714' : '#e5e2d9', background: filterRating === r ? '#1a1714' : 'transparent', color: filterRating === r ? '#faf9f7' : '#7a7670', cursor: 'pointer', transition: 'all 0.15s' }}>
                {r === 0 ? 'All' : `${r}★+`}
              </button>
            ))}
          </div>
        </div>

        {/* Cover grid */}
        <section style={{ paddingBottom: '64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
            {filtered.map(item => {
              const isHovered = hoveredItem === item.id;
              return (
                <div key={item.id}
                  onClick={() => setActiveItem(activeItem?.id === item.id ? null : item)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ position: 'relative', aspectRatio: '2/3', borderRadius: '8px', border: `0.5px solid ${activeItem?.id === item.id ? '#4338A0' : '#e5e2d9'}`, cursor: 'pointer', overflow: 'hidden', background: item.color, transition: 'transform 0.15s', transform: isHovered ? 'translateY(-3px)' : 'translateY(0)' }}>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', textAlign: 'center' }}>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '11px', color: '#3d3a36', lineHeight: 1.3 }}>{item.title}</span>
                  </div>
                  {isHovered && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,23,20,0.82)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '10px 8px' }}>
                      <p style={{ fontFamily: 'Georgia, serif', fontSize: '10px', fontWeight: 500, color: '#fff', marginBottom: '4px', lineHeight: 1.3 }}>{item.title}</p>
                      <div style={{ marginBottom: '4px' }}>
                        <StarRating rating={item.rating} />
                      </div>
                      <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{item.take}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <p style={{ fontSize: '14px', color: '#7a7670', textAlign: 'center', padding: '40px 0' }}>No items match this filter.</p>
          )}
        </section>
      </div>

      {/* Side panel */}
      {activeItem && (
        <div style={{
          position: 'fixed', top: 0, right: 0, width: '380px', height: '100vh',
          background: '#fff', borderLeft: '0.5px solid #e5e2d9', zIndex: 100,
          display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 24px rgba(26,23,20,0.08)',
          animation: 'slideIn 0.25s ease'
        }}>
          <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #e5e2d9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#7a7670' }}>{activeTab.slice(0, -1)}</span>
            <button onClick={() => setActiveItem(null)}
              style={{ fontSize: '12px', color: '#7a7670', background: 'transparent', border: '0.5px solid #e5e2d9', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>
              ✕ close
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
            <div style={{ width: '100%', aspectRatio: '16/9', background: activeItem.color, borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#3d3a36' }}>{activeItem.title}</span>
            </div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#1a1714', fontWeight: 400, lineHeight: 1.3, marginBottom: '8px' }}>{activeItem.title}</h2>
            <p style={{ fontSize: '12px', color: '#c8c4ba', marginBottom: '12px' }}>{activeItem.year}</p>
            <StarRating rating={activeItem.rating} />
            <div style={{ borderTop: '0.5px solid #e5e2d9', marginTop: '20px', paddingTop: '20px' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#c8c4ba', marginBottom: '10px' }}>My take</p>
              <p style={{ fontSize: '14px', color: '#3d3a36', lineHeight: 1.8 }}>{activeItem.take}</p>
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