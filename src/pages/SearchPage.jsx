import "../styles/modal.css";
import "../styles/recipes.css";
import "../styles/search.css";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { searchRecipes, getRecipeDetails } from "../services/recipeService";
import {
  saveRecipeForUser,
  getSavedRecipesForUser,
} from "../services/recipeStoreService";
import { useAuth } from "../context/AuthContext";
import {
  getCurrentTemperature,
  getWeatherCategory,
  getWeatherSearchQuery,
} from "../services/weatherService";
import RecipeCard from "../components/RecipeCard";
import RecipeModal from "../components/RecipeModal";
import WeatherSection from "../components/WeatherSection";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { user, isGuest } = useAuth();
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);
  const [weather, setWeather] = useState(null);
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [city, setCity] = useState("Seattle");
  const [submittedCity, setSubmittedCity] = useState("Seattle");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  useEffect(() => {
    async function loadWeatherSuggestions() {
      setIsLoadingWeather(true);

      try {
        const weatherData = await getCurrentTemperature(submittedCity);
        setWeather(weatherData);

        const category = getWeatherCategory(weatherData.temperature);
        const weatherSearchQuery = getWeatherSearchQuery(category);

        setQuery(weatherSearchQuery);

        setSuggestedRecipes([]);
        setRecipes([]);
        setMessage(
          `Ready to search ${weatherSearchQuery} recipes based on today’s weather.`
        );
        setError("");
      } catch (err) {
        console.error("Weather suggestions error:", err);
        setError(err.message || "Failed to load weather suggestions.");
      } finally {
        setIsLoadingWeather(false);
      }
    }

    loadWeatherSuggestions();
  }, [submittedCity]);

  async function handleSearch(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSelectedRecipe(null);
    setIsSearching(true);

    try {
      const results = await searchRecipes(query);
      setRecipes(results);
      setMessage(`Found ${results.length} recipes.`);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "Failed to search recipes.");
    } finally {
      setIsSearching(false);
    }
  }

  async function handleViewDetails(recipeId) {
    setError("");
    setIsLoadingDetails(true);

    try {
      const details = await getRecipeDetails(recipeId);
      setSelectedRecipe(details);
    } catch (err) {
      console.error("Details error:", err);
      setError(err.message || "Failed to fetch recipe details.");
    } finally {
      setIsLoadingDetails(false);
    }
  }

  async function handleSaveRecipe(recipe) {
    if (isGuest) {
      setError("Guests cannot save recipes.");
      return;
    }

    if (!user) {
      setError("You must be logged in to save recipes.");
      return;
    }

    try {
      let currentSavedIds = savedRecipeIds;

      if (currentSavedIds.length === 0) {
        const savedRecipes = await getSavedRecipesForUser(user.uid);
        currentSavedIds = savedRecipes.map((item) => item.id);
        setSavedRecipeIds(currentSavedIds);
      }

      if (currentSavedIds.includes(recipe.id)) {
        setMessage(`Recipe already saved: ${recipe.title}`);
        setError("");
        return;
      }

      await saveRecipeForUser(user.uid, recipe);
      setSavedRecipeIds((currentIds) => [...currentIds, recipe.id]);
      setMessage(`Saved recipe: ${recipe.title}`);
      setError("");
    } catch (err) {
      console.error("Save recipe error:", err);
      setError("Failed to save recipe.");
    }
  }

  return (
    <>
      <Navbar />

      <main className="search-page page">
        <header className="search-header">
          <h1 className="search-title">Search Recipes</h1>
          <p className="search-subtitle">
            Discover recipes based on your cravings and today’s weather.
          </p>
        </header>

        <section className="search-section weather-panel card">
          {isLoadingWeather ? (
            <p className="search-status">Loading weather...</p>
          ) : (
            <WeatherSection
              weather={weather}
              title={`Recommended for today (${getWeatherCategory(
                weather?.temperature
              )})`}
            >
              <div className="recipe-list">
                {suggestedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </WeatherSection>
          )}
        </section>

        <section className="search-section city-panel card">
          <label htmlFor="city" className="search-label">
            City
          </label>
          <div className="city-controls">
            <input
              id="city"
              type="text"
              className="search-input"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Enter a city"
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSubmittedCity(city)}
            >
              Update City
            </button>
          </div>
        </section>

        <section className="search-section search-form-panel card">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input search-query-input"
              placeholder="Search for recipes..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              required
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </form>
        </section>

        {message && <p className="search-message">{message}</p>}
        {error && <p className="search-error">{error}</p>}

        <section className="search-section results-section">
          <div className="recipe-list">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onViewDetails={handleViewDetails}
                onSaveRecipe={(recipeToSave) =>
                  handleSaveRecipe(
                    selectedRecipe && selectedRecipe.id === recipeToSave.id
                      ? selectedRecipe
                      : recipeToSave
                  )
                }
                showSaveButton={true}
              />
            ))}
          </div>
        </section>

        {isLoadingDetails && (
          <p className="search-status">Loading recipe details...</p>
        )}

        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      </main>
    </>
  );
}

export default SearchPage;