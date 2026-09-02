import { listCities } from "../presentation/menu.ts";
import { ask, parseIndex } from "../presentation/input.ts";
import { printError, printInfo } from "../presentation/output.ts";
import { removeCity } from "../storage/citiesStorage.ts";
import { getState, saveState } from "../storage/settingsStorage.ts";

export async function removeCityFlow(): Promise<void> {
  const { cities } = getState();
  if (cities.length === 0) return printInfo("No hay ciudades registradas.");
  listCities(cities, getState().defaultId);
  const input = await ask("  Número de ciudad a eliminar: ");
  const index = parseIndex(input, cities.length);
  const removed = index === null ? undefined : removeCity(index);
  if (!removed) return printError("Selección inválida.");
  await saveState();
  printInfo(`Eliminada: ${removed.name}`);
}
