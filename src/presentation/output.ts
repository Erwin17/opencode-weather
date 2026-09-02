import { green, red } from "../utils/colors.ts";

export function printInfo(message: string): void {
  console.log(`  ${green(message)}`);
}

export function printError(message: string): void {
  console.log(`  ${red(`✗ ${message}`)}`);
}
