const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

export async function searchRecipes(query) {
  if (!API_KEY) {
    throw new Error("Missing Spoonacular API key.");
  }

  const encodedQuery = encodeURIComponent(query);

  const url =
    `https://api.spoonacular.com/recipes/complexSearch` +
    `?query=${encodedQuery}&number=12&apiKey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch recipes.");
  }

  return data.results || [];
}

export async function getRecipeDetails(recipeId) {
  if (!API_KEY) {
    throw new Error("Missing Spoonacular API key.");
  }

  const url =
    `https://api.spoonacular.com/recipes/${recipeId}/information` +
    `?apiKey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch recipe details.");
  }

  return data;
}

export async function getWeatherRecipeSuggestions(query) {
  if (!API_KEY) {
    throw new Error("Missing Spoonacular API key.");
  }

  const url =
    `https://api.spoonacular.com/recipes/complexSearch` +
    `?query=${encodeURIComponent(query)}` +
    `&number=3` +
    `&sort=random` +
    `&apiKey=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch weather recipe suggestions.");
  }

  return data.results || [];
}