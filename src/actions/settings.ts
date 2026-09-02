import { printInfo } from "../presentation/output.ts";
import { saveState, toggleUnit } from "../storage/settingsStorage.ts";
import { unitSymbol } from "../utils/format.ts";

export async function toggleSettings(): Promise<void> {
  const unit = toggleUnit();
  await saveState();
  const name = unit === "celsius" ? "Celsius" : "Fahrenheit";
  printInfo(`Unidad de temperatura: ${unitSymbol(unit)} (${name})`);
}
