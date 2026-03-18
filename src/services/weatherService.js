const GEO_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function getCoordinates(city) {
  const response = await fetch(
    `${GEO_BASE_URL}?name=${encodeURIComponent(city)}&count=1`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch coordinates.");
  }

  if (!data.results || data.results.length === 0) {
    throw new Error("City not found.");
  }

  const place = data.results[0];

  return {
    name: place.name,
    latitude: place.latitude,
    longitude: place.longitude,
    country: place.country,
  };
}

export async function getCurrentTemperature(city) {
  const location = await getCoordinates(city);

  const response = await fetch(
    `${WEATHER_BASE_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m&temperature_unit=fahrenheit`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch weather.");
  }

  return {
    city: location.name,
    country: location.country,
    temperature: data.current.temperature_2m,
  };
}

export function getWeatherCategory(temp) {
  if (temp < 50) return "cold";
  if (temp > 70) return "hot";
  return "mild";
}

export function getWeatherSearchQuery(category) {
  if (category === "cold") return "soup";
  if (category === "hot") return "salad";
  return "sandwich";
}