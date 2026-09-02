const enabled = process.stdout.isTTY === true;

const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";

function wrap(code: string, text: string): string {
  return enabled ? `${code}${text}${RESET}` : text;
}

export function cyan(text: string): string {
  return wrap(CYAN, text);
}

export function yellow(text: string): string {
  return wrap(YELLOW, text);
}

export function green(text: string): string {
  return wrap(GREEN, text);
}

export function red(text: string): string {
  return wrap(RED, text);
}
