'use client';

import Image from 'next/image';

const photos = [
  { src: '/photo1.jpg', rotate: '-4deg', top: '0px', left: '0px', width: 140, height: 175 },
  { src: '/photo2.jpg', rotate: '3deg', top: '20px', left: '155px', width: 125, height: 158 },
  { src: '/photo3.jpg', rotate: '-2deg', top: '5px', left: '290px', width: 135, height: 168 },
  { src: '/photo4.jpg', rotate: '4deg', top: '25px', left: '435px', width: 120, height: 152 },
  { src: '/photo5.jpg', rotate: '-3deg', top: '10px', left: '565px', width: 130, height: 163 },
];

export default function About() {
  return (
    <div style={{ background: '#faf9f7', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '0.5px solid #e5e2d9', padding: '18px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#faf9f7', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#1a1714', textDecoration: 'none' }}>Mayank Prasad</a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {[['Blog', '/blog'], ['Projects', '/projects'], ['Media', '/media'], ['Ideas', '/ideas'], ['About', '/about']].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: '13px', color: label === 'About' ? '#1a1714' : '#7a7670', textDecoration: 'none', fontWeight: label === 'About' ? '500' : '400' }}>
              {label}
            </a>
          ))}
          <a href="/login" style={{ fontSize: '12px', color: '#c8c4ba', padding: '5px 10px', border: '0.5px solid #e5e2d9', borderRadius: '6px', textDecoration: 'none' }}>🔒</a>
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 48px' }}>

        {/* Header */}
        <section style={{ padding: '64px 0 48px' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4338A0', marginBottom: '12px' }}>About me</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: '#1a1714', fontWeight: 400, letterSpacing: '-0.02em' }}>Mayank Prasad</h1>
        </section>

        {/* Scattered photos */}
        <section style={{ position: 'relative', height: '220px', marginBottom: '56px' }}>
          {photos.map((photo, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: photo.top,
              left: photo.left,
              width: `${photo.width}px`,
              height: `${photo.height}px`,
              borderRadius: '8px',
              border: '0.5px solid #e5e2d9',
              transform: `rotate(${photo.rotate})`,
              boxShadow: '0 2px 8px rgba(26,23,20,0.08)',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = `rotate(${photo.rotate}) scale(1.03)`}
              onMouseLeave={e => e.currentTarget.style.transform = `rotate(${photo.rotate})`}
            >
              <Image
                src={photo.src}
                alt={`Photo ${i + 1}`}
                width={photo.width}
                height={photo.height}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </section>

        {/* Bio */}
        <section style={{ maxWidth: '620px', marginBottom: '56px' }}>
          <div style={{ fontSize: '15px', color: '#3d3a36', lineHeight: 1.85 }}>
            <p style={{ marginBottom: '20px' }}>
              I lead on-ground operations at Alt Carbon, which basically means I spend a lot of time in fields, tea gardens, and places where Google Maps politely gives up.
            </p>
            <p style={{ marginBottom: '20px' }}>
              When I'm not working, I'm usually following cricket. I'm a massive Dhoni fan and I strongly believe he should never retire — not because it's logical, but because some constants in life are necessary for emotional stability.
            </p>
            <p style={{ marginBottom: '20px' }}>
              I also have a habit of thinking (and overthinking) about meta questions and dragging my friends into them. My most recent obsession: what is an ideal Sunday, and what does it actually mean to relax? Is it doing nothing? Doing something slowly? Or just doing chores with better lighting? Still unresolved.
            </p>
            <p style={{ marginBottom: '20px' }}>
              Food is another internal battleground. I love exploring new dishes, but my brain keeps whispering, "Don't risk it, order what you know." It's a daily fight between curiosity and butter chicken.
            </p>
            <p>
              I work out regularly, largely because it gives me moral permission to eat whatever I want. The idea of a sustained calorie deficit continues to be an elusive dream, but hope, like pre-season fitness goals, remains alive.
            </p>
          </div>
        </section>

        {/* Connect */}
        <section style={{ paddingBottom: '64px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', color: '#1a1714', fontWeight: 400, marginBottom: '16px' }}>Get in touch</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              ['LinkedIn ↗', 'https://www.linkedin.com/in/mayank-prasad-863277131/'],
              ['Twitter / X ↗', 'https://x.com/MayankPrasad322'],
              ['Email ↗', 'mailto:mayank.prasad322@gmail.com'],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '8px', fontSize: '13px', color: '#3d3a36', textDecoration: 'none', transition: 'border-color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#c8c4ba'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e2d9'}>
                {label}
              </a>
            ))}
          </div>
        </section>

      </div>

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