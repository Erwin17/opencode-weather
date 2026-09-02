import { mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import type { City } from "../types/City.ts";
import type { TemperatureUnit } from "../types/Weather.ts";

export type AppState = {
  cities: City[];
  defaultId: number | null;
  unit: TemperatureUnit;
};

function resolveDataPath(): string {
  switch (process.platform) {
    case "darwin":
      return join(homedir(), "Library", "Application Support", "weather", "data.json");
    case "win32":
      return join(
        process.env["APPDATA"] ?? join(homedir(), "AppData", "Roaming"),
        "weather",
        "data.json",
      );
    default:
      return join(
        process.env["XDG_CONFIG_HOME"] ?? join(homedir(), ".config"),
        "weather",
        "data.json",
      );
  }
}

const DATA_PATH = resolveDataPath();

const INITIAL_STATE: AppState = {
  cities: [],
  defaultId: null,
  unit: "celsius",
};

let state: AppState = { ...INITIAL_STATE };

function isCity(value: unknown): value is City {
  if (typeof value !== "object" || value === null) return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c["id"] === "number" &&
    typeof c["name"] === "string" &&
    typeof c["latitude"] === "number" &&
    typeof c["longitude"] === "number"
  );
}

function normalize(data: unknown): AppState {
  const d = (typeof data === "object" && data !== null ? data : {}) as Record<
    string,
    unknown
  >;
  const list = Array.isArray(d["cities"]) ? d["cities"].filter(isCity) : [];
  return {
    cities: list,
    defaultId: typeof d["defaultId"] === "number" ? d["defaultId"] : null,
    unit: d["unit"] === "fahrenheit" ? "fahrenheit" : "celsius",
  };
}

export async function loadState(): Promise<void> {
  try {
    state = normalize(await Bun.file(DATA_PATH).json());
  } catch {
    state = { ...INITIAL_STATE, cities: [] };
  }
}

export async function saveState(): Promise<void> {
  await mkdir(dirname(DATA_PATH), { recursive: true });
  await Bun.write(DATA_PATH, `${JSON.stringify(state, null, 2)}\n`);
}

export function getState(): AppState {
  return state;
}

export function setDefaultCity(id: number): boolean {
  if (!state.cities.some((c) => c.id === id)) return false;
  state.defaultId = id;
  return true;
}

export function toggleUnit(): TemperatureUnit {
  state.unit = state.unit === "celsius" ? "fahrenheit" : "celsius";
  return state.unit;
}
