import { buscarCiudad, obtenerClima, obtenerPronostico } from "./src/api.ts";
import type { Ciudad } from "./src/api.ts";
import {
  agregarCiudad,
  alternarUnidad,
  cargarEstado,
  definirDefault,
  eliminarCiudad,
  guardarEstado,
  obtenerEstado,
} from "./src/store.ts";
import {
  PROMPT,
  formatearClima,
  formatearPronostico,
  listarCiudades,
  mostrarError,
  mostrarInfo,
  renderizarMenu,
} from "./src/ui.ts";

async function* crearLector(): AsyncGenerator<string> {
  process.stdin.setEncoding("utf8");
  let buffer = "";
  for await (const fragmento of process.stdin) {
    buffer += String(fragmento);
    let salto = buffer.indexOf("\n");
    while (salto >= 0) {
      yield buffer.slice(0, salto);
      buffer = buffer.slice(salto + 1);
      salto = buffer.indexOf("\n");
    }
  }
  if (buffer.length > 0) yield buffer;
}

const lector = crearLector();
let eof = false;

async function preguntar(texto: string): Promise<string> {
  if (eof) return "";
  process.stdout.write(texto);
  const resultado = await lector.next();
  if (resultado.done) {
    eof = true;
    return "";
  }
  return resultado.value.trim();
}

async function imprimirClima(ciudad: Ciudad): Promise<void> {
  const estado = obtenerEstado();
  try {
    const clima = await obtenerClima(ciudad, estado.unidad);
    console.log(`  ${formatearClima(ciudad, clima, estado.unidad)}`);
  } catch {
    mostrarError(`No se pudo obtener el clima de ${ciudad.name}.`);
  }
}

async function climaDefault(): Promise<void> {
  const estado = obtenerEstado();
  const ciudad = estado.ciudades.find((c) => c.id === estado.defaultId);
  if (!ciudad) {
    return mostrarInfo("No hay ciudad default. Agrega una (opción 3) y establécela (opción 5).");
  }
  await imprimirClima(ciudad);
}

async function pronosticoDefault(): Promise<void> {
  const estado = obtenerEstado();
  const ciudad = estado.ciudades.find((c) => c.id === estado.defaultId);
  if (!ciudad) {
    return mostrarInfo("No hay ciudad default. Agrega una (opción 3) y establécela (opción 5).");
  }
  try {
    const dias = await obtenerPronostico(ciudad, estado.unidad);
    console.log(formatearPronostico(ciudad, dias, estado.unidad));
  } catch {
    mostrarError(`No se pudo obtener el pronóstico de ${ciudad.name}.`);
  }
}

async function climaDeTodas(): Promise<void> {
  const { ciudades } = obtenerEstado();
  if (ciudades.length === 0) {
    return mostrarInfo("No hay ciudades registradas. Usa la opción 3 para agregar una.");
  }
  for (const ciudad of ciudades) {
    await imprimirClima(ciudad);
  }
}

async function buscarYAgregar(): Promise<void> {
  const nombre = await preguntar("  Nombre de la ciudad: ");
  if (!nombre) return mostrarError("Nombre vacío.");
  mostrarInfo(`Buscando "${nombre}"…`);
  try {
    const encontrada = await buscarCiudad(nombre);
    if (!encontrada) return mostrarError(`Sin resultados para "${nombre}".`);
    const pais = encontrada.country ? ` (${encontrada.country})` : "";
    if (!agregarCiudad(encontrada)) {
      return mostrarError(`${encontrada.name}${pais} ya está registrada.`);
    }
    mostrarInfo(`Agregada: ${encontrada.name}${pais} [${encontrada.latitude}, ${encontrada.longitude}]`);
    const estado = obtenerEstado();
    if (estado.ciudades.length === 1 && definirDefault(encontrada.id)) {
      mostrarInfo("Establecida como ciudad default.");
    }
    await guardarEstado();
  } catch {
    mostrarError("Falló la búsqueda. Revisa tu conexión.");
  }
}

function pedirIndice(entrada: string, total: number): number | null {
  const indice = Number.parseInt(entrada, 10) - 1;
  if (!Number.isInteger(indice) || indice < 0 || indice >= total) return null;
  return indice;
}

async function eliminarCiudadUI(): Promise<void> {
  const { ciudades } = obtenerEstado();
  if (ciudades.length === 0) return mostrarInfo("No hay ciudades registradas.");
  listarCiudades(ciudades, obtenerEstado().defaultId);
  const entrada = await preguntar("  Número de ciudad a eliminar: ");
  const indice = pedirIndice(entrada, ciudades.length);
  const eliminada = indice === null ? undefined : eliminarCiudad(indice);
  if (!eliminada) return mostrarError("Selección inválida.");
  await guardarEstado();
  mostrarInfo(`Eliminada: ${eliminada.name}`);
}

async function establecerDefaultUI(): Promise<void> {
  const { ciudades } = obtenerEstado();
  if (ciudades.length === 0) return mostrarInfo("No hay ciudades registradas.");
  listarCiudades(ciudades, obtenerEstado().defaultId);
  const entrada = await preguntar("  Número de ciudad default: ");
  const indice = pedirIndice(entrada, ciudades.length);
  const ciudad = indice === null ? undefined : ciudades[indice];
  if (!ciudad || !definirDefault(ciudad.id)) return mostrarError("Selección inválida.");
  await guardarEstado();
  mostrarInfo(`Ciudad default: ${ciudad.name}`);
}

async function ajustesUI(): Promise<void> {
  const unidad = alternarUnidad();
  await guardarEstado();
  mostrarInfo(`Unidad de temperatura: ${unidad === "celsius" ? "°C (Celsius)" : "°F (Fahrenheit)"}`);
}

async function main(): Promise<void> {
  await cargarEstado();

  try {
    let activo = true;
    while (activo) {
      const estado = obtenerEstado();
      console.log(renderizarMenu(estado.ciudades.length, estado.unidad));
      const entrada = await preguntar(PROMPT);
      if (!entrada && eof) break;
      switch (entrada) {
        case "1":
          await climaDefault();
          break;
        case "2":
          await climaDeTodas();
          break;
        case "3":
          await buscarYAgregar();
          break;
        case "4":
          await eliminarCiudadUI();
          break;
        case "5":
          await establecerDefaultUI();
          break;
        case "6":
          await pronosticoDefault();
          break;
        case "8":
          await ajustesUI();
          break;
        case "9":
          activo = false;
          break;
        default:
          if (entrada) mostrarError(`Opción inválida: "${entrada}"`);
      }
    }
  } finally {
    await lector.return(undefined);
  }

  console.log("\n  ¡Hasta luego!");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
