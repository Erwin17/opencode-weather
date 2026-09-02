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

type RemoveCityFlow = typeof import("../../src/actions/removeCity.ts").removeCityFlow;

let removeCityFlow: RemoveCityFlow;
let logged: string[] = [];

beforeAll(async () => {
  removeCityFlow = (await import("../../src/actions/removeCity.ts")).removeCityFlow;
});

beforeEach(() => {
  resetTestState();
  logged = [];
  const spy = mock((...args: unknown[]) => {
    logged.push(String(args[0] ?? ""));
  });
  console.log = spy as typeof console.log;
});

const cities = [
  { id: 1, name: "Lima", latitude: 1, longitude: 2 },
  { id: 2, name: "Bogotá", latitude: 3, longitude: 4 },
];

describe("removeCityFlow", () => {
  test("muestra mensaje si no hay ciudades", async () => {
    await removeCityFlow();
    expect(logged.some((l) => l.includes("No hay ciudades"))).toBe(true);
  });

  test("elimina la ciudad seleccionada", async () => {
    testState.cities = [...cities];
    fakeInput.indexValue = 0;
    await removeCityFlow();
    expect(testState.cities).toHaveLength(1);
    expect(testState.cities[0]?.name).toBe("Bogotá");
  });

  test("no elimina nada si el índice es inválido", async () => {
    testState.cities = [...cities];
    fakeInput.indexValue = null;
    await removeCityFlow();
    expect(testState.cities).toHaveLength(2);
    expect(logged.some((l) => l.includes("Selección inválida"))).toBe(true);
  });
});
