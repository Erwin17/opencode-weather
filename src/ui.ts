import type { Ciudad, Clima, PronosticoDiario, UnidadTemperatura } from "./api.ts";
import { describirClima } from "./api.ts";
import { amarillo, cyan, rojo, verde } from "./colors.ts";

const LINEA = "═".repeat(40);

export const PROMPT = "  Selecciona una opción: ";

export function simboloUnidad(unidad: UnidadTemperatura): string {
  return unidad === "celsius" ? "°C" : "°F";
}

export function renderizarMenu(
  totalCiudades: number,
  unidad: UnidadTemperatura,
): string {
  return [
    cyan(LINEA),
    cyan("         WEATHER CLI"),
    cyan(LINEA),
    "  1. Clima de ciudad default",
    `  2. Clima de todas las ciudades (${totalCiudades})`,
    "  3. Buscar y agregar ciudad",
    "  4. Eliminar ciudad",
    "  5. Establecer ciudad default",
    "  6. Pronóstico 7 días (default)",
    `  8. Ajustes (${simboloUnidad(unidad)})`,
    "  9. Salir",
    cyan(LINEA),
  ].join("\n");
}

function iconoClima(codigo: number): string {
  if (codigo === 0) return "☀️";
  if (codigo === 1 || codigo === 2) return "🌤️";
  if (codigo === 3) return "☁️";
  if (codigo === 45 || codigo === 48) return "🌫️";
  if ((codigo >= 51 && codigo <= 67) || (codigo >= 80 && codigo <= 82)) return "🌧️";
  if ((codigo >= 71 && codigo <= 77) || codigo === 85 || codigo === 86) return "🌨️";
  if (codigo >= 95) return "⛈️";
  return "🌡️";
}

export function formatearClima(
  ciudad: Ciudad,
  clima: Clima,
  unidad: UnidadTemperatura,
): string {
  const descripcion = describirClima(clima.codigo);
  const temp = amarillo(`${clima.temperatura.toFixed(1)}${simboloUnidad(unidad)}`);
  return `${iconoClima(clima.codigo)} ${ciudad.name}: ${descripcion}, ${temp}`;
}

function formatearFecha(fecha: string): string {
  const dia = new Date(`${fecha}T00:00:00`);
  if (Number.isNaN(dia.getTime())) return fecha;
  const formato = new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
  return formato.format(dia);
}

export function formatearPronostico(
  ciudad: Ciudad,
  dias: PronosticoDiario[],
  unidad: UnidadTemperatura,
): string {
  const unidadStr = simboloUnidad(unidad);
  const lineas = dias.map((d) => {
    const descripcion = describirClima(d.codigo);
    const rango = amarillo(`${d.minTemperatura.toFixed(0)}${unidadStr} / ${d.maxTemperatura.toFixed(0)}${unidadStr}`);
    return `  ${iconoClima(d.codigo)} ${formatearFecha(d.fecha)}: ${descripcion} — mín ${rango}`;
  });
  return [cyan(LINEA), cyan(`   PRONÓSTICO 7 DÍAS — ${ciudad.name}`), cyan(LINEA), ...lineas, cyan(LINEA)].join("\n");
}

export function listarCiudades(ciudades: Ciudad[], defaultId: number | null): void {
  ciudades.forEach((ciudad, i) => {
    const pais = ciudad.country ? ` (${ciudad.country})` : "";
    const marca = ciudad.id === defaultId ? " [default]" : "";
    console.log(`  ${i + 1}. ${ciudad.name}${pais}${marca}`);
  });
}

export function mostrarInfo(mensaje: string): void {
  console.log(`  ${verde(mensaje)}`);
}

export function mostrarError(mensaje: string): void {
  console.log(`  ${rojo(`✗ ${mensaje}`)}`);
}
