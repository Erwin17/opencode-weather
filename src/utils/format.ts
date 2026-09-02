import type { City } from "../types/City.ts";
import type { DailyForecast, TemperatureUnit, Weather } from "../types/Weather.ts";
import { LINE, WEATHER_DESCRIPTIONS } from "./constants.ts";
import { cyan, yellow } from "./colors.ts";

export function describeWeather(code: number): string {
  return WEATHER_DESCRIPTIONS[code] ?? "Condición desconocida";
}

export function unitSymbol(unit: TemperatureUnit): string {
  return unit === "celsius" ? "°C" : "°F";
}

export function formatWeather(
  city: City,
  weather: Weather,
  unit: TemperatureUnit,
): string {
  const description = describeWeather(weather.weatherCode);
  const temp = yellow(`${weather.temperature.toFixed(1)}${unitSymbol(unit)}`);
  return `${weatherIcon(weather.weatherCode)} ${city.name}: ${description}, ${temp}`;
}

export function formatForecast(
  city: City,
  days: DailyForecast[],
  unit: TemperatureUnit,
): string {
  const unitStr = unitSymbol(unit);
  const lines = days.map((d) => {
    const description = describeWeather(d.weatherCode);
    const range = yellow(
      `${d.minTemperature.toFixed(0)}${unitStr} / ${d.maxTemperature.toFixed(0)}${unitStr}`,
    );
    return `  ${weatherIcon(d.weatherCode)} ${formatDate(d.date)}: ${description} — mín ${range}`;
  });
  return [cyan(LINE), cyan(`   PRONÓSTICO 7 DÍAS — ${city.name}`), cyan(LINE), ...lines, cyan(LINE)].join("\n");
}

export function weatherIcon(code: number): string {
  if (code === 0) return "☀️";
  if (code === 1 || code === 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "🌧️";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "🌨️";
  if (code >= 95) return "⛈️";
  return "🌡️";
}

export function formatDate(date: string): string {
  const day = new Date(`${date}T00:00:00`);
  if (Number.isNaN(day.getTime())) return date;
  const formatter = new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  return formatter.format(day);
}
