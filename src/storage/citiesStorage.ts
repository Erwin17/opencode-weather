import type { City } from "../types/City.ts";
import { getState } from "./settingsStorage.ts";

export function addCity(city: City): boolean {
  const state = getState();
  if (state.cities.some((c) => c.id === city.id)) return false;
  state.cities.push(city);
  return true;
}

export function removeCity(index: number): City | undefined {
  const state = getState();
  const removed = state.cities.splice(index, 1);
  const city = removed[0];
  if (city && state.defaultId === city.id) state.defaultId = null;
  return city;
}
