import { describe, expect, test } from "bun:test";
import { getForecast, getWeather } from "../../src/api/weather.ts";
import type { City } from "../../src/types/City.ts";
import { FORECAST_URL } from "../../src/utils/constants.ts";
import { mockFetch, mockFetchError } from "../helpers.ts";

const lima: City = { id: 1, name: "Lima", latitude: -12.04, longitude: -77.03 };

describe("getWeather", () => {
  test("retorna el clima actual", async () => {
    let calledUrl = "";
    mockFetch(async (url) => {
      calledUrl = url;
      return {
        current: { temperature_2m: 22.5, weather_code: 0 },
      };
    });

    const weather = await getWeather(lima, "celsius");
    expect(weather).toEqual({ temperature: 22.5, weatherCode: 0 });
    expect(calledUrl).toContain(FORECAST_URL);
    expect(calledUrl).toContain(`latitude=-12.04`);
    expect(calledUrl).toContain("current=temperature_2m%2Cweather_code");
  });

  test("agrega temperature_unit=fahrenheit cuando la unidad es fahrenheit", async () => {
    let calledUrl = "";
    mockFetch(async (url) => {
      calledUrl = url;
      return { current: { temperature_2m: 72, weather_code: 1 } };
    });
    await getWeather(lima, "fahrenheit");
    expect(calledUrl).toContain("temperature_unit=fahrenheit");
  });

  test("no agrega temperature_unit cuando la unidad es celsius", async () => {
    let calledUrl = "";
    mockFetch(async (url) => {
      calledUrl = url;
      return { current: { temperature_2m: 22, weather_code: 0 } };
    });
    await getWeather(lima, "celsius");
    expect(calledUrl).not.toContain("temperature_unit");
  });

  test("lanza un error si no hay datos actuales", async () => {
    mockFetch(async () => ({}));
    expect(getWeather(lima, "celsius")).rejects.toThrow("datos actuales");
  });

  test("lanza un error ante respuesta HTTP no OK", async () => {
    mockFetchError(500);
    expect(getWeather(lima, "celsius")).rejects.toThrow("forecast HTTP 500");
  });
});

describe("getForecast", () => {
  const daily = {
    time: ["2026-09-02", "2026-09-03"],
    temperature_2m_max: [26, 24],
    temperature_2m_min: [20, 19],
    weather_code: [1, 3],
  };

  test("retorna el pronóstico diario", async () => {
    mockFetch(async () => ({ daily }));
    const forecast = await getForecast(lima, "celsius");
    expect(forecast).toEqual([
      { date: "2026-09-02", minTemperature: 20, maxTemperature: 26, weatherCode: 1 },
      { date: "2026-09-03", minTemperature: 19, maxTemperature: 24, weatherCode: 3 },
    ]);
  });

  test("agrega forecast_days=7 a la petición", async () => {
    let calledUrl = "";
    mockFetch(async (url) => {
      calledUrl = url;
      return { daily };
    });
    await getForecast(lima, "celsius");
    expect(calledUrl).toContain("forecast_days=7");
  });

  test("salta los días con datos incompletos", async () => {
    mockFetch(async () => ({
      daily: {
        time: ["2026-09-02", "2026-09-03"],
        temperature_2m_max: [26],
        temperature_2m_min: [20, 19],
        weather_code: [1, 3],
      },
    }));
    const forecast = await getForecast(lima, "celsius");
    expect(forecast).toHaveLength(1);
    expect(forecast[0]?.date).toBe("2026-09-02");
  });

  test("lanza un error si no hay datos diarios", async () => {
    mockFetch(async () => ({}));
    expect(getForecast(lima, "celsius")).rejects.toThrow("datos diarios");
  });
});
