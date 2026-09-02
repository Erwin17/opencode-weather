import { mock } from "bun:test";
import type { City } from "../src/types/City.ts";
import type { DailyForecast, TemperatureUnit, Weather } from "../src/types/Weather.ts";

export type FakeState = {
  cities: City[];
  defaultId: number | null;
  unit: TemperatureUnit;
};

export const testState: FakeState = {
  cities: [],
  defaultId: null,
  unit: "celsius",
};

export const fakeInput = {
  value: "",
  eof: false,
  indexValue: null as number | null,
};

export const fakeGeocoding = {
  name: "",
  result: null as City | null,
  error: false,
};

export const fakeWeather = {
  weather: { temperature: 22, weatherCode: 0 } as Weather,
  forecast: [] as DailyForecast[],
  error: false,
};

export function resetTestState(): void {
  testState.cities = [];
  testState.defaultId = null;
  testState.unit = "celsius";
  fakeInput.value = "";
  fakeInput.eof = false;
  fakeInput.indexValue = null;
  fakeGeocoding.name = "";
  fakeGeocoding.result = null;
  fakeGeocoding.error = false;
  fakeWeather.weather = { temperature: 22, weatherCode: 0 };
  fakeWeather.forecast = [];
  fakeWeather.error = false;
}

export function installStorageMocks(): void {
  mock.module("../src/storage/settingsStorage.ts", () => ({
    getState: () => testState,
    saveState: async () => {},
    setDefaultCity: (id: number) => {
      if (!testState.cities.some((c) => c.id === id)) return false;
      testState.defaultId = id;
      return true;
    },
    toggleUnit: () => {
      testState.unit = testState.unit === "celsius" ? "fahrenheit" : "celsius";
      return testState.unit;
    },
    loadState: async () => {},
  }));

  mock.module("../src/storage/citiesStorage.ts", () => ({
    addCity: (city: City) => {
      if (testState.cities.some((c) => c.id === city.id)) return false;
      testState.cities.push(city);
      return true;
    },
    removeCity: (index: number): City | undefined => {
      const removed = testState.cities.splice(index, 1);
      const city = removed[0];
      if (city && testState.defaultId === city.id) testState.defaultId = null;
      return city;
    },
  }));
}

export function installInputMocks(): void {
  mock.module("../src/presentation/input.ts", () => ({
    ask: async () => fakeInput.value,
    isEof: () => fakeInput.eof,
    closeReader: async () => {},
    parseIndex: (_s: string) => fakeInput.indexValue,
  }));
}

export function installGeocodingMock(): void {
  mock.module("../src/api/geocoding.ts", () => ({
    searchCity: async (name: string): Promise<City | null> => {
      if (fakeGeocoding.error) throw new Error("red");
      return fakeGeocoding.result;
    },
  }));
}

export function installWeatherMock(): void {
  mock.module("../src/api/weather.ts", () => ({
    getWeather: async (): Promise<Weather> => {
      if (fakeWeather.error) throw new Error("api");
      return fakeWeather.weather;
    },
    getForecast: async (): Promise<DailyForecast[]> => {
      if (fakeWeather.error) throw new Error("api");
      return fakeWeather.forecast;
    },
  }));
}
