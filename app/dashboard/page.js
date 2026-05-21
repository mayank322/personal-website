'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatINR(val) {
  const num = Number(val);
  if (isNaN(num)) return '—';
  if (num >= 100000) return '₹' + (num / 100000).toFixed(2) + 'L';
  if (num >= 1000) return '₹' + (num / 1000).toFixed(1) + 'K';
  return '₹' + num.toFixed(0);
}

function pct(val) {
  const num = Number(val);
  if (isNaN(num)) return '—';
  return (num >= 0 ? '+' : '') + num.toFixed(2) + '%';
}

function parsePct(str) {
  if (!str) return 0;
  return parseFloat(String(str).replace('%', '')) || 0;
}

// ─── Parse Groww Excel ───────────────────────────────────────────────────────

function parseGrowwExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

        // Find summary row (row after "HOLDING SUMMARY" header)
        let summaryRow = null;
        let fundsStartRow = -1;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (row.includes('Total Investments')) {
            summaryRow = rows[i + 1];
          }
          if (row.some(cell => String(cell).trim() === 'Scheme Name')) {
            fundsStartRow = i + 1;
          }
        }

        if (!summaryRow) throw new Error('Could not find summary row');
        if (fundsStartRow === -1) throw new Error('Could not find fund rows');

        const summary = {
          totalInvested: Number(summaryRow[0]) || 0,
          currentValue: Number(summaryRow[1]) || 0,
          profitLoss: Number(summaryRow[2]) || 0,
          profitLossPct: parsePct(summaryRow[3]),
          xirr: parsePct(summaryRow[4]),
        };

        const funds = [];
        for (let i = fundsStartRow; i < rows.length; i++) {
          const r = rows[i];
          if (!r[0] || String(r[0]).trim() === '') continue;
          funds.push({
            name: String(r[0]).trim(),
            amc: String(r[1]).trim(),
            category: String(r[2]).trim(),
            subCategory: String(r[3]).trim(),
            units: Number(r[6]) || 0,
            investedValue: Number(r[7]) || 0,
            currentValue: Number(r[8]) || 0,
            returns: Number(r[9]) || 0,
            xirr: parsePct(r[10]),
          });
        }

        resolve({ summary, funds });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsArrayBuffer(file);
  });
}

// ─── Upload Modal ────────────────────────────────────────────────────────────

