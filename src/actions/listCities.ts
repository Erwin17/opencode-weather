import { listCities as renderCities } from "../presentation/menu.ts";
import { printInfo } from "../presentation/output.ts";
import { getState } from "../storage/settingsStorage.ts";

export function listCities(): void {
  const { cities } = getState();
  if (cities.length === 0) return printInfo("No hay ciudades registradas.");
  renderCities(cities, getState().defaultId);
}
