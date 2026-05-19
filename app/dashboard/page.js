'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const funds = [
  { name: 'Mirae Asset Large Cap', invested: 80000, current: 98200, cagr: 12 },
  { name: 'Parag Parikh Flexi Cap', invested: 70000, current: 84700, cagr: 13 },
  { name: 'Axis Small Cap', invested: 60000, current: 71400, cagr: 15 },
  { name: 'SBI Nifty Index Fund', invested: 30000, current: 37200, cagr: 11 },
];

const goals = [
  { name: 'New car', target: 2000000, year: 2028 },
  { name: 'Retirement corpus', target: 10000000, year: 2045 },
];

const monthlySIP = 10000;
const lastUpdated = 'May 18, 2026';

function formatINR(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

function projectPortfolio(currentValue, monthlyInvestment, blendedCAGR, years) {
  const monthlyRate = blendedCAGR / 100 / 12;
  let value = currentValue;
  for (let m = 0; m < years * 12; m++) {
    value = value * (1 + monthlyRate) + monthlyInvestment;
  }
  return Math.round(value);
}

function getBlendedCAGR(funds) {
  const totalInvested = funds.reduce((s, f) => s + f.invested, 0);
  return funds.reduce((s, f) => s + (f.cagr * f.invested / totalInvested), 0);
}

function StarRating({ value, max }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ height: '4px', background: '#e5e2d9', borderRadius: '20px', overflow: 'hidden', marginTop: '8px' }}>
      <div style={{ height: '4px', width: `${pct}%`, background: pct >= 100 ? '#1D9E75' : '#4338A0', borderRadius: '20px', transition: 'width 0.6s ease' }}></div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [projection, setProjection] = useState(1);
  const [editingCAGR, setEditingCAGR] = useState(false);
  const [fundData, setFundData] = useState(funds);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('auth');
    if (!isAuth) {
      router.push('/login');
    } else {
      setAuth(true);
    }
  }, [router]);

  if (!auth) return null;

  const totalInvested = fundData.reduce((s, f) => s + f.invested, 0);
  const totalCurrent = fundData.reduce((s, f) => s + f.current, 0);
  const totalReturn = totalCurrent - totalInvested;
  const totalReturnPct = ((totalReturn / totalInvested) * 100).toFixed(1);
  const blendedCAGR = getBlendedCAGR(fundData);

  const projectionYears = [1, 3, 5];
  const projectedValue = projectPortfolio(totalCurrent, monthlySIP, blendedCAGR, projection);
  const projectedInvested = totalInvested + monthlySIP * 12 * projection;

  const projectionPoints = projectionYears.map(y => ({
    year: y,
    projected: projectPortfolio(totalCurrent, monthlySIP, blendedCAGR, y),
    invested: totalInvested + monthlySIP * 12 * y,
  }));

  const maxBar = Math.max(...projectionPoints.map(p => p.projected));

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

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 48px' }}>

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
            { label: 'Total returns', value: `+${formatINR(totalReturn)}`, sub: `+${totalReturnPct}% overall`, positive: true },
            { label: 'Monthly SIP', value: formatINR(monthlySIP), sub: 'active' },
          ].map((card, i) => (
            <div key={i} style={{ background: '#f5f3ef', borderRadius: '10px', padding: '14px 16px' }}>
              <p style={{ fontSize: '11px', color: '#7a7670', marginBottom: '6px' }}>{card.label}</p>
              <p style={{ fontSize: '18px', fontWeight: 500, color: card.positive ? '#0F6E56' : '#1a1714', marginBottom: '2px' }}>{card.value}</p>
              <p style={{ fontSize: '11px', color: card.positive ? '#0F6E56' : '#7a7670' }}>{card.sub}</p>
            </div>
          ))}
        </section>

        {/* Projection chart */}
        <section style={{ background: '#f5f3ef', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 500, color: '#1a1714', marginBottom: '2px' }}>Portfolio projection</p>
              <p style={{ fontSize: '11px', color: '#7a7670' }}>at current SIP rate · blended CAGR {blendedCAGR.toFixed(1)}%</p>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {projectionYears.map(y => (
                <button key={y} onClick={() => setProjection(y)}
                  style={{ fontSize: '11px', padding: '4px 12px', borderRadius: '20px', border: '0.5px solid', borderColor: projection === y ? '#1a1714' : '#e5e2d9', background: projection === y ? '#1a1714' : 'transparent', color: projection === y ? '#faf9f7' : '#7a7670', cursor: 'pointer' }}>
                  {y}yr
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            {[['#B4B2A9', 'Amount invested'], ['#1D9E75', 'Projected value']].map(([color, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color }}></div>
                <span style={{ fontSize: '11px', color: '#7a7670' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Bars */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '120px', marginBottom: '8px' }}>
            {projectionPoints.map(p => (
              <div key={p.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '3px', position: 'relative' }}>
                <span style={{ fontSize: '10px', color: '#3d3a36', position: 'absolute', top: 0 }}>{formatINR(p.projected)}</span>
                <div style={{ width: '100%', display: 'flex', gap: '4px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, background: '#B4B2A9', borderRadius: '3px 3px 0 0', height: `${(p.invested / maxBar) * 90}px` }}></div>
                  <div style={{ flex: 1, background: '#1D9E75', borderRadius: '3px 3px 0 0', height: `${(p.projected / maxBar) * 90}px`, opacity: 0.85 }}></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {projectionPoints.map(p => (
              <div key={p.year} style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: '#7a7670' }}>{p.year} yr</div>
            ))}
          </div>
        </section>

        {/* Goals */}
        <section style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '13px', fontWeight: 500, color: '#1a1714', marginBottom: '12px' }}>Goals</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {goals.map((goal, i) => {
              const yearsLeft = goal.year - 2026;
              const projected = projectPortfolio(totalCurrent / goals.length, monthlySIP / goals.length, blendedCAGR, yearsLeft);
              const onTrack = projected >= goal.target;
              const pct = Math.min(100, (projected / goal.target) * 100);
              const gap = goal.target - projected;
              return (
                <div key={i} style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#1a1714' }}>{goal.name}</p>
                    <p style={{ fontSize: '12px', color: '#7a7670' }}>by {goal.year}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <p style={{ fontSize: '10px', color: '#7a7670', marginBottom: '2px' }}>Projected by {goal.year}</p>
                      <p style={{ fontSize: '15px', fontWeight: 500, color: onTrack ? '#0F6E56' : '#A32D2D' }}>{formatINR(projected)}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '10px', color: '#7a7670', marginBottom: '2px' }}>Target</p>
                      <p style={{ fontSize: '13px', color: '#7a7670' }}>{formatINR(goal.target)}</p>
                    </div>
                  </div>
                  <StarRating value={projected} max={goal.target} />
                  <p style={{ fontSize: '11px', marginTop: '8px', color: onTrack ? '#0F6E56' : '#A32D2D' }}>
                    {onTrack ? `✓ On track — projected surplus of ${formatINR(projected - goal.target)}` : `↑ Need approx ${formatINR(gap)} more to hit target`}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Fund breakdown */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#1a1714' }}>Fund breakdown</p>
            <button onClick={() => setEditingCAGR(!editingCAGR)}
              style={{ fontSize: '11px', color: '#4338A0', background: 'transparent', border: '0.5px solid #e5e2d9', borderRadius: '6px', padding: '3px 10px', cursor: 'pointer' }}>
              {editingCAGR ? 'Done editing' : 'Edit CAGR'}
            </button>
          </div>
          <div style={{ border: '0.5px solid #e5e2d9', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px 80px 60px', gap: '8px', padding: '8px 16px', background: '#f5f3ef', borderBottom: '0.5px solid #e5e2d9' }}>
              {['Fund', 'CAGR', 'Invested', 'Current', 'Return'].map(h => (
                <span key={h} style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#7a7670' }}>{h}</span>
              ))}
            </div>
            {fundData.map((fund, i) => {
              const ret = ((fund.current - fund.invested) / fund.invested * 100).toFixed(1);
              const isLast = i === fundData.length - 1;
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px 80px 60px', gap: '8px', padding: '12px 16px', borderBottom: isLast ? 'none' : '0.5px solid #e5e2d9', alignItems: 'center', background: '#fff' }}>
                  <span style={{ fontSize: '12px', color: '#1a1714' }}>{fund.name}</span>
                  {editingCAGR ? (
                    <input type="number" value={fund.cagr}
                      onChange={e => setFundData(prev => prev.map((f, j) => j === i ? { ...f, cagr: parseFloat(e.target.value) || 0 } : f))}
                      style={{ width: '48px', height: '28px', fontSize: '11px', border: '0.5px solid #4338A0', borderRadius: '4px', padding: '0 6px', outline: 'none', fontFamily: 'inherit' }} />
                  ) : (
                    <span style={{ fontSize: '11px', color: '#7a7670' }}>{fund.cagr}%</span>
                  )}
                  <span style={{ fontSize: '11px', color: '#7a7670' }}>{formatINR(fund.invested)}</span>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#1a1714' }}>{formatINR(fund.current)}</span>
                  <span style={{ fontSize: '11px', color: '#0F6E56' }}>+{ret}%</span>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: '11px', color: '#c8c4ba', marginTop: '8px' }}>Editing CAGR updates projections in real time.</p>
        </section>

      </div>
    </div>
  );
}