function UploadModal({ onClose, onSuccess }) {
  const fileRef = useRef();
  const [status, setStatus] = useState('idle'); // idle | parsing | saving | done | error
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    if (!file.name.endsWith('.xlsx')) {
      setError('Please upload a .xlsx file downloaded from Groww.');
      return;
    }
    setStatus('parsing');
    setError('');
    try {
      const { summary, funds } = await parseGrowwExcel(file);
      setPreview({ summary, funds });
      setStatus('idle');
    } catch (err) {
      setError('Could not parse file: ' + err.message);
      setStatus('error');
    }
  }

  async function handleSave() {
    if (!preview) return;
    setStatus('saving');
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: preview.summary,
          funds: preview.funds,
          lastUpdated: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      setStatus('done');
      setTimeout(() => { onSuccess(); onClose(); }, 800);
    } catch (err) {
      setError('Failed to save: ' + err.message);
      setStatus('error');
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
    }}>
      <div style={{
        background: '#faf9f7', borderRadius: '12px', border: '0.5px solid #e5e2d9',
        width: '520px', maxWidth: '95vw', maxHeight: '80vh', overflow: 'auto',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 400, color: '#1a1714' }}>
            Update portfolio
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#7a7670' }}>×</button>
        </div>

        {/* Step 1: File picker */}
        {!preview && (
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#4338A0'; e.currentTarget.style.background = '#f4f3fc'; }}
            onDragLeave={e => { e.currentTarget.style.borderColor = '#d5d1c8'; e.currentTarget.style.background = 'transparent'; }}
            onDrop={e => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#d5d1c8';
              e.currentTarget.style.background = 'transparent';
              const file = e.dataTransfer.files[0];
              if (file) handleFile(file);
            }}
            style={{
              border: '1.5px dashed #d5d1c8', borderRadius: '8px', padding: '40px',
              textAlign: 'center', cursor: 'pointer', marginBottom: '16px',
              transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#4338A0'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#d5d1c8'}
          >
            <p style={{ fontSize: '14px', color: '#7a7670', marginBottom: '6px' }}>
              {status === 'parsing' ? 'Parsing...' : 'Click to upload or drag & drop your Groww Excel file'}
            </p>
            <p style={{ fontSize: '12px', color: '#c8c4ba' }}>Download from Groww → Portfolio → Export (.xlsx)</p>
            <input
              ref={fileRef}
              type="file"
              style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files[0])}
            />
          </div>
        )}

        {/* Step 2: Preview */}
        {preview && (
          <div>
            <div style={{
              background: '#f0efe8', borderRadius: '8px', padding: '16px', marginBottom: '16px'
            }}>
              <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a7670', marginBottom: '10px' }}>
                Summary extracted
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  ['Total invested', formatINR(preview.summary.totalInvested)],
                  ['Current value', formatINR(preview.summary.currentValue)],
                  ['Returns', pct(preview.summary.profitLossPct)],
                  ['XIRR', pct(preview.summary.xirr)],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p style={{ fontSize: '11px', color: '#7a7670' }}>{label}</p>
                    <p style={{ fontSize: '15px', fontWeight: 500, color: '#1a1714' }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#7a7670', marginBottom: '12px' }}>
              {preview.funds.length} funds detected
            </p>

            <div style={{ maxHeight: '180px', overflow: 'auto', marginBottom: '20px' }}>
              {preview.funds.map((f, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: '0.5px solid #e5e2d9', fontSize: '13px'
                }}>
                  <div>
                    <p style={{ color: '#1a1714', marginBottom: '2px' }}>{f.name}</p>
                    <p style={{ color: '#7a7670', fontSize: '11px' }}>{f.category} · {f.subCategory}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#1a1714' }}>{formatINR(f.currentValue)}</p>
                    <p style={{ color: f.xirr >= 0 ? '#0F6E56' : '#A32D2D', fontSize: '11px' }}>
                      XIRR {pct(f.xirr)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setPreview(null); setError(''); }}
                style={{
                  flex: 1, padding: '10px', fontSize: '13px', cursor: 'pointer',
                  background: 'transparent', border: '0.5px solid #e5e2d9',
                  borderRadius: '6px', color: '#7a7670'
                }}
              >
                Re-upload
              </button>
              <button
                onClick={handleSave}
                disabled={status === 'saving' || status === 'done'}
                style={{
                  flex: 2, padding: '10px', fontSize: '13px', cursor: 'pointer',
                  background: status === 'done' ? '#0F6E56' : '#4338A0',
                  border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 500
                }}
              >
                {status === 'saving' ? 'Saving...' : status === 'done' ? '✓ Saved!' : 'Save to dashboard'}
              </button>
            </div>
          </div>
        )}

        {error && (
          <p style={{ fontSize: '13px', color: '#A32D2D', marginTop: '12px' }}>{error}</p>
        )}
      </div>
    </div>
  );
}

// ─── Projection Chart (simple bar chart using divs) ──────────────────────────

