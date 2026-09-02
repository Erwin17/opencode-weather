import { allCitiesWeather, defaultForecast, defaultWeather } from "./actions/getWeather.ts";
import { searchAndAdd } from "./actions/addCity.ts";
import { removeCityFlow } from "./actions/removeCity.ts";
import { setDefaultCityFlow } from "./actions/setDefaultCity.ts";
import { toggleSettings } from "./actions/settings.ts";
import { PROMPT } from "./utils/constants.ts";
import { renderMenu } from "./presentation/menu.ts";
import { ask, closeReader, isEof } from "./presentation/input.ts";
import { printError } from "./presentation/output.ts";
import { getState, loadState } from "./storage/settingsStorage.ts";

async function main(): Promise<void> {
  await loadState();

  try {
    let active = true;
    while (active) {
      const state = getState();
      console.log(renderMenu(state.cities.length, state.unit));
      const input = await ask(PROMPT);
      if (!input && isEof()) break;
      switch (input) {
        case "1":
          await defaultWeather();
          break;
        case "2":
          await allCitiesWeather();
          break;
        case "3":
          await searchAndAdd();
          break;
        case "4":
          await removeCityFlow();
          break;
        case "5":
          await setDefaultCityFlow();
          break;
        case "6":
          await defaultForecast();
          break;
        case "8":
          await toggleSettings();
          break;
        case "9":
          active = false;
          break;
        default:
          if (input) printError(`Opción inválida: "${input}"`);
      }
    }
  } finally {
    await closeReader();
  }

  console.log("\n  ¡Hasta luego!");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
