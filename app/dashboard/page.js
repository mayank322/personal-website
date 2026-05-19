'use client';

import { useState, useEffect } from 'react';
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
const goalYear = 2026;
const monthsToGoal = 7;

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

function ProgressBar({ value, max }) {
  const pct = Math.min(100, (value / max) * 100);
  const onTrack = value >= max;
  return (
    <div style={{ height: '4px', background: '#e5e2d9', borderRadius: '20px', overflow: 'hidden', marginTop: '8px' }}>
      <div style={{ height: '4px', width: `${pct}%`, background: onTrack ? '#1D9E75' : '#4338A0', borderRadius: '20px', transition: 'width 0.6s ease' }} />
    </div>
  );
}

const projectionMonths = [3, 6, 12];
const projectionLabels = { 3: '3 mo', 6: '6 mo', 12: '1 yr' };
const projectionLong = { 3: '3 months', 6: '6 months', 12: '1 year' };

export default function Dashboard() {
  const router = useRouter();
  const [auth, setAuth] = useState(false);
  const [fundData, setFundData] = useState(funds);
  const [activeProjection, setActiveProjection] = useState(6);
  const [editingCAGR, setEditingCAGR] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('auth')) router.push('/login');
    else setAuth(true);
  }, [router]);

  if (!auth) return null;

  const totalInvested = fundData.reduce((s, f) => s + f.invested, 0);
  const totalCurrent = fundData.reduce((s, f) => s + f.current, 0);
  const totalReturn = totalCurrent - totalInvested;
  const totalReturnPct = ((totalReturn / totalInvested) * 100).toFixed(2);
  const blendedCAGR = getBlendedCAGR(fundData);

  const projPoints = projectionMonths.map(m => ({
    months: m,
    projected: projectPortfolio(totalCurrent, monthlySIP, blendedCAGR, m),
    totalInvested: totalInvested + monthlySIP * m,
  }));
  const maxVal = Math.max(...projPoints.map(p => p.projected));
  const maxH = 100;

  const activePoint = projPoints.find(p => p.months === activeProjection);
  const gain = activePoint.projected - activePoint.totalInvested;
  const gainPct = ((gain / activePoint.totalInvested) * 100).toFixed(1);

  const projectedGoal = projectPortfolio(totalCurrent, monthlySIP, blendedCAGR, monthsToGoal);
  const onTrack = projectedGoal >= goalTarget;

  return (
    <div style={{ background: '#faf9f7', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* Nav */}
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

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 48px' }}>

        {/* Header */}
        <section style={{ padding: '48px 0 32px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4338A0', marginBottom: '8px' }}>Private dashboard</p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', color: '#1a1714', fontWeight: 400, letterSpacing: '-0.02em' }}>My Portfolio</h1>
          </div>
          <p style={{ fontSize: '12px', color: '#c8c4ba' }}>Last updated {lastUpdated}</p>
        </section>

        {/* Metric cards */}
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

        {/* Goal */}
        <section style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '13px', fontWeight: 500, color: '#1a1714', marginBottom: '12px' }}>Goal</p>
          <div style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '10px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#1a1714', marginBottom: '4px' }}>₹20L portfolio value</p>
                <p style={{ fontSize: '12px', color: '#7a7670' }}>Target: December {goalYear} · {monthsToGoal} months away</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '11px', color: '#7a7670', marginBottom: '2px' }}>Projected by Dec {goalYear}</p>
                <p style={{ fontSize: '20px', fontWeight: 500, color: onTrack ? '#0F6E56' : '#4338A0' }}>{formatINR(projectedGoal)}</p>
              </div>
            </div>
            <ProgressBar value={projectedGoal} max={goalTarget} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <p style={{ fontSize: '11px', color: onTrack ? '#0F6E56' : '#4338A0' }}>
                {onTrack ? `✓ On track — projected surplus of ${formatINR(projectedGoal - goalTarget)}` : `${formatINR(goalTarget - projectedGoal)} gap to close`}
              </p>
              <p style={{ fontSize: '11px', color: '#c8c4ba' }}>Target: {formatINR(goalTarget)}</p>
            </div>
          </div>
        </section>

        {/* Projection chart */}
        <section style={{ background: '#f5f3ef', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 500, color: '#1a1714', marginBottom: '3px' }}>Portfolio projection</p>
              <p style={{ fontSize: '11px', color: '#7a7670' }}>at ₹{(monthlySIP/1000).toFixed(0)}K/mo SIP · blended CAGR {blendedCAGR.toFixed(1)}%</p>
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

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            {[['#c8c4ba', 'Invested'], ['#1D9E75', 'Projected']].map(([color, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color }}></div>
                <span style={{ fontSize: '11px', color: '#7a7670' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Bars */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', height: '160px', marginBottom: '10px' }}>
            {projPoints.map((p, i) => {
              const isActive = p.months === activeProjection;
              const invH = Math.max(8, (p.totalInvested / maxVal) * maxH);
              const projH = Math.max(8, (p.projected / maxVal) * maxH);
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

          {/* Summary cards */}
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

        {/* Fund breakdown */}
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
          <p style={{ fontSize: '11px', color: '#c8c4ba', marginTop: '8px' }}>XIRR values from Groww. Edit to update projections in real time.</p>
        </section>

      </div>
    </div>
  );
}