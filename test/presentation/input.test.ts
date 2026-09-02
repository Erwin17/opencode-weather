import { describe, expect, test } from "bun:test";
import { parseIndex } from "../../src/presentation/input.ts";

describe("parseIndex", () => {
  test("convierte entrada de 1-based a 0-based", () => {
    expect(parseIndex("1", 3)).toBe(0);
    expect(parseIndex("2", 3)).toBe(1);
    expect(parseIndex("3", 3)).toBe(2);
  });

  test("devuelve null si la entrada no es numérica", () => {
    expect(parseIndex("abc", 3)).toBeNull();
    expect(parseIndex("", 3)).toBeNull();
  });

  test("devuelve null si el índice está fuera de rango", () => {
    expect(parseIndex("0", 3)).toBeNull();
    expect(parseIndex("4", 3)).toBeNull();
    expect(parseIndex("-1", 3)).toBeNull();
  });

  test("devuelve null si la lista está vacía", () => {
    expect(parseIndex("1", 0)).toBeNull();
  });
});
