import type { City } from "../types/City.ts";
import type { TemperatureUnit } from "../types/Weather.ts";
import { LINE } from "../utils/constants.ts";
import { cyan } from "../utils/colors.ts";
import { unitSymbol } from "../utils/format.ts";

export function renderMenu(
  totalCities: number,
  unit: TemperatureUnit,
): string {
  return [
    cyan(LINE),
    cyan("         WEATHER CLI"),
    cyan(LINE),
    "  1. Clima de ciudad default",
    `  2. Clima de todas las ciudades (${totalCities})`,
    "  3. Buscar y agregar ciudad",
    "  4. Eliminar ciudad",
    "  5. Establecer ciudad default",
    "  6. Pronóstico 7 días (default)",
    `  8. Ajustes (${unitSymbol(unit)})`,
    "  9. Salir",
    cyan(LINE),
  ].join("\n");
}

export function listCities(cities: City[], defaultId: number | null): void {
  cities.forEach((city, i) => {
    const country = city.country ? ` (${city.country})` : "";
    const mark = city.id === defaultId ? " [default]" : "";
    console.log(`  ${i + 1}. ${city.name}${country}${mark}`);
  });
}
