'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const funds = [
  { name: 'Nippon India Small Cap Fund Growth', invested: 193991, current: 225779, cagr: 8.64 },
  { name: 'Parag Parikh Flexi Cap Fund Growth', invested: 169264, current: 186158, cagr: 7.36 },
  { name: 'Motilal Oswal Midcap Fund Direct Growth', invested: 149993, current: 140995, cagr: -14.62 },
  { name: 'Invesco India Mid Cap Fund Direct Growth', invested: 99995, current: 100544, cagr: 1.39 },
  { name: 'HDFC Flexi Cap Direct Plan Growth', invested: 101998, current: 98045, cagr: -9.74 },
  { name: 'Bandhan Small Cap Fund Direct Growth', invested: 89998, current: 92192, cagr: 5.93 },
  { name: 'HDFC Large and Mid Cap Fund Growth', invested: 74025, current: 89498, cagr: 11.11 },
  { name: 'HDFC Large and Mid Cap Fund Direct Growth', invested: 91995, current: 89268, cagr: -7.11 },
  { name: 'Nippon India Large Cap Fund Direct Growth', invested: 91995, current: 87777, cagr: -10.90 },
  { name: 'ICICI Prudential Large Cap Fund Growth', invested: 73998, current: 86832, cagr: 7.28 },
  { name: 'Quant Mid Cap Fund Growth', invested: 9000, current: 9195, cagr: 5.02 },
];

const monthlySIP = 71000;
const lastUpdated = 'May 19, 2026';
const goalTarget = 2000000;
const monthsToGoal = 7;
const PRESET_TAGS = ['Climate', 'AI', 'Personal', 'Tech', 'Life', 'Cricket', 'Food', 'Running'];

function formatINR(n) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

function projectPortfolio(currentValue, monthlyInvestment, cagr, months) {
  const r = Math.max(0, cagr) / 100 / 12;
  let v = currentValue;
  for (let i = 0; i < months; i++) v = v * (1 + r) + monthlyInvestment;
  return Math.round(v);
}

function getBlendedCAGR(funds) {
  const total = funds.reduce((s, f) => s + f.invested, 0);
  const pos = funds.filter(f => f.cagr > 0);
  if (!pos.length) return 6;
  return pos.reduce((s, f) => s + (f.cagr * f.invested / total), 0);
}

function calcReadTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function formatThoughtTime(iso) {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 0) return `Today, ${timeStr}`;
  if (diffDays === 1) return `Yesterday, ${timeStr}`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + `, ${timeStr}`;
}

