export type TemperatureUnit = "celsius" | "fahrenheit";

export type Weather = {
  temperature: number;
  weatherCode: number;
};

export type DailyForecast = {
  date: string;
  minTemperature: number;
  maxTemperature: number;
  weatherCode: number;
};
