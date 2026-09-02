import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  mock,
  test,
} from "bun:test";
import {
  installStorageMocks,
  resetTestState,
  testState,
} from "../mocks.ts";

installStorageMocks();

type ListCities = typeof import("../../src/actions/listCities.ts").listCities;

let listCities: ListCities;
let logged: string[] = [];

beforeAll(async () => {
  listCities = (await import("../../src/actions/listCities.ts")).listCities;
});

beforeEach(() => {
  resetTestState();
  logged = [];
  mock.restore();
  const spy = mock((...args: unknown[]) => {
    logged.push(String(args[0] ?? ""));
  });
  console.log = spy as typeof console.log;
});

describe("listCities", () => {
  test("muestra mensaje cuando no hay ciudades", () => {
    listCities();
    expect(logged.some((l) => l.includes("No hay ciudades"))).toBe(true);
  });

  test("lista las ciudades registradas", () => {
    testState.cities = [{ id: 1, name: "Lima", latitude: 1, longitude: 2 }];
    testState.defaultId = 1;
    listCities();
    expect(logged.some((l) => l.includes("Lima"))).toBe(true);
  });
});
