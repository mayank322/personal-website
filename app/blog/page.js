'use client';

import { useState } from 'react';
import { posts } from '../posts';

const tagColors = {
  Climate: { bg: '#E1F5EE', color: '#085041' },
  AI: { bg: '#eef2ff', color: '#4338ca' },
  Personal: { bg: '#fffbeb', color: '#b45309' },
  Tech: { bg: '#f5f5f4', color: '#57534e' },
  Life: { bg: '#fffbeb', color: '#b45309' },
};

export default function Blog() {
  const [activePost, setActivePost] = useState(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email) setSubscribed(true);
  };

  return (
    <div style={{ background: '#faf9f7', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '0.5px solid #e5e2d9', padding: '18px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#faf9f7', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#1a1714', textDecoration: 'none' }}>Mayank Prasad</a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {[['Blog', '/blog'], ['Projects', '/projects'], ['Media', '/media'], ['Ideas', '/ideas'], ['About', '/about']].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: '13px', color: label === 'Blog' ? '#1a1714' : '#7a7670', textDecoration: 'none', fontWeight: label === 'Blog' ? '500' : '400' }}>
              {label}
            </a>
          ))}
          <a href="/login" style={{ fontSize: '12px', color: '#c8c4ba', padding: '5px 10px', border: '0.5px solid #e5e2d9', borderRadius: '6px', textDecoration: 'none' }}>🔒</a>
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 48px' }}>

        {/* Header */}
        <section style={{ padding: '64px 0 40px' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4338A0', marginBottom: '12px' }}>Writing</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: '#1a1714', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '12px' }}>Blog</h1>
          <p style={{ fontSize: '15px', color: '#7a7670', lineHeight: 1.6 }}>Field notes, climate stories, and things I'm thinking about.</p>
        </section>

        {/* Subscribe bar */}
        <section style={{ marginBottom: '40px', padding: '20px', background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '10px' }}>
          {subscribed ? (
            <p style={{ fontSize: '14px', color: '#085041' }}>Thanks for subscribing! You'll hear from me when I publish something new.</p>
          ) : (
            <div>
              <p style={{ fontSize: '13px', color: '#3d3a36', marginBottom: '12px' }}>Get new posts delivered to your inbox.</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                  style={{ flex: 1, height: '36px', background: '#faf9f7', border: '0.5px solid #e5e2d9', borderRadius: '6px', padding: '0 12px', fontSize: '13px', color: '#3d3a36', outline: 'none', fontFamily: 'inherit' }} />
                <button onClick={handleSubscribe}
                  style={{ height: '36px', padding: '0 16px', background: '#4338A0', color: '#fff', borderRadius: '6px', fontSize: '13px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Subscribe
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Posts list */}
        <section style={{ paddingBottom: '64px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {posts.map(post => {
              const tc = tagColors[post.tag] || tagColors.Tech;
              const isActive = activePost?.id === post.id;
              return (
                <div key={post.id}
                  onClick={() => setActivePost(isActive ? null : post)}
                  style={{ background: '#fff', border: `0.5px solid ${isActive ? '#4338A0' : '#e5e2d9'}`, borderRadius: '10px', padding: '20px', cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = '#c8c4ba'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = '#e5e2d9'; }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: tc.bg, color: tc.color }}>{post.tag}</span>
                        <span style={{ fontSize: '11px', color: '#c8c4ba' }}>{post.date}</span>
                        <span style={{ fontSize: '11px', color: '#c8c4ba' }}>{post.read}</span>
                      </div>
                      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#1a1714', fontWeight: 400, lineHeight: 1.4, marginBottom: '8px' }}>{post.title}</h2>
                      <p style={{ fontSize: '13px', color: '#7a7670', lineHeight: 1.6 }}>{post.summary}</p>
                    </div>
                    <div style={{ fontSize: '18px', color: '#c8c4ba', flexShrink: 0, marginTop: '4px' }}>→</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Side panel */}
      {activePost && (
        <div style={{
          position: 'fixed', top: 0, right: 0, width: '420px', height: '100vh',
          background: '#fff', borderLeft: '0.5px solid #e5e2d9', zIndex: 100,
          display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 24px rgba(26,23,20,0.08)',
          animation: 'slideIn 0.25s ease'
        }}>
          <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #e5e2d9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#7a7670' }}>Post</span>
            <button onClick={() => setActivePost(null)}
              style={{ fontSize: '12px', color: '#7a7670', background: 'transparent', border: '0.5px solid #e5e2d9', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>
              ✕ close
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
            {(() => { const tc = tagColors[activePost.tag] || tagColors.Tech; return (
              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: tc.bg, color: tc.color, display: 'inline-block', marginBottom: '14px' }}>{activePost.tag}</span>
            ); })()}
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: '#1a1714', fontWeight: 400, lineHeight: 1.4, marginBottom: '8px' }}>{activePost.title}</h2>
            <p style={{ fontSize: '12px', color: '#c8c4ba', marginBottom: '20px' }}>{activePost.date} · {activePost.read}</p>

            {activePost.external ? (
              <div>
                <p style={{ fontSize: '14px', color: '#3d3a36', lineHeight: 1.8, marginBottom: '24px' }}>{activePost.summary}</p>
                <div style={{ background: '#faf9f7', border: '0.5px solid #e5e2d9', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
                  <p style={{ fontSize: '12px', color: '#7a7670', marginBottom: '10px' }}>This post is published on Alt Carbon's blog.</p>
                  <a href={activePost.link} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#4338A0', color: '#fff', borderRadius: '6px', fontSize: '13px', textDecoration: 'none' }}>
                    Read on Alt Carbon ↗
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '14px', color: '#3d3a36', lineHeight: 1.85 }}>
                {activePost.body && activePost.body.split('\n\n').map((para, i) => (
                  <p key={i} style={{ marginBottom: '16px' }}>{para}</p>
                ))}
              </div>
            )}

            {/* Share */}
            <div style={{ borderTop: '0.5px solid #e5e2d9', paddingTop: '20px' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#c8c4ba', marginBottom: '10px' }}>Share</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[['X', `https://x.com/intent/tweet?text=${encodeURIComponent(activePost.title)}`], ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://mayankprasad.net/blog')}`]].map(([label, url]) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '11px', padding: '4px 12px', border: '0.5px solid #e5e2d9', borderRadius: '20px', color: '#7a7670', textDecoration: 'none' }}>
                    {label}
                  </a>
                ))}
                <button onClick={() => navigator.clipboard.writeText('https://mayankprasad.net/blog')}
                  style={{ fontSize: '11px', padding: '4px 12px', border: '0.5px solid #e5e2d9', borderRadius: '20px', color: '#7a7670', background: 'transparent', cursor: 'pointer' }}>
                  Copy link
                </button>
              </div>
            </div>
          </div>

          {/* Subscribe at bottom */}
          <div style={{ padding: '16px 20px', borderTop: '0.5px solid #e5e2d9', background: '#faf9f7' }}>
            {subscribed ? (
              <p style={{ fontSize: '13px', color: '#085041' }}>You're subscribed ✓</p>
            ) : (
              <div>
                <p style={{ fontSize: '12px', color: '#7a7670', marginBottom: '8px' }}>Enjoyed this? Get new posts in your inbox.</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com"
                    style={{ flex: 1, height: '32px', background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '6px', padding: '0 10px', fontSize: '12px', outline: 'none', fontFamily: 'inherit' }} />
                  <button onClick={handleSubscribe}
                    style={{ height: '32px', padding: '0 12px', background: '#4338A0', color: '#fff', borderRadius: '6px', fontSize: '12px', border: 'none', cursor: 'pointer' }}>
                    Subscribe
                  </button>
                </div>
              </div>
            )}
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