function ProjectionBars({ currentValue, xirr }) {
  const rate = xirr > 0 ? xirr / 100 : 0.12;
  const years = [1, 3, 5, 10];
  const projections = years.map(y => ({
    label: `${y}Y`,
    value: currentValue * Math.pow(1 + rate, y),
  }));
  const max = projections[projections.length - 1].value;

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '120px', marginTop: '16px' }}>
      {projections.map(({ label, value }) => (
        <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <p style={{ fontSize: '11px', color: '#1a1714', fontWeight: 500 }}>{formatINR(value)}</p>
          <div style={{
            width: '100%', background: '#EEEDFE', borderRadius: '4px 4px 0 0',
            height: `${(value / max) * 80}px`, minHeight: '8px',
          }} />
          <p style={{ fontSize: '11px', color: '#7a7670' }}>{label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Category breakdown ──────────────────────────────────────────────────────

function CategoryBreakdown({ funds }) {
  const totals = {};
  funds.forEach(f => {
    const cat = f.subCategory || f.category || 'Other';
    totals[cat] = (totals[cat] || 0) + f.currentValue;
  });
  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);

  const colors = ['#4338A0', '#0F6E56', '#BA7517', '#993C1D', '#3B6D11', '#185FA5'];

  return (
    <div>
      {sorted.map(([cat, val], i) => {
        const widthPct = total > 0 ? (val / total) * 100 : 0;
        return (
          <div key={cat} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '13px', color: '#1a1714' }}>{cat}</span>
              <span style={{ fontSize: '13px', color: '#7a7670' }}>{formatINR(val)} · {widthPct.toFixed(1)}%</span>
            </div>
            <div style={{ background: '#f0efe8', borderRadius: '4px', height: '6px' }}>
              <div style={{
                background: colors[i % colors.length], borderRadius: '4px',
                height: '6px', width: `${widthPct}%`, transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Paisa hi Paisa Tab ──────────────────────────────────────────────────────

function PaisaTab() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  async function loadPortfolio() {
    setLoading(true);
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      setPortfolio(data.portfolio);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { loadPortfolio(); }, []);

  if (loading) {
    return <div style={{ padding: '60px 0', textAlign: 'center', color: '#7a7670', fontSize: '14px' }}>Loading...</div>;
  }

  const s = portfolio?.summary;
  const funds = portfolio?.funds || [];
  const lastUpdated = portfolio?.lastUpdated
    ? new Date(portfolio.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 48px 60px' }}>
      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onSuccess={loadPortfolio} />
      )}

      <section style={{ padding: '40px 0 28px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4338A0', marginBottom: '6px' }}>Private dashboard</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1a1714', fontWeight: 400 }}>Paisa hi Paisa</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          {lastUpdated && <p style={{ fontSize: '12px', color: '#c8c4ba', marginBottom: '8px' }}>Last updated {lastUpdated}</p>}
          <button onClick={() => setShowUpload(true)} style={{
            fontSize: '13px', padding: '8px 16px', background: '#4338A0',
            border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontWeight: 500,
          }}>Update from Groww</button>
        </div>
      </section>

      {!portfolio && (
        <div style={{ border: '1.5px dashed #d5d1c8', borderRadius: '8px', padding: '60px', textAlign: 'center', color: '#7a7670' }}>
          <p style={{ fontSize: '15px', marginBottom: '8px' }}>No portfolio data yet</p>
          <p style={{ fontSize: '13px', color: '#c8c4ba' }}>Upload your Groww Excel file to get started</p>
        </div>
      )}

      {s && (
        <>
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '32px' }}>
            {[
              { label: 'Total invested', value: formatINR(s.totalInvested), sub: `across ${funds.length} funds` },
              { label: 'Current value', value: formatINR(s.currentValue), sub: 'as of today', positive: true },
              { label: 'Total returns', value: `${s.profitLoss >= 0 ? '+' : ''}${formatINR(s.profitLoss)}`, sub: pct(s.profitLossPct), positive: s.profitLoss >= 0 },
              { label: 'XIRR', value: pct(s.xirr), sub: 'annualised return', positive: s.xirr >= 0 },
            ].map(({ label, value, sub, positive }) => (
              <div key={label} style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '8px', padding: '16px' }}>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a7670', marginBottom: '8px' }}>{label}</p>
                <p style={{ fontSize: '20px', fontWeight: 500, color: positive !== undefined ? (positive ? '#0F6E56' : '#A32D2D') : '#1a1714', marginBottom: '4px' }}>{value}</p>
                <p style={{ fontSize: '11px', color: '#c8c4ba' }}>{sub}</p>
              </div>
            ))}
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
            <div style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '8px', padding: '20px' }}>
              <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a7670', marginBottom: '4px' }}>Projections</p>
              <p style={{ fontSize: '11px', color: '#c8c4ba' }}>Based on your XIRR of {pct(s.xirr)}</p>
              <ProjectionBars currentValue={s.currentValue} xirr={s.xirr} />
            </div>
            <div style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '8px', padding: '20px' }}>
              <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a7670', marginBottom: '16px' }}>By category</p>
              <CategoryBreakdown funds={funds} />
            </div>
          </div>

          <div style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '0.5px solid #e5e2d9' }}>
              <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a7670' }}>Holdings</p>
            </div>
            {funds.map((f, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr auto',
                padding: '14px 20px', borderBottom: i < funds.length - 1 ? '0.5px solid #f0efe8' : 'none',
                alignItems: 'center', gap: '16px'
              }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#1a1714', marginBottom: '3px' }}>{f.name}</p>
                  <p style={{ fontSize: '11px', color: '#c8c4ba' }}>{f.category} · {f.subCategory}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', color: '#1a1714', marginBottom: '3px' }}>{formatINR(f.currentValue)}</p>
                  <p style={{ fontSize: '11px' }}>
                    <span style={{ color: '#c8c4ba' }}>{formatINR(f.investedValue)} invested · </span>
                    <span style={{ color: f.xirr >= 0 ? '#0F6E56' : '#A32D2D' }}>XIRR {pct(f.xirr)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Publish Tab ─────────────────────────────────────────────────────────────

const PRESET_TAGS = ['Climate', 'Personal', 'AI', 'Tech', 'Life', 'Work', 'Cricket', 'Food', 'Running'];

function PublishTab() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', tag: 'Personal', body: '', status: 'draft' });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  async function loadPosts() {
    setLoading(true);
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  useEffect(() => { loadPosts(); }, []);

  function startNew() {
    setForm({ title: '', tag: 'Personal', body: '', status: 'draft' });
    setEditing('new');
  }

  function startEdit(post) {
    setForm({ title: post.title, tag: post.tag, body: post.body || '', status: post.status });
    setEditing(post.id);
  }

  function readTime(body) {
    const words = body.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  async function handleSave(status) {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editing === 'new') {
        await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, status, read: `${readTime(form.body)} min read` }),
        });
      } else {
        await fetch('/api/posts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editing, ...form, status, read: `${readTime(form.body)} min read` }),
        });
      }
      await loadPosts();
      setEditing(null);
    } catch (e) { console.error(e); }
    setSaving(false);
  }

  async function handleDelete(id) {
    await fetch('/api/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setDeleteId(null);
    await loadPosts();
  }

  const published = posts.filter(p => p.status === 'published');
  const drafts = posts.filter(p => p.status === 'draft');

  if (editing !== null) {
    const mins = form.body.trim() ? readTime(form.body) : null;
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 48px 60px' }}>
        <section style={{ padding: '40px 0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4338A0', marginBottom: '6px' }}>Private dashboard</p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1a1714', fontWeight: 400 }}>
              {editing === 'new' ? 'New post' : 'Edit post'}
            </h1>
          </div>
          <button onClick={() => setEditing(null)} style={{
            fontSize: '13px', color: '#7a7670', background: 'transparent',
            border: '0.5px solid #e5e2d9', borderRadius: '6px', padding: '7px 14px', cursor: 'pointer'
          }}>Back</button>
        </section>

        <div style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '8px', padding: '24px', marginBottom: '16px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a7670', display: 'block', marginBottom: '8px' }}>Title</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="What's this post about?"
              style={{
                width: '100%', border: 'none', borderBottom: '0.5px solid #e5e2d9',
                outline: 'none', fontSize: '18px', fontFamily: 'Georgia, serif',
                color: '#1a1714', padding: '8px 0', background: 'transparent', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a7670', display: 'block', marginBottom: '8px' }}>Tag</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {PRESET_TAGS.map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, tag: t }))} style={{
                  fontSize: '12px', padding: '5px 14px', borderRadius: '20px', cursor: 'pointer',
                  border: form.tag === t ? 'none' : '0.5px solid #e5e2d9',
                  background: form.tag === t ? '#4338A0' : 'transparent',
                  color: form.tag === t ? '#fff' : '#7a7670',
                }}>{t}</button>
              ))}
              <input
                placeholder="Custom..."
                value={PRESET_TAGS.includes(form.tag) ? '' : form.tag}
                onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}
                style={{
                  fontSize: '12px', padding: '5px 12px', borderRadius: '20px',
                  border: '0.5px dashed #d5d1c8', outline: 'none', color: '#1a1714',
                  background: 'transparent', width: '100px'
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a7670' }}>Content</label>
              {mins && <span style={{ fontSize: '11px', color: '#c8c4ba' }}>~{mins} min read</span>}
            </div>
            <textarea
              value={form.body}
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              placeholder="Start writing..."
              rows={16}
              style={{
                width: '100%', border: 'none', outline: 'none', resize: 'vertical',
                fontSize: '15px', color: '#1a1714', background: 'transparent',
                fontFamily: 'Georgia, serif', lineHeight: '1.8', boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={() => handleSave('draft')} disabled={saving || !form.title.trim()} style={{
            fontSize: '13px', padding: '10px 20px', cursor: 'pointer',
            background: 'transparent', border: '0.5px solid #e5e2d9', borderRadius: '6px', color: '#7a7670'
          }}>{saving ? 'Saving...' : 'Save as draft'}</button>
          <button onClick={() => handleSave('published')} disabled={saving || !form.title.trim()} style={{
            fontSize: '13px', padding: '10px 24px', cursor: 'pointer',
            background: '#4338A0', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 500
          }}>{saving ? 'Publishing...' : 'Publish'}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 48px 60px' }}>
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#faf9f7', borderRadius: '10px', border: '0.5px solid #e5e2d9', padding: '28px', width: '340px' }}>
            <p style={{ fontSize: '15px', color: '#1a1714', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>Delete this post?</p>
            <p style={{ fontSize: '13px', color: '#7a7670', marginBottom: '24px' }}>This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '9px', fontSize: '13px', cursor: 'pointer', background: 'transparent', border: '0.5px solid #e5e2d9', borderRadius: '6px', color: '#7a7670' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, padding: '9px', fontSize: '13px', cursor: 'pointer', background: '#A32D2D', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 500 }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <section style={{ padding: '40px 0 28px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4338A0', marginBottom: '6px' }}>Private dashboard</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1a1714', fontWeight: 400 }}>Publish</h1>
        </div>
        <button onClick={startNew} style={{ fontSize: '13px', padding: '8px 18px', background: '#4338A0', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>+ New post</button>
      </section>

      {loading && <p style={{ fontSize: '14px', color: '#7a7670' }}>Loading...</p>}

      {published.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a7670', marginBottom: '10px' }}>Published — {published.length}</p>
          {published.map(p => (
            <div key={p.id} style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '8px', padding: '14px 18px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', color: '#1a1714', marginBottom: '3px' }}>{p.title}</p>
                <p style={{ fontSize: '11px', color: '#c8c4ba' }}>{p.tag} · {p.read} · {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <button onClick={() => startEdit(p)} style={{ fontSize: '12px', color: '#7a7670', background: 'transparent', border: '0.5px solid #e5e2d9', borderRadius: '5px', padding: '5px 12px', cursor: 'pointer' }}>Edit</button>
              <button onClick={() => setDeleteId(p.id)} style={{ fontSize: '12px', color: '#A32D2D', background: 'transparent', border: '0.5px solid #f5c4b3', borderRadius: '5px', padding: '5px 12px', cursor: 'pointer' }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {drafts.length > 0 && (
        <div>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a7670', marginBottom: '10px' }}>Drafts — {drafts.length}</p>
          {drafts.map(p => (
            <div key={p.id} style={{ background: '#faf9f7', border: '0.5px dashed #d5d1c8', borderRadius: '8px', padding: '14px 18px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', color: '#7a7670', marginBottom: '3px' }}>{p.title || 'Untitled draft'}</p>
                <p style={{ fontSize: '11px', color: '#c8c4ba' }}>{p.tag} · Draft · {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <button onClick={() => startEdit(p)} style={{ fontSize: '12px', color: '#7a7670', background: 'transparent', border: '0.5px solid #e5e2d9', borderRadius: '5px', padding: '5px 12px', cursor: 'pointer' }}>Edit</button>
              <button onClick={() => setDeleteId(p.id)} style={{ fontSize: '12px', color: '#A32D2D', background: 'transparent', border: '0.5px solid #f5c4b3', borderRadius: '5px', padding: '5px 12px', cursor: 'pointer' }}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#c8c4ba' }}>
          <p style={{ fontSize: '15px', marginBottom: '8px' }}>No posts yet</p>
          <p style={{ fontSize: '13px' }}>Click "+ New post" to write your first one</p>
        </div>
      )}
    </div>
  );
}

function ThoughtsTab() {
  const [thoughts, setThoughts] = useState([]);
  const [newText, setNewText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadThoughts() {
    try {
      const res = await fetch('/api/thoughts');
      const data = await res.json();
      setThoughts(data.thoughts || []);
    } catch (e) { console.error(e); }
  }

  useEffect(() => { loadThoughts(); }, []);

  async function saveToDb(updated) {
    await fetch('/api/thoughts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thoughts: updated }),
    });
  }

  async function postThought() {
    if (!newText.trim()) return;
    setSaving(true);
    const thought = { id: Date.now(), text: newText.trim(), createdAt: new Date().toISOString(), parentId: null };
    const updated = [thought, ...thoughts];
    await saveToDb(updated);
    setThoughts(updated);
    setNewText('');
    setSaving(false);
  }

  async function postReply() {
    if (!replyText.trim()) return;
    setSaving(true);
    const reply = { id: Date.now(), text: replyText.trim(), createdAt: new Date().toISOString(), parentId: replyingTo };
    const updated = [reply, ...thoughts];
    await saveToDb(updated);
    setThoughts(updated);
    setReplyText('');
    setReplyingTo(null);
    setSaving(false);
  }

  async function deleteThought(id) {
    const updated = thoughts.filter(t => t.id !== id && t.parentId !== id);
    await saveToDb(updated);
    setThoughts(updated);
  }

  function formatTime(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' +
      d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  const roots = thoughts.filter(t => !t.parentId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  function getReplies(parentId) {
    return thoughts.filter(t => t.parentId === parentId).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 48px 60px' }}>
      <section style={{ padding: '40px 0 28px' }}>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4338A0', marginBottom: '6px' }}>Private</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#1a1714', fontWeight: 400 }}>Thoughts</h1>
        <p style={{ fontSize: '14px', color: '#7a7670', marginTop: '6px' }}>Things on your mind. Not for the world.</p>
      </section>

      <div style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
        <textarea
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', fontSize: '15px', color: '#1a1714', background: 'transparent', fontFamily: 'Georgia, serif', lineHeight: '1.6', boxSizing: 'border-box' }}
          onKeyDown={e => { if (e.metaKey && e.key === 'Enter') postThought(); }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '0.5px solid #f0efe8' }}>
          <span style={{ fontSize: '11px', color: '#c8c4ba' }}>Cmd + Enter to post</span>
          <button onClick={postThought} disabled={saving || !newText.trim()} style={{
            fontSize: '13px', padding: '7px 16px',
            background: newText.trim() ? '#4338A0' : '#f0efe8', border: 'none', borderRadius: '6px',
            color: newText.trim() ? '#fff' : '#c8c4ba', cursor: newText.trim() ? 'pointer' : 'default', fontWeight: 500
          }}>{saving ? 'Posting...' : 'Post'}</button>
        </div>
      </div>

      {thoughts.length === 0 && (
        <p style={{ color: '#c8c4ba', fontSize: '14px', textAlign: 'center', marginTop: '40px' }}>No thoughts yet. Start writing.</p>
      )}

      {roots.map(t => {
        const replies = getReplies(t.id);
        return (
          <div key={t.id} style={{ marginBottom: '16px' }}>
            <div style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '8px', padding: '16px 18px' }}>
              <p style={{ fontSize: '15px', color: '#1a1714', fontFamily: 'Georgia, serif', lineHeight: '1.7', marginBottom: '12px', whiteSpace: 'pre-wrap' }}>{t.text}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#c8c4ba' }}>{formatTime(t.createdAt)}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setReplyingTo(replyingTo === t.id ? null : t.id)} style={{
                    fontSize: '11px', color: '#4338A0', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px'
                  }}>Continue thread</button>
                  <button onClick={() => deleteThought(t.id)} style={{
                    fontSize: '11px', color: '#c8c4ba', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px'
                  }}>Delete</button>
                </div>
              </div>
            </div>

            {replies.length > 0 && (
              <div style={{ marginLeft: '24px', borderLeft: '2px solid #e5e2d9', paddingLeft: '16px', marginTop: '4px' }}>
                {replies.map(r => (
                  <div key={r.id} style={{ background: '#faf9f7', border: '0.5px solid #e5e2d9', borderRadius: '8px', padding: '14px 16px', marginBottom: '4px' }}>
                    <p style={{ fontSize: '14px', color: '#1a1714', fontFamily: 'Georgia, serif', lineHeight: '1.7', marginBottom: '10px', whiteSpace: 'pre-wrap' }}>{r.text}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: '#c8c4ba' }}>{formatTime(r.createdAt)}</span>
                      <button onClick={() => deleteThought(r.id)} style={{ fontSize: '11px', color: '#c8c4ba', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {replyingTo === t.id && (
              <div style={{ marginLeft: '24px', borderLeft: '2px solid #4338A0', paddingLeft: '16px', marginTop: '4px' }}>
                <div style={{ background: '#fff', border: '0.5px solid #c8c4d9', borderRadius: '8px', padding: '12px 14px' }}>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Continue this thread..."
                    rows={2}
                    autoFocus
                    style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', fontSize: '14px', color: '#1a1714', background: 'transparent', fontFamily: 'Georgia, serif', lineHeight: '1.6', boxSizing: 'border-box' }}
                  />
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <button onClick={() => { setReplyingTo(null); setReplyText(''); }} style={{
                      fontSize: '12px', padding: '5px 12px', background: 'transparent',
                      border: '0.5px solid #e5e2d9', borderRadius: '5px', color: '#7a7670', cursor: 'pointer'
                    }}>Cancel</button>
                    <button onClick={postReply} disabled={!replyText.trim()} style={{
                      fontSize: '12px', padding: '5px 14px', background: '#4338A0',
                      border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer', fontWeight: 500
                    }}>Post reply</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('paisa');

  useEffect(() => {
    const auth = sessionStorage.getItem('auth');
    if (!auth) router.push('/login');
  }, [router]);

  const tabs = [
    ['paisa', 'Paisa hi Paisa'],
    ['publish', 'Publish'],
    ['thoughts', 'Thoughts'],
  ];

  return (
    <div style={{ background: '#faf9f7', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{
        borderBottom: '0.5px solid #e5e2d9', padding: '18px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#faf9f7', position: 'sticky', top: 0, zIndex: 50
      }}>
        <a href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#1a1714', textDecoration: 'none' }}>
          Mayank Prasad
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: '#FAEEDA', color: '#633806' }}>Private</span>
          <button
            onClick={() => { sessionStorage.removeItem('auth'); router.push('/'); }}
            style={{ fontSize: '12px', color: '#7a7670', background: 'transparent', border: '0.5px solid #e5e2d9', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer' }}
          >Sign out</button>
        </div>
      </nav>

      <div style={{ borderBottom: '0.5px solid #e5e2d9', padding: '0 48px', background: '#fff', display: 'flex' }}>
        {tabs.map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            fontSize: '13px', padding: '12px 20px', background: 'transparent', border: 'none',
            borderBottom: activeTab === id ? '2px solid #4338A0' : '2px solid transparent',
            color: activeTab === id ? '#1a1714' : '#7a7670',
            cursor: 'pointer', fontWeight: activeTab === id ? 500 : 400, marginBottom: '-0.5px'
          }}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'paisa' && <PaisaTab />}
      {activeTab === 'publish' && <PublishTab />}
      {activeTab === 'thoughts' && <ThoughtsTab />}
    </div>
  );
}