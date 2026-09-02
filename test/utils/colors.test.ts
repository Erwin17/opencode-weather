import { afterAll, describe, expect, test } from "bun:test";

const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";

const originalIsTTY = process.stdout.isTTY;

function forceTTY(value: boolean | undefined): void {
  Object.defineProperty(process.stdout, "isTTY", {
    value,
    configurable: true,
  });
}

async function loadColors(): Promise<typeof import("../../src/utils/colors.ts")> {
  return await import(`../../src/utils/colors.ts?reload=${Date.now()}`);
}

afterAll(() => {
  forceTTY(originalIsTTY);
});

describe("colors / sin TTY", () => {
  test("devuelve el texto sin códigos ANSI", async () => {
    forceTTY(undefined);
    const { cyan, yellow, green, red } = await loadColors();
    expect(cyan("hola")).toBe("hola");
    expect(yellow("hola")).toBe("hola");
    expect(green("hola")).toBe("hola");
    expect(red("hola")).toBe("hola");
  });
});

describe("colors / con TTY", () => {
  test("envuelve el texto con los códigos ANSI correspondientes", async () => {
    forceTTY(true);
    const { cyan, yellow, green, red } = await loadColors();
    expect(cyan("hola")).toBe(`${CYAN}hola${RESET}`);
    expect(yellow("hola")).toBe(`${YELLOW}hola${RESET}`);
    expect(green("hola")).toBe(`${GREEN}hola${RESET}`);
    expect(red("hola")).toBe(`${RED}hola${RESET}`);
  });
});
