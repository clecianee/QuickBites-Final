import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getSavedRecipesForUser, saveRecipeForUser, deleteSavedRecipeForUser } from "../services/recipeStoreService";
import { getCurrentTemperature, getWeatherCategory } from "../services/weatherService";
import { getWeatherRecipeSuggestions, getRecipeDetails } from "../services/recipeService";
import RecipeModal from "../components/RecipeModal";
import "../styles/home.css";

function HomePage() {
  const { user, isGuest } = useAuth();
  const [savedCount, setSavedCount] = useState(0);
  const [triedCount, setTriedCount] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Load saved recipes
  useEffect(() => {
    async function loadRecipeSummary() {
      if (isGuest) return;
      if (!user) return;

      try {
        const savedRecipes = await getSavedRecipesForUser(user.uid);
        setSavedCount(savedRecipes.length);
        setTriedCount(savedRecipes.filter((r) => r.tried).length);
        setSavedRecipeIds(savedRecipes.map((r) => r.id));
      } catch (err) {
        console.error(err);
        setError("Failed to load recipe summary.");
      }
    }
    loadRecipeSummary();
  }, [user, isGuest]);

  // Load weather & suggested recipes
  useEffect(() => {
    async function loadWeatherAndSuggestions() {
      try {
        const weatherData = await getCurrentTemperature("Seattle");
        setWeather(weatherData);

        const category = getWeatherCategory(weatherData.temperature);
        const recipes = await getWeatherRecipeSuggestions(category);
        setSuggestedRecipes(recipes);
      } catch (err) {
        console.error(err);
        setWeatherError("Failed to load weather suggestions.");
      }
    }
    loadWeatherAndSuggestions();
  }, []);

  async function handleViewDetails(recipeId) {
    try {
      const details = await getRecipeDetails(recipeId);
      setSelectedRecipe(details);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch recipe details.");
    }
  }

  async function handleSaveToggle(recipe) {
    if (!user) {
      setError("You must be logged in to save recipes.");
      return;
    }

    if (savedRecipeIds.includes(recipe.id)) {
      // Unsave
      try {
        await deleteSavedRecipeForUser(user.uid, recipe.id);
        setSavedRecipeIds((current) => current.filter((id) => id !== recipe.id));
        setMessage(`${recipe.title} removed from your saved recipes`);
        setTimeout(() => setMessage(""), 3000);
      } catch (err) {
        console.error(err);
        setError("Failed to remove recipe.");
        setTimeout(() => setError(""), 3000);
      }
    } else {
      // Save
      try {
        await saveRecipeForUser(user.uid, recipe);
        setSavedRecipeIds((current) => [...current, recipe.id]);
        setMessage(`${recipe.title} added to your saved recipes!`);
        setTimeout(() => setMessage(""), 3000);
      } catch (err) {
        console.error(err);
        setError("Failed to save recipe.");
        setTimeout(() => setError(""), 3000);
      }
    }
  }

  return (
    <>
      <Navbar />
      <main className="home-page page">
        <header className="home-hero card">
          <div className="home-hero-text">
            <h1 className="home-title">Welcome to QuickBites</h1>
            <p className="home-subtitle">
              Discover recipes, track your favorites, and get suggestions based on today’s weather.
            </p>
            {isGuest ? (
              <p className="home-user-status">You are browsing as a guest.</p>
            ) : (
              <p className="home-user-status">
                You are logged in as <strong>{user?.email}</strong>.
              </p>
            )}
          </div>
        </header>

        <section className="home-stats-grid">
          <div className="home-stat-card card">
            <span className="home-stat-label">Saved Recipes</span>
            <h2 className="home-stat-number">{savedCount}</h2>
          </div>
          <div className="home-stat-card card">
            <span className="home-stat-label">Tried Recipes</span>
            <h2 className="home-stat-number">{triedCount}</h2>
          </div>
          <div className="home-stat-card card">
            <span className="home-stat-label">Today’s Weather</span>
            <h2 className="home-stat-number home-stat-weather">
              {weather ? `${weather.temperature}°F` : "--"}
            </h2>
          </div>
        </section>

        <section className="home-weather card">
          <h2 className="home-section-title">Weather Overview</h2>
          {weather ? (
            <div className="home-weather-content">
              <p><span className="home-info-label">City:</span> {weather.city}</p>
              <p><span className="home-info-label">Temperature:</span> {weather.temperature}°F</p>
              <p><span className="home-info-label">Category:</span> {getWeatherCategory(weather.temperature)}</p>
            </div>
          ) : (
            <p className="home-muted">Loading weather...</p>
          )}
        </section>

        {message && <p className="home-message">{message}</p>}
        {error && <p className="home-error">{error}</p>}

        <section className="home-suggestions">
          {suggestedRecipes.length > 0 && (
            <>
              <div className="home-section-header">
                <h2 className="home-section-title">Recipe Suggestions For Today</h2>
                <p className="home-section-subtitle">Picked to match today’s weather mood.</p>
              </div>

              <div className="home-suggestions-grid">
                {suggestedRecipes.map((recipe) => (
                  <article key={recipe.id} className="home-suggestion-card card">
                    <img src={recipe.image} alt={recipe.title} className="home-suggestion-image"/>
                    <h3 className="home-suggestion-title">{recipe.title}</h3>

                    <div className="home-suggestion-buttons">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handleViewDetails(recipe.id)}
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        className={`btn ${savedRecipeIds.includes(recipe.id) ? "btn-saved-green" : "btn-primary"}`}
                        onClick={() => handleSaveToggle(recipe)}
                      >
                        {savedRecipeIds.includes(recipe.id) ? "Saved" : "Save Recipe"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        {selectedRecipe && (
          <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
        )}
      </main>
    </>
  );
}

export default HomePage;
