'use client';

import { useState } from 'react';

const projects = [
  {
    id: 1,
    status: 'Live',
    name: 'This website',
    desc: 'Built in public — personal site with private dashboard. Designed from scratch and built with Next.js.',
    tags: ['Next.js', 'Design'],
    link: 'https://personal-website-78pd.vercel.app',
    demo: true,
  },
  {
    id: 2,
    status: 'Building',
    name: 'Personal finance dashboard',
    desc: 'A private dashboard to track my Mutual Fund portfolio on Groww, with projections and goal tracking.',
    tags: ['Finance', 'Data'],
    link: null,
    demo: false,
  },
  {
    id: 3,
    status: 'Idea',
    name: 'AI reading companion',
    desc: 'An LLM-powered tool to summarise, discuss, and connect ideas across books you\'ve read.',
    tags: ['AI', 'Books'],
    link: null,
    demo: false,
  },
  {
    id: 4,
    status: 'Idea',
    name: 'Climate data visualiser',
    desc: 'A tool to visualise enhanced rock weathering data from Alt Carbon\'s field operations in an accessible way.',
    tags: ['Climate', 'Data', 'AI'],
    link: null,
    demo: false,
  },
  {
    id: 5,
    status: 'Idea',
    name: 'Sunday optimiser',
    desc: 'An app that helps you design the ideal Sunday based on your energy levels, obligations, and what actually makes you feel rested.',
    tags: ['AI', 'Life'],
    link: null,
    demo: false,
  },
];

const statusConfig = {
  Idea: { bg: '#f5f5f4', color: '#57534e', dot: '#a8a29e', colBg: '#fafaf9' },
  Building: { bg: '#fffbeb', color: '#b45309', dot: '#f59e0b', colBg: '#fffef7' },
  Live: { bg: '#ecfdf5', color: '#065f46', dot: '#10b981', colBg: '#f7fdf9' },
};

const columns = ['Idea', 'Building', 'Live'];

