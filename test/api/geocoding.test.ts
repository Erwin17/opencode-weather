import { describe, expect, test } from "bun:test";
import { searchCity } from "../../src/api/geocoding.ts";
import { GEOCODING_URL } from "../../src/utils/constants.ts";
import { mockFetch, mockFetchError } from "../helpers.ts";

describe("searchCity", () => {
  test("retorna la primera ciudad cuando hay resultados", async () => {
    let calledUrl = "";
    mockFetch(async (url) => {
      calledUrl = url;
      return {
        results: [
          {
            id: 3936456,
            name: "Lima",
            latitude: -12.0432,
            longitude: -77.0282,
            country: "Peru",
          },
        ],
      };
    });

    const city = await searchCity("Lima");
    expect(city).toEqual({
      id: 3936456,
      name: "Lima",
      latitude: -12.0432,
      longitude: -77.0282,
      country: "Peru",
    });
    expect(calledUrl).toContain(GEOCODING_URL);
    expect(calledUrl).toContain("name=Lima");
    expect(calledUrl).toContain("count=1");
    expect(calledUrl).toContain("language=es");
  });

  test("retorna null cuando no hay resultados", async () => {
    mockFetch(async () => ({ results: [] }));
    expect(await searchCity("CiudadInexistente")).toBeNull();
  });

  test("retorna null cuando la respuesta no incluye results", async () => {
    mockFetch(async () => ({}));
    expect(await searchCity("Nada")).toBeNull();
  });

  test("omite country cuando no viene en la respuesta", async () => {
    mockFetch(async () => ({
      results: [{ id: 1, name: "Test", latitude: 0, longitude: 0 }],
    }));
    const city = await searchCity("Test");
    expect(city).toEqual({ id: 1, name: "Test", latitude: 0, longitude: 0 });
    expect("country" in city!).toBe(false);
  });

  test("lanza un error ante una respuesta HTTP no OK", async () => {
    mockFetchError(500);
    expect(searchCity("Lima")).rejects.toThrow("geocoding HTTP 500");
  });
});
