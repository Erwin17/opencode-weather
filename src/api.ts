export type UnidadTemperatura = "celsius" | "fahrenheit";

export type Ciudad = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
};

export type Clima = {
  temperatura: number;
  codigo: number;
};

export type PronosticoDiario = {
  fecha: string;
  minTemperatura: number;
  maxTemperatura: number;
  codigo: number;
};

type GeocodingRespuesta = {
  results?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
  }[];
};

type ForecastRespuesta = {
  current?: {
    temperature_2m: number;
    weather_code: number;
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
};

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const DESCRIPCIONES: Record<number, string> = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Neblina",
  48: "Neblina con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna moderada",
  55: "Llovizna intensa",
  56: "Llovizna helada ligera",
  57: "Llovizna helada intensa",
  61: "Lluvia ligera",
  63: "Lluvia moderada",
  65: "Lluvia intensa",
  66: "Lluvia helada ligera",
  67: "Lluvia helada intensa",
  71: "Nieve ligera",
  73: "Nieve moderada",
  75: "Nieve intensa",
  77: "Granos de nieve",
  80: "Chubascos ligeros",
  81: "Chubascos moderados",
  82: "Chubascos violentos",
  85: "Chubascos de nieve ligeros",
  86: "Chubascos de nieve intensos",
  95: "Tormenta eléctrica",
  96: "Tormenta con granizo ligero",
  99: "Tormenta con granizo intenso",
};

export function describirClima(codigo: number): string {
  return DESCRIPCIONES[codigo] ?? "Condición desconocida";
}

export async function buscarCiudad(nombre: string): Promise<Ciudad | null> {
  const params = new URLSearchParams({
    name: nombre,
    count: "1",
    language: "es",
    format: "json",
  });
  const respuesta = await fetch(`${GEOCODING_URL}?${params}`);
  if (!respuesta.ok) throw new Error(`geocoding HTTP ${respuesta.status}`);
  const datos = (await respuesta.json()) as GeocodingRespuesta;
  const resultado = datos.results?.[0];
  if (!resultado) return null;
  return {
    id: resultado.id,
    name: resultado.name,
    latitude: resultado.latitude,
    longitude: resultado.longitude,
    ...(resultado.country !== undefined && { country: resultado.country }),
  };
}

export async function obtenerClima(
  ciudad: Ciudad,
  unidad: UnidadTemperatura,
): Promise<Clima> {
  const params = new URLSearchParams({
    latitude: String(ciudad.latitude),
    longitude: String(ciudad.longitude),
    current: "temperature_2m,weather_code",
  });
  if (unidad === "fahrenheit") params.set("temperature_unit", "fahrenheit");
  const respuesta = await fetch(`${FORECAST_URL}?${params}`);
  if (!respuesta.ok) throw new Error(`forecast HTTP ${respuesta.status}`);
  const datos = (await respuesta.json()) as ForecastRespuesta;
  const actual = datos.current;
  if (!actual) throw new Error("La respuesta no incluye datos actuales");
  return { temperatura: actual.temperature_2m, codigo: actual.weather_code };
}

export async function obtenerPronostico(
  ciudad: Ciudad,
  unidad: UnidadTemperatura,
): Promise<PronosticoDiario[]> {
  const params = new URLSearchParams({
    latitude: String(ciudad.latitude),
    longitude: String(ciudad.longitude),
    daily: "temperature_2m_max,temperature_2m_min,weather_code",
    forecast_days: "7",
  });
  if (unidad === "fahrenheit") params.set("temperature_unit", "fahrenheit");
  const respuesta = await fetch(`${FORECAST_URL}?${params}`);
  if (!respuesta.ok) throw new Error(`forecast HTTP ${respuesta.status}`);
  const datos = (await respuesta.json()) as ForecastRespuesta;
  const diario = datos.daily;
  if (!diario) throw new Error("La respuesta no incluye datos diarios");
  const dias: PronosticoDiario[] = [];
  for (let i = 0; i < diario.time.length; i++) {
    const fecha = diario.time[i];
    const minTemperatura = diario.temperature_2m_min[i];
    const maxTemperatura = diario.temperature_2m_max[i];
    const codigo = diario.weather_code[i];
    if (
      fecha === undefined ||
      minTemperatura === undefined ||
      maxTemperatura === undefined ||
      codigo === undefined
    ) {
      continue;
    }
    dias.push({ fecha, minTemperatura, maxTemperatura, codigo });
  }
  return dias;
}
