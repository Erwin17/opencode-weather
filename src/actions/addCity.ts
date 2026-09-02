import { searchCity } from "../api/geocoding.ts";
import { printError, printInfo } from "../presentation/output.ts";
import { ask } from "../presentation/input.ts";
import { addCity } from "../storage/citiesStorage.ts";
import { getState, saveState, setDefaultCity } from "../storage/settingsStorage.ts";

export async function searchAndAdd(): Promise<void> {
  const name = await ask("  Nombre de la ciudad: ");
  if (!name) return printError("Nombre vacío.");
  printInfo(`Buscando "${name}"…`);
  try {
    const found = await searchCity(name);
    if (!found) return printError(`Sin resultados para "${name}".`);
    const country = found.country ? ` (${found.country})` : "";
    if (!addCity(found)) {
      return printError(`${found.name}${country} ya está registrada.`);
    }
    printInfo(`Agregada: ${found.name}${country} [${found.latitude}, ${found.longitude}]`);
    const state = getState();
    if (state.cities.length === 1 && setDefaultCity(found.id)) {
      printInfo("Establecida como ciudad default.");
    }
    await saveState();
  } catch {
    printError("Falló la búsqueda. Revisa tu conexión.");
  }
}
