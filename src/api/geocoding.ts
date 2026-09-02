import type { City } from "../types/City.ts";
import { GEOCODING_URL } from "../utils/constants.ts";

type GeocodingResponse = {
  results?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
  }[];
};

export async function searchCity(name: string): Promise<City | null> {
  const params = new URLSearchParams({
    name,
    count: "1",
    language: "es",
    format: "json",
  });
  const response = await fetch(`${GEOCODING_URL}?${params}`);
  if (!response.ok) throw new Error(`geocoding HTTP ${response.status}`);
  const data = (await response.json()) as GeocodingResponse;
  const result = data.results?.[0];
  if (!result) return null;
  return {
    id: result.id,
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    ...(result.country !== undefined && { country: result.country }),
  };
}
