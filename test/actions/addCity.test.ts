import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "bun:test";
import {
  fakeGeocoding,
  fakeInput,
  installGeocodingMock,
  installInputMocks,
  installStorageMocks,
  resetTestState,
  testState,
} from "../mocks.ts";

installStorageMocks();
installInputMocks();
installGeocodingMock();

type SearchAndAdd = typeof import("../../src/actions/addCity.ts").searchAndAdd;

let searchAndAdd: SearchAndAdd;

beforeAll(async () => {
  searchAndAdd = (await import("../../src/actions/addCity.ts")).searchAndAdd;
});

beforeEach(() => {
  resetTestState();
  fakeInput.value = "Lima";
  fakeGeocoding.result = {
    id: 1,
    name: "LIMA",
    latitude: 1,
    longitude: 2,
    country: "XX",
  };
});

describe("searchAndAdd", () => {
  test("agrega la ciudad y la establece como default si es la primera", async () => {
    await searchAndAdd();
    expect(testState.cities).toHaveLength(1);
    expect(testState.cities[0]?.name).toBe("LIMA");
    expect(testState.defaultId).toBe(1);
  });

  test("no establece default si ya hay ciudades", async () => {
    testState.cities.push({ id: 9, name: "Bogotá", latitude: 0, longitude: 0 });
    testState.defaultId = 9;
    await searchAndAdd();
    expect(testState.cities).toHaveLength(2);
    expect(testState.defaultId).toBe(9);
  });
});
