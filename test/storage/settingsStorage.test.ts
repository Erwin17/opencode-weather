import { describe, expect, test } from "bun:test";
import {
  getState,
  setDefaultCity,
  toggleUnit,
} from "../../src/storage/settingsStorage.ts";
import type { City } from "../../src/types/City.ts";

const cityA: City = { id: 1, name: "Lima", latitude: -12.0, longitude: -77.0 };

describe("settingsStorage / estado en memoria", () => {
  test("getState devuelve el estado inicial", () => {
    const state = getState();
    expect(state.cities).toEqual([]);
    expect(state.defaultId).toBeNull();
    expect(state.unit).toBe("celsius");
  });

  test("setDefaultCity devuelve true y actualiza cuando la ciudad existe", () => {
    getState().cities.push(cityA);
    const result = setDefaultCity(cityA.id);
    expect(result).toBe(true);
    expect(getState().defaultId).toBe(cityA.id);
    getState().cities = [];
    getState().defaultId = null;
  });

  test("setDefaultCity devuelve false cuando la ciudad no existe", () => {
    expect(setDefaultCity(999)).toBe(false);
    expect(getState().defaultId).toBeNull();
  });

  test("toggleUnit alterna entre celsius y fahrenheit", () => {
    getState().unit = "celsius";
    expect(toggleUnit()).toBe("fahrenheit");
    expect(getState().unit).toBe("fahrenheit");
    expect(toggleUnit()).toBe("celsius");
  });
});
