import { listCities } from "../presentation/menu.ts";
import { ask, parseIndex } from "../presentation/input.ts";
import { printError, printInfo } from "../presentation/output.ts";
import { getState, saveState, setDefaultCity } from "../storage/settingsStorage.ts";

export async function setDefaultCityFlow(): Promise<void> {
  const { cities } = getState();
  if (cities.length === 0) return printInfo("No hay ciudades registradas.");
  listCities(cities, getState().defaultId);
  const input = await ask("  Número de ciudad default: ");
  const index = parseIndex(input, cities.length);
  const city = index === null ? undefined : cities[index];
  if (!city || !setDefaultCity(city.id)) return printError("Selección inválida.");
  await saveState();
  printInfo(`Ciudad default: ${city.name}`);
}
