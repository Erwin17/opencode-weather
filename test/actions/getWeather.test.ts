import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  mock,
  test,
} from "bun:test";
import {
  fakeWeather,
  installStorageMocks,
  installWeatherMock,
  resetTestState,
  testState,
} from "../mocks.ts";

installStorageMocks();
installWeatherMock();

type DefaultWeather = typeof import("../../src/actions/getWeather.ts").defaultWeather;
type AllCitiesWeather = typeof import("../../src/actions/getWeather.ts").allCitiesWeather;
type DefaultForecast = typeof import("../../src/actions/getWeather.ts").defaultForecast;

let defaultWeather: DefaultWeather;
let allCitiesWeather: AllCitiesWeather;
let defaultForecast: DefaultForecast;
let logged: string[] = [];

beforeAll(async () => {
  const mod = await import("../../src/actions/getWeather.ts");
  defaultWeather = mod.defaultWeather;
  allCitiesWeather = mod.allCitiesWeather;
  defaultForecast = mod.defaultForecast;
});

beforeEach(() => {
  resetTestState();
  logged = [];
  const spy = mock((...args: unknown[]) => {
    logged.push(String(args[0] ?? ""));
  });
  console.log = spy as typeof console.log;
});

const lima = { id: 1, name: "Lima", latitude: -12.0, longitude: -77.0 };

describe("defaultWeather", () => {
  test("muestra mensaje si no hay ciudad default", async () => {
    await defaultWeather();
    expect(logged.some((l) => l.includes("No hay ciudad default"))).toBe(true);
  });

  test("muestra el clima de la ciudad default", async () => {
    testState.cities = [lima];
    testState.defaultId = 1;
    fakeWeather.weather = { temperature: 22.5, weatherCode: 0 };
    await defaultWeather();
    expect(logged.some((l) => l.includes("Lima") && l.includes("22.5°C"))).toBe(true);
  });

  test("muestra error si falla la API", async () => {
    testState.cities = [lima];
    testState.defaultId = 1;
    fakeWeather.error = true;
    await defaultWeather();
    expect(logged.some((l) => l.includes("No se pudo obtener el clima"))).toBe(true);
  });
});

describe("allCitiesWeather", () => {
  test("muestra mensaje si no hay ciudades", async () => {
    await allCitiesWeather();
    expect(logged.some((l) => l.includes("No hay ciudades"))).toBe(true);
  });

  test("muestra el clima de cada ciudad", async () => {
    testState.cities = [
      { ...lima },
      { id: 2, name: "Bogotá", latitude: 4.7, longitude: -74.0 },
    ];
    await allCitiesWeather();
    expect(logged.some((l) => l.includes("Lima"))).toBe(true);
    expect(logged.some((l) => l.includes("Bogotá"))).toBe(true);
  });
});

describe("defaultForecast", () => {
  test("muestra mensaje si no hay ciudad default", async () => {
    await defaultForecast();
    expect(logged.some((l) => l.includes("No hay ciudad default"))).toBe(true);
  });

  test("muestra el pronóstico de la ciudad default", async () => {
    testState.cities = [lima];
    testState.defaultId = 1;
    fakeWeather.forecast = [
      { date: "2026-09-02", minTemperature: 20, maxTemperature: 26, weatherCode: 1 },
    ];
    await defaultForecast();
    expect(logged.some((l) => l.includes("PRONÓSTICO 7 DÍAS"))).toBe(true);
    expect(logged.some((l) => l.includes("20°C / 26°C"))).toBe(true);
  });

  test("muestra error si falla la API", async () => {
    testState.cities = [lima];
    testState.defaultId = 1;
    fakeWeather.error = true;
    await defaultForecast();
    expect(logged.some((l) => l.includes("No se pudo obtener el pronóstico"))).toBe(true);
  });
});
