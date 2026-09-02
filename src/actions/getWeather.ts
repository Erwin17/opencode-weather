import { getWeather, getForecast } from "../api/weather.ts";
import type { City } from "../types/City.ts";
import { formatForecast, formatWeather } from "../utils/format.ts";
import { printError, printInfo } from "../presentation/output.ts";
import { getState } from "../storage/settingsStorage.ts";

async function printWeather(city: City): Promise<void> {
  const state = getState();
  try {
    const weather = await getWeather(city, state.unit);
    console.log(`  ${formatWeather(city, weather, state.unit)}`);
  } catch {
    printError(`No se pudo obtener el clima de ${city.name}.`);
  }
}

export async function defaultWeather(): Promise<void> {
  const state = getState();
  const city = state.cities.find((c) => c.id === state.defaultId);
  if (!city) {
    return printInfo("No hay ciudad default. Agrega una (opción 3) y establécela (opción 5).");
  }
  await printWeather(city);
}

export async function allCitiesWeather(): Promise<void> {
  const { cities } = getState();
  if (cities.length === 0) {
    return printInfo("No hay ciudades registradas. Usa la opción 3 para agregar una.");
  }
  for (const city of cities) {
    await printWeather(city);
  }
}

export async function defaultForecast(): Promise<void> {
  const state = getState();
  const city = state.cities.find((c) => c.id === state.defaultId);
  if (!city) {
    return printInfo("No hay ciudad default. Agrega una (opción 3) y establécela (opción 5).");
  }
  try {
    const days = await getForecast(city, state.unit);
    console.log(formatForecast(city, days, state.unit));
  } catch {
    printError(`No se pudo obtener el pronóstico de ${city.name}.`);
  }
}
