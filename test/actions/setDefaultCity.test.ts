import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  mock,
  test,
} from "bun:test";
import {
  fakeInput,
  installInputMocks,
  installStorageMocks,
  resetTestState,
  testState,
} from "../mocks.ts";

installStorageMocks();
installInputMocks();

type SetDefaultCityFlow = typeof import("../../src/actions/setDefaultCity.ts").setDefaultCityFlow;

let setDefaultCityFlow: SetDefaultCityFlow;
let logged: string[] = [];

beforeAll(async () => {
  setDefaultCityFlow = (await import("../../src/actions/setDefaultCity.ts"))
    .setDefaultCityFlow;
});

beforeEach(() => {
  resetTestState();
  logged = [];
  const spy = mock((...args: unknown[]) => {
    logged.push(String(args[0] ?? ""));
  });
  console.log = spy as typeof console.log;
});

describe("setDefaultCityFlow", () => {
  test("muestra mensaje si no hay ciudades", async () => {
    await setDefaultCityFlow();
    expect(logged.some((l) => l.includes("No hay ciudades"))).toBe(true);
  });

  test("establece la ciudad seleccionada como default", async () => {
    testState.cities = [
      { id: 1, name: "Lima", latitude: 1, longitude: 2 },
      { id: 2, name: "Bogotá", latitude: 3, longitude: 4 },
    ];
    fakeInput.indexValue = 1;
    await setDefaultCityFlow();
    expect(testState.defaultId).toBe(2);
  });

  test("no cambia el default si el índice es inválido", async () => {
    testState.cities = [
      { id: 1, name: "Lima", latitude: 1, longitude: 2 },
      { id: 2, name: "Bogotá", latitude: 3, longitude: 4 },
    ];
    fakeInput.indexValue = null;
    await setDefaultCityFlow();
    expect(testState.defaultId).toBeNull();
    expect(logged.some((l) => l.includes("Selección inválida"))).toBe(true);
  });
});
