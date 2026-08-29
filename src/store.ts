import { mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import type { Ciudad, UnidadTemperatura } from "./api.ts";

export type EstadoApp = {
  ciudades: Ciudad[];
  defaultId: number | null;
  unidad: UnidadTemperatura;
};

function resolverRutaDatos(): string {
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

const RUTA_DATOS = resolverRutaDatos();

const ESTADO_INICIAL: EstadoApp = {
  ciudades: [],
  defaultId: null,
  unidad: "celsius",
};

let estado: EstadoApp = { ...ESTADO_INICIAL };

function esCiudad(valor: unknown): valor is Ciudad {
  if (typeof valor !== "object" || valor === null) return false;
  const c = valor as Record<string, unknown>;
  return (
    typeof c["id"] === "number" &&
    typeof c["name"] === "string" &&
    typeof c["latitude"] === "number" &&
    typeof c["longitude"] === "number"
  );
}

function normalizar(datos: unknown): EstadoApp {
  const d = (typeof datos === "object" && datos !== null ? datos : {}) as Record<
    string,
    unknown
  >;
  const lista = Array.isArray(d["ciudades"]) ? d["ciudades"].filter(esCiudad) : [];
  return {
    ciudades: lista,
    defaultId: typeof d["defaultId"] === "number" ? d["defaultId"] : null,
    unidad: d["unidad"] === "fahrenheit" ? "fahrenheit" : "celsius",
  };
}

export async function cargarEstado(): Promise<void> {
  try {
    estado = normalizar(await Bun.file(RUTA_DATOS).json());
  } catch {
    estado = { ...ESTADO_INICIAL, ciudades: [] };
  }
}

export async function guardarEstado(): Promise<void> {
  await mkdir(dirname(RUTA_DATOS), { recursive: true });
  await Bun.write(RUTA_DATOS, `${JSON.stringify(estado, null, 2)}\n`);
}

export function obtenerEstado(): EstadoApp {
  return estado;
}

export function agregarCiudad(nueva: Ciudad): boolean {
  if (estado.ciudades.some((c) => c.id === nueva.id)) return false;
  estado.ciudades.push(nueva);
  return true;
}

export function eliminarCiudad(indice: number): Ciudad | undefined {
  const eliminadas = estado.ciudades.splice(indice, 1);
  const eliminada = eliminadas[0];
  if (eliminada && estado.defaultId === eliminada.id) estado.defaultId = null;
  return eliminada;
}

export function definirDefault(id: number): boolean {
  if (!estado.ciudades.some((c) => c.id === id)) return false;
  estado.defaultId = id;
  return true;
}

export function alternarUnidad(): UnidadTemperatura {
  estado.unidad = estado.unidad === "celsius" ? "fahrenheit" : "celsius";
  return estado.unidad;
}
