import { describe, expect, test } from "bun:test";
import type { City } from "../../src/types/City.ts";
import type { DailyForecast, TemperatureUnit, Weather } from "../../src/types/Weather.ts";
import {
  describeWeather,
  formatDate,
  formatForecast,
  formatWeather,
  unitSymbol,
  weatherIcon,
} from "../../src/utils/format.ts";

describe("describeWeather", () => {
  test("devuelve la descripción para códigos conocidos", () => {
    expect(describeWeather(0)).toBe("Despejado");
    expect(describeWeather(3)).toBe("Nublado");
    expect(describeWeather(95)).toBe("Tormenta eléctrica");
  });

  test("devuelve texto genérico para códigos desconocidos", () => {
    expect(describeWeather(12345)).toBe("Condición desconocida");
  });
});

describe("unitSymbol", () => {
  test("celsius devuelve °C", () => {
    expect(unitSymbol("celsius")).toBe("°C");
  });

  test("fahrenheit devuelve °F", () => {
    expect(unitSymbol("fahrenheit")).toBe("°F");
  });
});

describe("weatherIcon", () => {
  test("mapea grupos de códigos WMO a iconos", () => {
    expect(weatherIcon(0)).toBe("☀️");
    expect(weatherIcon(1)).toBe("🌤️");
    expect(weatherIcon(2)).toBe("🌤️");
    expect(weatherIcon(3)).toBe("☁️");
    expect(weatherIcon(45)).toBe("🌫️");
    expect(weatherIcon(48)).toBe("🌫️");
    expect(weatherIcon(51)).toBe("🌧️");
    expect(weatherIcon(67)).toBe("🌧️");
    expect(weatherIcon(80)).toBe("🌧️");
    expect(weatherIcon(71)).toBe("🌨️");
    expect(weatherIcon(77)).toBe("🌨️");
    expect(weatherIcon(85)).toBe("🌨️");
    expect(weatherIcon(95)).toBe("⛈️");
    expect(weatherIcon(99)).toBe("⛈️");
  });

  test("devuelve icono por defecto para códigos desconocidos", () => {
    expect(weatherIcon(-1)).toBe("🌡️");
    expect(weatherIcon(4)).toBe("🌡️");
  });
});

describe("formatDate", () => {
  test("formatea fecha ISO a español", () => {
    expect(formatDate("2026-09-02")).toBe("miércoles, 2 sept");
  });

  test("devuelve la entrada si no es fecha válida", () => {
    expect(formatDate("no-una-fecha")).toBe("no-una-fecha");
  });
});

describe("formatWeather", () => {
  const city: City = { id: 1, name: "Lima", latitude: -12.0, longitude: -77.0 };
  const weather: Weather = { temperature: 22.5, weatherCode: 0 };

  test("incluye ciudad, descripción y temperatura", () => {
    const result = formatWeather(city, weather, "celsius");
    expect(result).toContain("Lima");
    expect(result).toContain("Despejado");
    expect(result).toContain("22.5°C");
    expect(result).toContain("☀️");
  });
});

describe("formatForecast", () => {
  const city: City = { id: 1, name: "Lima", latitude: -12.0, longitude: -77.0 };
  const days: DailyForecast[] = [
    { date: "2026-09-02", minTemperature: 20, maxTemperature: 26, weatherCode: 1 },
    { date: "2026-09-03", minTemperature: 19, maxTemperature: 24, weatherCode: 3 },
  ];

  test("incluye cabecera, líneas y rangos de temperatura", () => {
    const result = formatForecast(city, days, "celsius");
    expect(result).toContain("PRONÓSTICO 7 DÍAS");
    expect(result).toContain("Lima");
    expect(result).toContain("20°C / 26°C");
    expect(result).toContain("19°C / 24°C");
  });

  test("usa el símbolo de unidad correspondiente", () => {
    const result = formatForecast(city, days, "fahrenheit");
    expect(result).toContain("20°F / 26°F");
  });
});
