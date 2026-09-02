import { describe, expect, mock, test } from "bun:test";
import { listCities, renderMenu } from "../../src/presentation/menu.ts";
import type { City } from "../../src/types/City.ts";

describe("renderMenu", () => {
  test("incluye todas las opciones del menú", () => {
    const menu = renderMenu(3, "celsius");
    expect(menu).toContain("WEATHER CLI");
    expect(menu).toContain("1. Clima de ciudad default");
    expect(menu).toContain("2. Clima de todas las ciudades (3)");
    expect(menu).toContain("3. Buscar y agregar ciudad");
    expect(menu).toContain("4. Eliminar ciudad");
    expect(menu).toContain("5. Establecer ciudad default");
    expect(menu).toContain("6. Pronóstico 7 días (default)");
    expect(menu).toContain("8. Ajustes (°C)");
    expect(menu).toContain("9. Salir");
  });

  test("muestra el conteo de ciudades y el símbolo de unidad", () => {
    expect(renderMenu(5, "celsius")).toContain("(5)");
    expect(renderMenu(0, "celsius")).toContain("(0)");
    expect(renderMenu(2, "fahrenheit")).toContain("Ajustes (°F)");
  });
});

describe("listCities", () => {
  const cities: City[] = [
    { id: 1, name: "Lima", latitude: -12.0, longitude: -77.0, country: "PE" },
    { id: 2, name: "Bogotá", latitude: 4.71, longitude: -74.07 },
  ];

  test("imprime las ciudades numeradas", () => {
    const log = mock(console.log);
    const original = console.log;
    console.log = log;
    try {
      listCities(cities, 1);
      expect(log).toHaveBeenCalled();
      const calls = log.mock.calls.map((c) => String(c[0]));
      expect(calls).toContain("  1. Lima (PE) [default]");
      expect(calls).toContain("  2. Bogotá");
    } finally {
      console.log = original;
    }
  });
});