function ThoughtCard({ thought, replies, onReply, onDelete }) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [posting, setPosting] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setPosting(true);
    await onReply(replyText, thought.id);
    setReplyText('');
    setShowReplyBox(false);
    setPosting(false);
  };

  return (
    <div style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '10px', padding: '16px' }}>
      <p style={{ fontSize: '14px', color: '#1a1714', fontFamily: 'Georgia, serif', lineHeight: 1.75, marginBottom: '10px' }}>{thought.text}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span style={{ fontSize: '11px', color: '#c8c4ba' }}>{formatThoughtTime(thought.createdAt)}</span>
        <button onClick={() => setShowReplyBox(!showReplyBox)}
          style={{ fontSize: '11px', color: '#4338A0', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
          ↩ Continue thread
        </button>
        <button onClick={() => onDelete(thought.id)}
          style={{ fontSize: '11px', color: '#c8c4ba', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
          Delete
        </button>
      </div>

      {replies.length > 0 && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '0.5px solid #e5e2d9', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {replies.map((reply, i) => (
            <div key={reply.id} style={{ display: 'flex', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16px', flexShrink: 0, paddingTop: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c8c4ba', flexShrink: 0 }}></div>
                {i < replies.length - 1 && <div style={{ width: '1px', background: '#e5e2d9', flex: 1, marginTop: '4px' }}></div>}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', color: '#3d3a36', fontFamily: 'Georgia, serif', lineHeight: 1.7, marginBottom: '6px' }}>{reply.text}</p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#c8c4ba' }}>{formatThoughtTime(reply.createdAt)}</span>
                  <button onClick={() => onDelete(reply.id)}
                    style={{ fontSize: '11px', color: '#c8c4ba', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showReplyBox && (
        <div style={{ background: '#f5f3ef', borderRadius: '8px', padding: '10px', marginTop: '12px' }}>
          <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
            placeholder="Continue this thread..."
            style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '13px', color: '#1a1714', fontFamily: 'Georgia, serif', lineHeight: 1.6, resize: 'none', outline: 'none', minHeight: '40px', boxSizing: 'border-box' }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '6px' }}>
            <button onClick={() => { setShowReplyBox(false); setReplyText(''); }}
              style={{ fontSize: '11px', padding: '4px 10px', background: 'transparent', border: '0.5px solid #e5e2d9', color: '#7a7670', borderRadius: '4px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleReply} disabled={posting || !replyText.trim()}
              style={{ fontSize: '11px', padding: '4px 12px', background: '#4338A0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {posting ? '...' : 'Add to thread'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('paisa');

  const [fundData, setFundData] = useState(funds);
  const [activeProjection, setActiveProjection] = useState(6);
  const [editingCAGR, setEditingCAGR] = useState(false);

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [form, setForm] = useState({ title: '', tag: 'Personal', customTag: '', summary: '', body: '' });
  const [saving, setSaving] = useState(false);
  const [useCustomTag, setUseCustomTag] = useState(false);

  const [thoughts, setThoughts] = useState([]);
  const [loadingThoughts, setLoadingThoughts] = useState(true);
  const [newThought, setNewThought] = useState('');
  const [postingThought, setPostingThought] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('auth')) {
      router.push('/login');
    } else {
      setAuth(true);
      fetchPosts();
      fetchThoughts();
    }
  }, [router]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      setPosts(await res.json());
    } catch (e) {} finally { setLoadingPosts(false); }
  };

  const fetchThoughts = async () => {
    try {
      const res = await fetch('/api/thoughts');
      setThoughts(await res.json());
    } catch (e) {} finally { setLoadingThoughts(false); }
  };

  const postThought = async (text, parentId = null) => {
    if (!text.trim()) return;
    setPostingThought(true);
    try {
      await fetch('/api/thoughts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, parentId }),
      });
      await fetchThoughts();
      if (!parentId) setNewThought('');
    } catch (e) {} finally { setPostingThought(false); }
  };

  const deleteThought = async (id) => {
    if (!confirm('Delete this thought and its replies?')) return;
    await fetch('/api/thoughts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await fetchThoughts();
  };

  const savePost = async (status) => {
    if (!form.title.trim()) return;
    setSaving(true);
    const finalTag = useCustomTag && form.customTag.trim() ? form.customTag.trim() : form.tag;
    const readTime = calcReadTime(form.body || form.summary || form.title);
    try {
      const payload = { ...form, tag: finalTag, read: readTime, status };
      if (editingPost) {
        await fetch('/api/posts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...editingPost, ...payload }) });
      } else {
        await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      await fetchPosts();
      setShowEditor(false);
      setEditingPost(null);
      setForm({ title: '', tag: 'Personal', customTag: '', summary: '', body: '' });
      setUseCustomTag(false);
    } catch (e) {} finally { setSaving(false); }
  };

  const deletePost = async (id) => {
    if (!confirm('Delete this post?')) return;
    await fetch('/api/posts', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    await fetchPosts();
  };

  const editPost = (post) => {
    setEditingPost(post);
    const isPreset = PRESET_TAGS.includes(post.tag);
    setUseCustomTag(!isPreset);
    setForm({ title: post.title, tag: isPreset ? post.tag : 'Personal', customTag: isPreset ? '' : post.tag, summary: post.summary || '', body: post.body || '' });
    setShowEditor(true);
  };

  if (!auth) return null;

  const totalInvested = fundData.reduce((s, f) => s + f.invested, 0);
  const totalCurrent = fundData.reduce((s, f) => s + f.current, 0);
  const totalReturn = totalCurrent - totalInvested;
  const totalReturnPct = ((totalReturn / totalInvested) * 100).toFixed(2);
  const blendedCAGR = getBlendedCAGR(fundData);

  const projectionMonths = [3, 6, 12];
  const projectionLabels = { 3: '3 mo', 6: '6 mo', 12: '1 yr' };
  const projectionLong = { 3: '3 months', 6: '6 months', 12: '1 year' };
  const projPoints = projectionMonths.map(m => ({
    months: m,
    projected: projectPortfolio(totalCurrent, monthlySIP, blendedCAGR, m),
    totalInvested: totalInvested + monthlySIP * m,
  }));
  const maxVal = Math.max(...projPoints.map(p => p.projected));
  const activePoint = projPoints.find(p => p.months === activeProjection);
  const gain = activePoint.projected - activePoint.totalInvested;
  const gainPct = ((gain / activePoint.totalInvested) * 100).toFixed(1);
  const projectedGoal = projectPortfolio(totalCurrent, monthlySIP, blendedCAGR, monthsToGoal);
  const onTrack = projectedGoal >= goalTarget;
  const liveReadTime = form.body ? calcReadTime(form.body) : '—';

  const topLevelThoughts = thoughts.filter(t => !t.parentId);
  const getReplies = (id) => thoughts.filter(t => t.parentId === id).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div style={{ background: '#faf9f7', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      <nav style={{ borderBottom: '0.5px solid #e5e2d9', padding: '18px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#faf9f7', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#1a1714', textDecoration: 'none' }}>Mayank Prasad</a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#FAEEDA', color: '#633806' }}>🔒 Private</span>
          <button onClick={() => { sessionStorage.removeItem('auth'); router.push('/'); }}
            style={{ fontSize: '12px', color: '#7a7670', background: 'transparent', border: '0.5px solid #e5e2d9', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer' }}>
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ borderBottom: '0.5px solid #e5e2d9', padding: '0 48px', background: '#fff', display: 'flex' }}>
        {[['paisa', 'Paisa hi Paisa'], ['publish', 'Publish'], ['thoughts', 'Thoughts']].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            style={{ fontSize: '13px', padding: '12px 20px', background: 'transparent', border: 'none', borderBottom: activeTab === id ? '2px solid #4338A0' : '2px solid transparent', color: activeTab === id ? '#1a1714' : '#7a7670', cursor: 'pointer', fontWeight: activeTab === id ? '500' : '400', marginBottom: '-0.5px' }}>
            {label}
          </button>
        ))}
      </div>

      {/* PAISA HI PAISA */}
      {activeTab === 'paisa' && (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 48px' }}>
          <section style={{ padding: '40px 0 28px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4338A0', marginBottom: '6px' }}>Private dashboard</p>
              <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1a1714', fontWeight: 400 }}>Paisa hi Paisa 💰</h1>
            </div>
            <p style={{ fontSize: '12px', color: '#c8c4ba' }}>Last updated {lastUpdated}</p>
          </section>
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
            {[
              { label: 'Total invested', value: formatINR(totalInvested), sub: `across ${fundData.length} funds` },
              { label: 'Current value', value: formatINR(totalCurrent), sub: 'as of today', positive: true },
              { label: 'Total returns', value: `${totalReturn >= 0 ? '+' : ''}${formatINR(totalReturn)}`, sub: `${totalReturnPct}% overall`, positive: totalReturn >= 0 },
              { label: 'Monthly SIP', value: formatINR(monthlySIP), sub: '6 active SIPs' },
            ].map((card, i) => (
              <div key={i} style={{ background: '#f5f3ef', borderRadius: '10px', padding: '14px 16px' }}>
                <p style={{ fontSize: '11px', color: '#7a7670', marginBottom: '6px' }}>{card.label}</p>
                <p style={{ fontSize: '18px', fontWeight: 500, color: card.positive ? '#0F6E56' : '#1a1714', marginBottom: '2px' }}>{card.value}</p>
                <p style={{ fontSize: '11px', color: card.positive ? '#0F6E56' : '#7a7670' }}>{card.sub}</p>
              </div>
            ))}
          </section>
          <section style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#1a1714', marginBottom: '12px' }}>Goal</p>
            <div style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '10px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#1a1714', marginBottom: '4px' }}>₹20L portfolio value</p>
                  <p style={{ fontSize: '12px', color: '#7a7670' }}>Target: December 2026 · {monthsToGoal} months away</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', color: '#7a7670', marginBottom: '2px' }}>Projected by Dec 2026</p>
                  <p style={{ fontSize: '20px', fontWeight: 500, color: onTrack ? '#0F6E56' : '#4338A0' }}>{formatINR(projectedGoal)}</p>
                </div>
              </div>
              <div style={{ height: '4px', background: '#e5e2d9', borderRadius: '20px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ height: '4px', width: `${Math.min(100, (projectedGoal / goalTarget) * 100)}%`, background: onTrack ? '#1D9E75' : '#4338A0', borderRadius: '20px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '11px', color: onTrack ? '#0F6E56' : '#4338A0' }}>
                  {onTrack ? `✓ On track — surplus of ${formatINR(projectedGoal - goalTarget)}` : `${formatINR(goalTarget - projectedGoal)} gap to close`}
                </p>
                <p style={{ fontSize: '11px', color: '#c8c4ba' }}>Target: {formatINR(goalTarget)}</p>
              </div>
            </div>
          </section>
          <section style={{ background: '#f5f3ef', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#1a1714', marginBottom: '3px' }}>Portfolio projection</p>
                <p style={{ fontSize: '11px', color: '#7a7670' }}>at ₹{(monthlySIP / 1000).toFixed(0)}K/mo SIP · blended CAGR {blendedCAGR.toFixed(1)}%</p>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {projectionMonths.map(m => (
                  <button key={m} onClick={() => setActiveProjection(m)}
                    style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', border: '0.5px solid', borderColor: activeProjection === m ? '#1a1714' : '#e5e2d9', background: activeProjection === m ? '#1a1714' : 'transparent', color: activeProjection === m ? '#faf9f7' : '#7a7670', cursor: 'pointer' }}>
                    {projectionLabels[m]}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              {[['#c8c4ba', 'Invested'], ['#1D9E75', 'Projected']].map(([color, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color }}></div>
                  <span style={{ fontSize: '11px', color: '#7a7670' }}>{label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', height: '160px', marginBottom: '10px' }}>
              {projPoints.map((p) => {
                const isActive = p.months === activeProjection;
                const invH = Math.max(8, (p.totalInvested / maxVal) * 100);
                const projH = Math.max(8, (p.projected / maxVal) * 100);
                return (
                  <div key={p.months} onClick={() => setActiveProjection(p.months)}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', height: '100%', justifyContent: 'flex-end', cursor: 'pointer', opacity: isActive ? 1 : 0.4, transition: 'opacity 0.2s' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <p style={{ fontSize: '11px', fontWeight: 500, color: '#0F6E56', marginBottom: '2px' }}>Projected: {formatINR(p.projected)}</p>
                      <p style={{ fontSize: '10px', color: '#7a7670' }}>Invested: {formatINR(p.totalInvested)}</p>
                    </div>
                    <div style={{ width: '100%', display: 'flex', gap: '5px', alignItems: 'flex-end' }}>
                      <div style={{ flex: 1, background: '#c8c4ba', borderRadius: '4px 4px 0 0', height: `${invH}px` }} />
                      <div style={{ flex: 1, background: '#1D9E75', borderRadius: '4px 4px 0 0', height: `${projH}px` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              {projPoints.map(p => (
                <div key={p.months} style={{ flex: 1, fontSize: '11px', color: '#7a7670' }}>{projectionLong[p.months]}</div>
              ))}
            </div>
            <div style={{ borderTop: '0.5px solid #e5e2d9', paddingTop: '16px', display: 'flex', gap: '12px' }}>
              {[
                { label: 'Projected value', value: formatINR(activePoint.projected), sub: `in ${projectionLong[activeProjection]}`, green: true },
                { label: 'Total invested', value: formatINR(activePoint.totalInvested), sub: 'including SIPs', green: false },
                { label: 'Estimated gain', value: `+${formatINR(gain)}`, sub: `+${gainPct}% return`, green: true },
              ].map((card, i) => (
                <div key={i} style={{ flex: 1, background: '#fff', borderRadius: '8px', padding: '12px', border: '0.5px solid #e5e2d9' }}>
                  <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#7a7670', marginBottom: '4px' }}>{card.label}</p>
                  <p style={{ fontSize: '15px', fontWeight: 500, color: card.green ? '#0F6E56' : '#1a1714', marginBottom: '2px' }}>{card.value}</p>
                  <p style={{ fontSize: '11px', color: '#7a7670' }}>{card.sub}</p>
                </div>
              ))}
            </div>
          </section>
          <section style={{ marginBottom: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <p style={{ fontSize: '13px', fontWeight: 500, color: '#1a1714' }}>Fund breakdown <span style={{ fontSize: '11px', color: '#c8c4ba', fontWeight: 400 }}>({fundData.length} funds)</span></p>
              <button onClick={() => setEditingCAGR(!editingCAGR)}
                style={{ fontSize: '11px', color: '#4338A0', background: 'transparent', border: '0.5px solid #e5e2d9', borderRadius: '6px', padding: '3px 10px', cursor: 'pointer' }}>
                {editingCAGR ? 'Done' : 'Edit CAGR'}
              </button>
            </div>
            <div style={{ border: '0.5px solid #e5e2d9', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px 88px 88px 64px', gap: '8px', padding: '8px 16px', background: '#f5f3ef', borderBottom: '0.5px solid #e5e2d9' }}>
                {['Fund', 'XIRR', 'Invested', 'Current', 'Return'].map(h => (
                  <span key={h} style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#7a7670' }}>{h}</span>
                ))}
              </div>
              {fundData.map((fund, i) => {
                const ret = ((fund.current - fund.invested) / fund.invested * 100).toFixed(1);
                const isLast = i === fundData.length - 1;
                const pos = fund.current >= fund.invested;
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 64px 88px 88px 64px', gap: '8px', padding: '11px 16px', borderBottom: isLast ? 'none' : '0.5px solid #e5e2d9', alignItems: 'center', background: '#fff' }}>
                    <span style={{ fontSize: '12px', color: '#1a1714', lineHeight: 1.3 }}>{fund.name}</span>
                    {editingCAGR ? (
                      <input type="number" value={fund.cagr} step="0.1"
                        onChange={e => setFundData(prev => prev.map((f, j) => j === i ? { ...f, cagr: parseFloat(e.target.value) || 0 } : f))}
                        style={{ width: '56px', height: '28px', fontSize: '11px', border: '0.5px solid #4338A0', borderRadius: '4px', padding: '0 6px', outline: 'none', fontFamily: 'inherit' }} />
                    ) : (
                      <span style={{ fontSize: '11px', color: fund.cagr >= 0 ? '#7a7670' : '#A32D2D' }}>{fund.cagr}%</span>
                    )}
                    <span style={{ fontSize: '11px', color: '#7a7670' }}>{formatINR(fund.invested)}</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#1a1714' }}>{formatINR(fund.current)}</span>
                    <span style={{ fontSize: '11px', color: pos ? '#0F6E56' : '#A32D2D' }}>{pos ? '+' : ''}{ret}%</span>
                  </div>
                );
              })}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px 88px 88px 64px', gap: '8px', padding: '11px 16px', background: '#f5f3ef', borderTop: '0.5px solid #e5e2d9' }}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#1a1714' }}>Total</span>
                <span />
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#1a1714' }}>{formatINR(totalInvested)}</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#1a1714' }}>{formatINR(totalCurrent)}</span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: totalReturn >= 0 ? '#0F6E56' : '#A32D2D' }}>{totalReturn >= 0 ? '+' : ''}{totalReturnPct}%</span>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* PUBLISH TAB */}
      {activeTab === 'publish' && (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1a1714', fontWeight: 400 }}>Publish</h1>
            {!showEditor && (
              <button onClick={() => { setShowEditor(true); setEditingPost(null); setForm({ title: '', tag: 'Personal', customTag: '', summary: '', body: '' }); setUseCustomTag(false); }}
                style={{ fontSize: '13px', padding: '8px 16px', background: '#4338A0', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                + New post
              </button>
            )}
          </div>
          {!showEditor && (
            <div>
              {loadingPosts ? <p style={{ fontSize: '14px', color: '#7a7670' }}>Loading...</p> : posts.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#7a7670' }}>No posts yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {posts.map(post => (
                    <div key={post.id} style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', background: post.status === 'published' ? '#E1F5EE' : '#f5f5f4', color: post.status === 'published' ? '#085041' : '#57534e', flexShrink: 0 }}>
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                      <span style={{ fontSize: '13px', color: '#1a1714', flex: 1 }}>{post.title}</span>
                      <span style={{ fontSize: '11px', color: '#c8c4ba', flexShrink: 0 }}>{post.read}</span>
                      <span style={{ fontSize: '11px', color: '#c8c4ba', flexShrink: 0 }}>{post.date}</span>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button onClick={() => editPost(post)} style={{ fontSize: '11px', padding: '3px 10px', border: '0.5px solid #e5e2d9', borderRadius: '4px', color: '#7a7670', background: 'transparent', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => deletePost(post.id)} style={{ fontSize: '11px', padding: '3px 10px', border: '0.5px solid #f09595', borderRadius: '4px', color: '#A32D2D', background: 'transparent', cursor: 'pointer' }}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {showEditor && (
            <div style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#1a1714' }}>{editingPost ? 'Edit post' : 'Write a new post'}</p>
                <button onClick={() => { setShowEditor(false); setEditingPost(null); }} style={{ fontSize: '12px', color: '#7a7670', background: 'transparent', border: '0.5px solid #e5e2d9', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>✕ Cancel</button>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <p style={{ fontSize: '11px', color: '#7a7670', marginBottom: '6px' }}>Title</p>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Your post title"
                  style={{ width: '100%', height: '40px', background: '#faf9f7', border: '0.5px solid #e5e2d9', borderRadius: '6px', padding: '0 12px', fontSize: '14px', color: '#1a1714', outline: 'none', fontFamily: 'Georgia, serif', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <p style={{ fontSize: '11px', color: '#7a7670', marginBottom: '6px' }}>Tag</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {PRESET_TAGS.map(tag => (
                    <button key={tag} onClick={() => { setForm(f => ({ ...f, tag })); setUseCustomTag(false); }}
                      style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', border: '0.5px solid', borderColor: !useCustomTag && form.tag === tag ? '#4338A0' : '#e5e2d9', background: !useCustomTag && form.tag === tag ? '#EEEDFE' : 'transparent', color: !useCustomTag && form.tag === tag ? '#4338A0' : '#7a7670', cursor: 'pointer' }}>
                      {tag}
                    </button>
                  ))}
                  <button onClick={() => setUseCustomTag(true)}
                    style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', border: '0.5px solid', borderColor: useCustomTag ? '#4338A0' : '#e5e2d9', background: useCustomTag ? '#EEEDFE' : 'transparent', color: useCustomTag ? '#4338A0' : '#7a7670', cursor: 'pointer' }}>
                    + Custom
                  </button>
                </div>
                {useCustomTag && (
                  <input value={form.customTag} onChange={e => setForm(f => ({ ...f, customTag: e.target.value }))} placeholder="Type your custom tag"
                    style={{ height: '32px', background: '#faf9f7', border: '0.5px solid #4338A0', borderRadius: '6px', padding: '0 12px', fontSize: '12px', color: '#1a1714', outline: 'none', fontFamily: 'inherit', width: '180px' }} />
                )}
              </div>
              <div style={{ marginBottom: '14px' }}>
                <p style={{ fontSize: '11px', color: '#7a7670', marginBottom: '6px' }}>Summary</p>
                <input value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} placeholder="One sentence that makes someone want to read this"
                  style={{ width: '100%', height: '36px', background: '#faf9f7', border: '0.5px solid #e5e2d9', borderRadius: '6px', padding: '0 12px', fontSize: '13px', color: '#3d3a36', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <p style={{ fontSize: '11px', color: '#7a7670' }}>Content</p>
                  <p style={{ fontSize: '11px', color: '#c8c4ba' }}>~{liveReadTime}</p>
                </div>
                <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Write your post here..."
                  style={{ width: '100%', height: '320px', background: '#faf9f7', border: '0.5px solid #e5e2d9', borderRadius: '6px', padding: '12px', fontSize: '14px', color: '#1a1714', outline: 'none', fontFamily: 'Georgia, serif', lineHeight: 1.8, resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => savePost('draft')} disabled={saving || !form.title.trim()} style={{ fontSize: '13px', padding: '9px 18px', border: '0.5px solid #e5e2d9', borderRadius: '6px', color: '#7a7670', background: 'transparent', cursor: 'pointer' }}>Save as draft</button>
                <button onClick={() => savePost('published')} disabled={saving || !form.title.trim()} style={{ fontSize: '13px', padding: '9px 20px', background: saving ? '#c8c4ba' : '#4338A0', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  {saving ? 'Saving...' : 'Publish →'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* THOUGHTS TAB */}
      {activeTab === 'thoughts' && (
        <div style={{ maxWidth: '660px', margin: '0 auto', padding: '40px 48px' }}>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1a1714', fontWeight: 400, marginBottom: '6px' }}>Thoughts</h1>
          <p style={{ fontSize: '13px', color: '#7a7670', marginBottom: '24px' }}>Private — only you can see this.</p>

          <div style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
            <textarea value={newThought} onChange={e => setNewThought(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) { postThought(newThought); } }}
              placeholder="What's on your mind?"
              style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '14px', color: '#1a1714', fontFamily: 'Georgia, serif', lineHeight: 1.7, resize: 'none', outline: 'none', minHeight: '60px', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '0.5px solid #e5e2d9' }}>
              <span style={{ fontSize: '11px', color: '#c8c4ba' }}>Cmd+Enter to post</span>
              <button onClick={() => postThought(newThought)} disabled={postingThought || !newThought.trim()}
                style={{ fontSize: '12px', padding: '6px 16px', background: '#4338A0', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                {postingThought ? '...' : 'Post'}
              </button>
            </div>
          </div>

          {loadingThoughts ? (
            <p style={{ fontSize: '14px', color: '#7a7670' }}>Loading thoughts...</p>
          ) : topLevelThoughts.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#c8c4ba', fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>Nothing yet. Write your first thought above.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topLevelThoughts.map(thought => (
                <ThoughtCard
                  key={thought.id}
                  thought={thought}
                  replies={getReplies(thought.id)}
                  onReply={postThought}
                  onDelete={deleteThought}
                />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}