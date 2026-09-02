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

type ToggleSettings = typeof import("../../src/actions/settings.ts").toggleSettings;

let toggleSettings: ToggleSettings;
let logged: string[] = [];

beforeAll(async () => {
  toggleSettings = (await import("../../src/actions/settings.ts")).toggleSettings;
});

beforeEach(() => {
  resetTestState();
  logged = [];
  const spy = mock((...args: unknown[]) => {
    logged.push(String(args[0] ?? ""));
  });
  console.log = spy as typeof console.log;
});

describe("toggleSettings", () => {
  test("alterna la unidad de celsius a fahrenheit", async () => {
    testState.unit = "celsius";
    await toggleSettings();
    expect(testState.unit as string).toBe("fahrenheit");
    expect(logged.some((l) => l.includes("Fahrenheit") && l.includes("°F"))).toBe(true);
  });

  test("alterna la unidad de fahrenheit a celsius", async () => {
    testState.unit = "fahrenheit";
    await toggleSettings();
    expect(testState.unit as string).toBe("celsius");
    expect(logged.some((l) => l.includes("Celsius") && l.includes("°C"))).toBe(true);
  });
});
