// app/api/strava/route.js

async function getAccessToken() {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
  });
  const data = await res.json();
  return data.access_token;
}

export async function GET() {
  try {
    const token = await getAccessToken();

    const headers = { Authorization: `Bearer ${token}` };

    const [activitiesRes, statsRes] = await Promise.all([
      fetch('https://www.strava.com/api/v3/athlete/activities?per_page=10', { headers }),
      fetch('https://www.strava.com/api/v3/athlete', { headers }),
    ]);

    const activities = await activitiesRes.json();
    const athlete = await statsRes.json();

    // Fetch full stats
    const statsFullRes = await fetch(
      `https://www.strava.com/api/v3/athletes/${athlete.id}/stats`,
      { headers }
    );
    const stats = await statsFullRes.json();

    // Build weekly summary from recent activities (last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyActivities = activities.filter(
      a => new Date(a.start_date).getTime() > sevenDaysAgo
    );

    const weekly = {
      totalDistance: weeklyActivities.reduce((s, a) => s + a.distance, 0),
      totalTime: weeklyActivities.reduce((s, a) => s + a.moving_time, 0),
      totalElevation: weeklyActivities.reduce((s, a) => s + a.total_elevation_gain, 0),
      count: weeklyActivities.length,
      calories: weeklyActivities.reduce((s, a) => s + (a.calories || 0), 0),
    };

    // Format activities
    const formattedActivities = activities.map(a => ({
      id: a.id,
      name: a.name,
      type: a.type,
      sport: a.sport_type,
      date: a.start_date_local,
      distance: a.distance,
      movingTime: a.moving_time,
      elapsedTime: a.elapsed_time,
      elevation: a.total_elevation_gain,
      avgHeartRate: a.average_heartrate,
      maxHeartRate: a.max_heartrate,
      avgSpeed: a.average_speed,
      maxSpeed: a.max_speed,
      calories: a.calories,
      kudos: a.kudos_count,
      mapPolyline: a.map?.summary_polyline,
    }));

    return Response.json({
      athlete: {
        name: `${athlete.firstname} ${athlete.lastname}`,
        city: athlete.city,
        country: athlete.country,
        profile: athlete.profile,
      },
      stats: {
        ytdRuns: stats.ytd_run_totals,
        ytdSwims: stats.ytd_swim_totals,
        ytdRides: stats.ytd_ride_totals,
        allRuns: stats.all_run_totals,
        allSwims: stats.all_swim_totals,
      },
      weekly,
      activities: formattedActivities,
    });
  } catch (err) {
    console.error('Strava API error:', err);
    return Response.json({ error: 'Failed to fetch Strava data' }, { status: 500 });
  }
}