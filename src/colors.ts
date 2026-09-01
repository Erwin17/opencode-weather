const habilitado = process.stdout.isTTY === true;

const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";
const AMARILLO = "\x1b[33m";
const VERDE = "\x1b[32m";
const ROJO = "\x1b[31m";

function envolver(codigo: string, texto: string): string {
  return habilitado ? `${codigo}${texto}${RESET}` : texto;
}

export function cyan(texto: string): string {
  return envolver(CYAN, texto);
}

export function amarillo(texto: string): string {
  return envolver(AMARILLO, texto);
}

export function verde(texto: string): string {
  return envolver(VERDE, texto);
}

export function rojo(texto: string): string {
  return envolver(ROJO, texto);
}
