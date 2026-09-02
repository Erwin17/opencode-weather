import { describe, expect, test } from "bun:test";
import {
  FORECAST_URL,
  GEOCODING_URL,
  LINE,
  PROMPT,
  WEATHER_DESCRIPTIONS,
} from "../../src/utils/constants.ts";

describe("constants", () => {
  test("URLs de la API de OpenMeteo", () => {
    expect(GEOCODING_URL).toBe("https://geocoding-api.open-meteo.com/v1/search");
    expect(FORECAST_URL).toBe("https://api.open-meteo.com/v1/forecast");
  });

  test("LINE es una línea decorativa de 40 caracteres", () => {
    expect(LINE).toBe("═".repeat(40));
    expect(LINE.length).toBe(40);
  });

  test("PROMPT del menú principal", () => {
    expect(PROMPT).toBe("  Selecciona una opción: ");
  });

  test("mapeo de códigos WMO a descripciones en español", () => {
    expect(WEATHER_DESCRIPTIONS[0]).toBe("Despejado");
    expect(WEATHER_DESCRIPTIONS[3]).toBe("Nublado");
    expect(WEATHER_DESCRIPTIONS[51]).toBe("Llovizna ligera");
    expect(WEATHER_DESCRIPTIONS[95]).toBe("Tormenta eléctrica");
    expect(WEATHER_DESCRIPTIONS[99]).toBe("Tormenta con granizo intenso");
  });
});
