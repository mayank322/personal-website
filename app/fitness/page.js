'use client';
import { useState, useEffect } from 'react';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtKm(meters) {
  return (meters / 1000).toFixed(1) + ' km';
}

function fmtPace(metersPerSec) {
  if (!metersPerSec) return '—';
  const secPerKm = 1000 / metersPerSec;
  const mins = Math.floor(secPerKm / 60);
  const secs = Math.floor(secPerKm % 60).toString().padStart(2, '0');
  return `${mins}:${secs} /km`;
}

function fmtTime(seconds) {
  if (!seconds) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s}s`;
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function sportIcon(type) {
  const icons = {
    Run: '🏃', Swim: '🏊', Ride: '🚴', Walk: '🚶',
    Hike: '⛰️', Workout: '💪', WeightTraining: '🏋️',
    Yoga: '🧘', Soccer: '⚽', Tennis: '🎾',
  };
  return icons[type] || '🏃';
}

function sportColor(type) {
  const colors = {
    Run: { bg: '#E1F5EE', text: '#085041', border: '#9FE1CB' },
    Swim: { bg: '#E6F1FB', text: '#0C447C', border: '#B5D4F4' },
    Ride: { bg: '#FAEEDA', text: '#633806', border: '#FAC775' },
    Walk: { bg: '#EAF3DE', text: '#27500A', border: '#C0DD97' },
    WeightTraining: { bg: '#EEEDFE', text: '#3C3489', border: '#CECBF6' },
    Workout: { bg: '#EEEDFE', text: '#3C3489', border: '#CECBF6' },
  };
  return colors[type] || { bg: '#F1EFE8', text: '#444441', border: '#D3D1C7' };
}

// ─── Goal Card ────────────────────────────────────────────────────────────────

function GoalCard({ label, current, target, unit, suffix, color }) {
  const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  const colors = {
    purple: { bar: '#534AB7', bg: '#EEEDFE', text: '#3C3489' },
    teal: { bar: '#1D9E75', bg: '#E1F5EE', text: '#085041' },
    amber: { bar: '#BA7517', bg: '#FAEEDA', text: '#633806' },
    blue: { bar: '#378ADD', bg: '#E6F1FB', text: '#185FA5' },
  };
  const c = colors[color] || colors.purple;

  return (
    <div style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '8px', padding: '16px' }}>
      <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a7670', marginBottom: '10px' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '10px' }}>
        <span style={{ fontSize: '22px', fontWeight: 500, color: '#1a1714', fontFamily: 'Georgia, serif' }}>
          {current !== null && current !== undefined ? current : '—'}
        </span>
        <span style={{ fontSize: '13px', color: '#7a7670' }}>{unit}</span>
        <span style={{ fontSize: '12px', color: '#c8c4ba', marginLeft: 'auto' }}>/ {target}{unit}</span>
      </div>
      <div style={{ background: c.bg, borderRadius: '4px', height: '6px' }}>
        <div style={{
          background: c.bar, borderRadius: '4px', height: '6px',
          width: `${pct}%`, transition: 'width 0.8s ease',
        }} />
      </div>
      <p style={{ fontSize: '11px', color: c.text, marginTop: '6px' }}>{pct.toFixed(0)}% complete</p>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }) {
  return (
    <div style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '8px', padding: '16px' }}>
      <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a7670', marginBottom: '8px' }}>{label}</p>
      <p style={{ fontSize: '20px', fontWeight: 500, color: '#1a1714', marginBottom: '4px', fontFamily: 'Georgia, serif' }}>{value}</p>
      {sub && <p style={{ fontSize: '11px', color: '#c8c4ba' }}>{sub}</p>}
    </div>
  );
}

// ─── Activity Card ────────────────────────────────────────────────────────────

function ActivityCard({ activity }) {
  const c = sportColor(activity.type);
  return (
    <div style={{ background: '#fff', border: '0.5px solid #e5e2d9', borderRadius: '8px', padding: '16px 18px', marginBottom: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>{sportIcon(activity.type)}</span>
          <div>
            <p style={{ fontSize: '14px', color: '#1a1714', fontWeight: 500, marginBottom: '2px' }}>{activity.name}</p>
            <p style={{ fontSize: '11px', color: '#c8c4ba' }}>{fmtDate(activity.date)}</p>
          </div>
        </div>
        <span style={{
          fontSize: '11px', padding: '3px 10px', borderRadius: '20px',
          background: c.bg, color: c.text, border: `0.5px solid ${c.border}`
        }}>{activity.sport || activity.type}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {activity.distance > 0 && (
          <div>
            <p style={{ fontSize: '11px', color: '#7a7670', marginBottom: '2px' }}>Distance</p>
            <p style={{ fontSize: '14px', color: '#1a1714', fontWeight: 500 }}>{fmtKm(activity.distance)}</p>
          </div>
        )}
        <div>
          <p style={{ fontSize: '11px', color: '#7a7670', marginBottom: '2px' }}>Time</p>
          <p style={{ fontSize: '14px', color: '#1a1714', fontWeight: 500 }}>{fmtTime(activity.movingTime)}</p>
        </div>
        {activity.distance > 0 && activity.movingTime > 0 && (
          <div>
            <p style={{ fontSize: '11px', color: '#7a7670', marginBottom: '2px' }}>Pace</p>
            <p style={{ fontSize: '14px', color: '#1a1714', fontWeight: 500 }}>{fmtPace(activity.avgSpeed)}</p>
          </div>
        )}
        {activity.avgHeartRate && (
          <div>
            <p style={{ fontSize: '11px', color: '#7a7670', marginBottom: '2px' }}>Avg HR</p>
            <p style={{ fontSize: '14px', color: '#1a1714', fontWeight: 500 }}>{Math.round(activity.avgHeartRate)} bpm</p>
          </div>
        )}
        {activity.elevation > 0 && (
          <div>
            <p style={{ fontSize: '11px', color: '#7a7670', marginBottom: '2px' }}>Elevation</p>
            <p style={{ fontSize: '14px', color: '#1a1714', fontWeight: 500 }}>{Math.round(activity.elevation)}m</p>
          </div>
        )}
        {activity.calories > 0 && (
          <div>
            <p style={{ fontSize: '11px', color: '#7a7670', marginBottom: '2px' }}>Calories</p>
            <p style={{ fontSize: '14px', color: '#1a1714', fontWeight: 500 }}>{Math.round(activity.calories)} kcal</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Fitness Page ────────────────────────────────────────────────────────

export default function FitnessPage() {
  const [data, setData] = useState(null);
  const [goals, setGoals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    async function load() {
      try {
        const [stravaRes, goalsRes] = await Promise.all([
          fetch('/api/strava'),
          fetch('/api/fitness-goals'),
        ]);
        const stravaData = await stravaRes.json();
        const goalsData = await goalsRes.json();
        if (stravaData.error) throw new Error(stravaData.error);
        setData(stravaData);
        setGoals(goalsData.goals);
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filters = ['All', 'Run', 'Swim', 'Ride', 'Workout'];
  const filteredActivities = data?.activities?.filter(
    a => activeFilter === 'All' || a.type === activeFilter || a.sport === activeFilter
  ) || [];

  return (
    <div style={{ background: '#faf9f7', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Nav */}
      <nav style={{
        borderBottom: '0.5px solid #e5e2d9', padding: '18px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#faf9f7', position: 'sticky', top: 0, zIndex: 50
      }}>
        <a href="/" style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: '#1a1714', textDecoration: 'none' }}>
          Mayank Prasad
        </a>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['about', 'projects', 'blog', 'fitness', 'ideas', 'media'].map(p => (
            <a key={p} href={`/${p}`} style={{
              fontSize: '13px', color: p === 'fitness' ? '#1a1714' : '#7a7670',
              textDecoration: 'none', fontWeight: p === 'fitness' ? 500 : 400,
              borderBottom: p === 'fitness' ? '1px solid #1a1714' : 'none',
              paddingBottom: '2px'
            }}>{p}</a>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 48px 80px' }}>

        {/* Header */}
        <section style={{ padding: '48px 0 32px' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4338A0', marginBottom: '8px' }}>Fitness</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: '#1a1714', fontWeight: 400, marginBottom: '12px' }}>
            Moving every day.
          </h1>
          <p style={{ fontSize: '15px', color: '#7a7670', lineHeight: '1.7', maxWidth: '520px' }}>
            Running, swimming, lifting — tracking it all here. Data pulled live from Strava and Garmin.
          </p>
        </section>

        {loading && (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#7a7670', fontSize: '14px' }}>
            Loading your data...
          </div>
        )}

        {error && (
          <div style={{ padding: '24px', background: '#FCEBEB', borderRadius: '8px', color: '#791F1F', fontSize: '14px' }}>
            Could not load Strava data: {error}
          </div>
        )}

        {data && (
          <>
            {/* Goals */}
            {goals && (
              <section style={{ marginBottom: '40px' }}>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a7670', marginBottom: '14px' }}>Goals</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <GoalCard
                    label={goals.race?.label || 'Race goal'}
                    current={goals.race?.currentSeconds ? Math.floor(goals.race.currentSeconds / 60) + ':' + String(goals.race.currentSeconds % 60).padStart(2, '0') : '—'}
                    target="45:00"
                    unit=""
                    color="purple"
                  />
                  <GoalCard
                    label={goals.weight?.label || 'Weight'}
                    current={goals.weight?.current}
                    target={goals.weight?.target || 75}
                    unit=" kg"
                    color="teal"
                  />
                  <GoalCard
                    label={goals.yearlyKm?.label || 'Yearly km'}
                    current={data.stats?.ytdRuns?.distance ? (data.stats.ytdRuns.distance / 1000).toFixed(0) : 0}
                    target={goals.yearlyKm?.target || 1000}
                    unit=" km"
                    color="amber"
                  />
                </div>
              </section>
            )}

            {/* This week */}
            <section style={{ marginBottom: '40px' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a7670', marginBottom: '14px' }}>This week</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <StatCard label="Distance" value={fmtKm(data.weekly.totalDistance)} sub={`${data.weekly.count} activities`} />
                <StatCard label="Time" value={fmtTime(data.weekly.totalTime)} sub="moving time" />
                <StatCard label="Elevation" value={`${Math.round(data.weekly.totalElevation)}m`} sub="gained" />
                <StatCard label="Calories" value={data.weekly.calories > 0 ? `${Math.round(data.weekly.calories)} kcal` : '—'} sub="burned" />
              </div>
            </section>

            {/* Year to date */}
            <section style={{ marginBottom: '40px' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a7670', marginBottom: '14px' }}>2026 so far</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <StatCard
                  label="Running"
                  value={fmtKm(data.stats?.ytdRuns?.distance || 0)}
                  sub={`${data.stats?.ytdRuns?.count || 0} runs · ${fmtTime(data.stats?.ytdRuns?.moving_time || 0)}`}
                />
                <StatCard
                  label="Swimming"
                  value={fmtKm(data.stats?.ytdSwims?.distance || 0)}
                  sub={`${data.stats?.ytdSwims?.count || 0} swims`}
                />
                <StatCard
                  label="All time runs"
                  value={fmtKm(data.stats?.allRuns?.distance || 0)}
                  sub={`${data.stats?.allRuns?.count || 0} total runs`}
                />
              </div>
            </section>

            {/* Activity feed */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#7a7670' }}>Recent activities</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {filters.map(f => (
                    <button key={f} onClick={() => setActiveFilter(f)} style={{
                      fontSize: '12px', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer',
                      border: activeFilter === f ? 'none' : '0.5px solid #e5e2d9',
                      background: activeFilter === f ? '#4338A0' : 'transparent',
                      color: activeFilter === f ? '#fff' : '#7a7670',
                    }}>{f}</button>
                  ))}
                </div>
              </div>

              {filteredActivities.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#c8c4ba', textAlign: 'center', padding: '40px 0' }}>
                  No {activeFilter.toLowerCase()} activities yet.
                </p>
              ) : (
                filteredActivities.map(a => <ActivityCard key={a.id} activity={a} />)
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}