export default function Projects() {
  const [activeProject, setActiveProject] = useState(null);

  return (
    <div style={{ background: '#faf9f7', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '0.5px solid #e5e2d9', padding: '18px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#faf9f7', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#1a1714', textDecoration: 'none' }}>Mayank Prasad</a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {[['Blog', '/blog'], ['Projects', '/projects'], ['Media', '/media'], ['Ideas', '/ideas'], ['About', '/about']].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: '13px', color: label === 'Projects' ? '#1a1714' : '#7a7670', textDecoration: 'none', fontWeight: label === 'Projects' ? '500' : '400' }}>
              {label}
            </a>
          ))}
          <a href="/login" style={{ fontSize: '12px', color: '#c8c4ba', padding: '5px 10px', border: '0.5px solid #e5e2d9', borderRadius: '6px', textDecoration: 'none' }}>🔒</a>
        </div>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 48px' }}>

        {/* Header */}
        <section style={{ padding: '64px 0 40px' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4338A0', marginBottom: '12px' }}>What I'm building</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: '#1a1714', fontWeight: 400, letterSpacing: '-0.02em', marginBottom: '12px' }}>AI Projects</h1>
          <p style={{ fontSize: '15px', color: '#7a7670', lineHeight: 1.6 }}>Ideas I'm exploring, things I'm building, and projects that are live.</p>
        </section>

        {/* Kanban board */}
        <section style={{ paddingBottom: '64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {columns.map(col => {
              const sc = statusConfig[col];
              const colProjects = projects.filter(p => p.status === col);
              return (
                <div key={col} style={{ background: sc.colBg, border: '0.5px solid #e5e2d9', borderRadius: '12px', padding: '16px' }}>

                  {/* Column header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '0.5px solid #e5e2d9' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sc.dot, flexShrink: 0 }}></div>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#1a1714' }}>{col}</span>
                    <span style={{ fontSize: '11px', color: '#c8c4ba', marginLeft: 'auto' }}>{colProjects.length}</span>
                  </div>

                  {/* Project cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {colProjects.map(project => (
                      <div key={project.id}
                        onClick={() => setActiveProject(activeProject?.id === project.id ? null : project)}
                        style={{ background: '#fff', border: `0.5px solid ${activeProject?.id === project.id ? '#4338A0' : '#e5e2d9'}`, borderRadius: '10px', padding: '14px', cursor: 'pointer', transition: 'all 0.15s' }}
                        onMouseEnter={e => { if (activeProject?.id !== project.id) e.currentTarget.style.borderColor = '#c8c4ba'; }}
                        onMouseLeave={e => { if (activeProject?.id !== project.id) e.currentTarget.style.borderColor = '#e5e2d9'; }}>

                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', marginBottom: '10px', background: sc.bg, color: sc.color }}>
                          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: sc.dot }}></div>
                          {project.status}
                        </div>

                        <p style={{ fontFamily: 'Georgia, serif', fontSize: '13px', color: '#1a1714', lineHeight: 1.4, marginBottom: '6px' }}>{project.name}</p>
                        <p style={{ fontSize: '11px', color: '#7a7670', lineHeight: 1.5, marginBottom: '10px' }}>{project.desc}</p>

                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {project.tags.map(tag => (
                            <span key={tag} style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: '#f5f3ef', color: '#7a7670' }}>{tag}</span>
                          ))}
                        </div>

                        {project.demo && project.link && (
                          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '0.5px solid #e5e2d9' }}>
                            <a href={project.link} target="_blank" rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              style={{ fontSize: '11px', color: '#4338A0', textDecoration: 'none' }}>
                              Visit site ↗
                            </a>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Empty placeholder */}
                    {colProjects.length === 0 && (
                      <div style={{ border: '0.5px dashed #e5e2d9', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', color: '#c8c4ba' }}>Nothing here yet</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Side panel */}
      {activeProject && (
        <div style={{
          position: 'fixed', top: 0, right: 0, width: '380px', height: '100vh',
          background: '#fff', borderLeft: '0.5px solid #e5e2d9', zIndex: 100,
          display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 24px rgba(26,23,20,0.08)',
          animation: 'slideIn 0.25s ease'
        }}>
          <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

          <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #e5e2d9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: '#7a7670' }}>Project</span>
            <button onClick={() => setActiveProject(null)}
              style={{ fontSize: '12px', color: '#7a7670', background: 'transparent', border: '0.5px solid #e5e2d9', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>
              ✕ close
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }}>
            {(() => {
              const sc = statusConfig[activeProject.status];
              return (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', marginBottom: '16px', background: sc.bg, color: sc.color }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: sc.dot }}></div>
                  {activeProject.status}
                </div>
              );
            })()}

            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#1a1714', fontWeight: 400, lineHeight: 1.3, marginBottom: '12px' }}>{activeProject.name}</h2>

            <p style={{ fontSize: '14px', color: '#3d3a36', lineHeight: 1.8, marginBottom: '20px' }}>{activeProject.desc}</p>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {activeProject.tags.map(tag => (
                <span key={tag} style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '4px', background: '#f5f3ef', color: '#7a7670' }}>{tag}</span>
              ))}
            </div>

            {activeProject.demo && activeProject.link && (
              <a href={activeProject.link} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: '#4338A0', color: '#fff', borderRadius: '8px', fontSize: '13px', textDecoration: 'none' }}>
                Visit live site ↗
              </a>
            )}

            {!activeProject.demo && (
              <div style={{ background: '#faf9f7', border: '0.5px solid #e5e2d9', borderRadius: '8px', padding: '14px' }}>
                <p style={{ fontSize: '13px', color: '#7a7670', lineHeight: 1.6 }}>
                  {activeProject.status === 'Building' ? 'This project is currently in progress. No demo available yet.' : 'This is still an idea. Stay tuned.'}
                </p>
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