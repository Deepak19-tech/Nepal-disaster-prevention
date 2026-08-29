export type HazardObservation = { source: "open-meteo" | "usgs"; category: "weather" | "seismic"; observedAt: string; payload: unknown };

const NEPAL_BOUNDS = "minlatitude=26&maxlatitude=31&minlongitude=80&maxlongitude=89";
export async function fetchPublicHazardObservations(): Promise<HazardObservation[]> {
  const observations: HazardObservation[] = [];
  const [weather, seismic] = await Promise.allSettled([
    fetch("https://api.open-meteo.com/v1/forecast?latitude=28.3949&longitude=84.1240&current=precipitation,wind_speed_10m&timezone=Asia%2FKathmandu"),
    fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=time&limit=20&${NEPAL_BOUNDS}`),
  ]);
  if (weather.status === "fulfilled" && weather.value.ok) observations.push({ source: "open-meteo", category: "weather", observedAt: new Date().toISOString(), payload: await weather.value.json() });
  if (seismic.status === "fulfilled" && seismic.value.ok) observations.push({ source: "usgs", category: "seismic", observedAt: new Date().toISOString(), payload: await seismic.value.json() });
  return observations;
}
