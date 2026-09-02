import { beforeEach, describe, expect, test } from "bun:test";
import { addCity, removeCity } from "../../src/storage/citiesStorage.ts";
import { getState } from "../../src/storage/settingsStorage.ts";
import type { City } from "../../src/types/City.ts";

const lima: City = { id: 1, name: "Lima", latitude: -12.0, longitude: -77.0 };
const bogota: City = { id: 2, name: "Bogotá", latitude: 4.71, longitude: -74.07 };

beforeEach(() => {
  const state = getState();
  state.cities = [];
  state.defaultId = null;
  state.unit = "celsius";
});

describe("addCity", () => {
  test("agrega una ciudad nueva", () => {
    expect(addCity(lima)).toBe(true);
    expect(getState().cities).toEqual([lima]);
  });

  test("no agrega ciudades duplicadas por id", () => {
    addCity(lima);
    expect(addCity(lima)).toBe(false);
    expect(getState().cities).toHaveLength(1);
  });

  test("permite agregar ciudades con ids distintos", () => {
    addCity(lima);
    addCity(bogota);
    expect(getState().cities).toHaveLength(2);
  });
});

describe("removeCity", () => {
  test("elimina una ciudad por índice y la devuelve", () => {
    addCity(lima);
    addCity(bogota);
    const removed = removeCity(0);
    expect(removed).toEqual(lima);
    expect(getState().cities).toEqual([bogota]);
  });

  test("limpia defaultId cuando se elimina la ciudad default", () => {
    addCity(lima);
    addCity(bogota);
    getState().defaultId = lima.id;
    removeCity(0);
    expect(getState().defaultId).toBeNull();
  });

  test("devuelve undefined para índices fuera de rango", () => {
    expect(removeCity(5)).toBeUndefined();
  });
});
