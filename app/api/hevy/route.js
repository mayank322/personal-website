// app/api/hevy/route.js

export async function GET() {
  try {
    const headers = {
      'api-key': process.env.HEVY_API_KEY,
      'accept': 'application/json',
    };

    // Fetch recent workouts (last 10)
    const workoutsRes = await fetch('https://api.hevyapp.com/v1/workouts?page=1&pageSize=10', { headers });
    const workoutsData = await workoutsRes.json();

    if (!workoutsData.workouts) {
      return Response.json({ error: 'Failed to fetch Hevy workouts' }, { status: 500 });
    }

    // Format workouts
    const workouts = workoutsData.workouts.map(w => ({
      id: w.id,
      title: w.title,
      date: w.start_time,
      durationSeconds: w.duration,
      totalVolume: w.exercises?.reduce((total, ex) => {
        return total + (ex.sets?.reduce((s, set) => {
          return s + ((set.weight_kg || 0) * (set.reps || 0));
        }, 0) || 0);
      }, 0) || 0,
      exercises: w.exercises?.map(ex => ({
        name: ex.title,
        sets: ex.sets?.map(set => ({
          type: set.type,
          reps: set.reps,
          weight: set.weight_kg,
          weightLbs: set.weight_lbs,
          durationSeconds: set.duration_seconds,
          rpe: set.rpe,
          indicator: set.indicator,
        })) || [],
      })) || [],
    }));

    // Calculate weekly stats
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const weeklyWorkouts = workouts.filter(w => new Date(w.date).getTime() > sevenDaysAgo);
    const weeklyVolume = weeklyWorkouts.reduce((s, w) => s + w.totalVolume, 0);

    return Response.json({
      workouts,
      weekly: {
        count: weeklyWorkouts.length,
        totalVolume: weeklyVolume,
        totalDuration: weeklyWorkouts.reduce((s, w) => s + (w.durationSeconds || 0), 0),
      },
    });
  } catch (err) {
    console.error('Hevy API error:', err);
    return Response.json({ error: 'Failed to fetch Hevy data' }, { status: 500 });
  }
}