import type { City } from "../types/City.ts";
import type { DailyForecast, TemperatureUnit, Weather } from "../types/Weather.ts";
import { FORECAST_URL } from "../utils/constants.ts";

type ForecastResponse = {
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

export async function getWeather(
  city: City,
  unit: TemperatureUnit,
): Promise<Weather> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: "temperature_2m,weather_code",
  });
  if (unit === "fahrenheit") params.set("temperature_unit", "fahrenheit");
  const response = await fetch(`${FORECAST_URL}?${params}`);
  if (!response.ok) throw new Error(`forecast HTTP ${response.status}`);
  const data = (await response.json()) as ForecastResponse;
  const current = data.current;
  if (!current) throw new Error("La respuesta no incluye datos actuales");
  return { temperature: current.temperature_2m, weatherCode: current.weather_code };
}

export async function getForecast(
  city: City,
  unit: TemperatureUnit,
): Promise<DailyForecast[]> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    daily: "temperature_2m_max,temperature_2m_min,weather_code",
    forecast_days: "7",
  });
  if (unit === "fahrenheit") params.set("temperature_unit", "fahrenheit");
  const response = await fetch(`${FORECAST_URL}?${params}`);
  if (!response.ok) throw new Error(`forecast HTTP ${response.status}`);
  const data = (await response.json()) as ForecastResponse;
  const daily = data.daily;
  if (!daily) throw new Error("La respuesta no incluye datos diarios");
  const days: DailyForecast[] = [];
  for (let i = 0; i < daily.time.length; i++) {
    const date = daily.time[i];
    const minTemperature = daily.temperature_2m_min[i];
    const maxTemperature = daily.temperature_2m_max[i];
    const weatherCode = daily.weather_code[i];
    if (
      date === undefined ||
      minTemperature === undefined ||
      maxTemperature === undefined ||
      weatherCode === undefined
    ) {
      continue;
    }
    days.push({ date, minTemperature, maxTemperature, weatherCode });
  }
  return days;
}
