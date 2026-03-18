import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getSavedRecipesForUser } from "../services/recipeStoreService";
import { getCurrentTemperature, getWeatherCategory } from "../services/weatherService";
import { getWeatherRecipeSuggestions } from "../services/recipeService";

import "../styles/home.css";
import logo from "../images/logo.png";

function HomePage() {
  const { user, isGuest } = useAuth();
  const [savedCount, setSavedCount] = useState(0);
  const [triedCount, setTriedCount] = useState(0);
  const [error, setError] = useState("");

  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [suggestedRecipes, setSuggestedRecipes] = useState([]);

  useEffect(() => {
    async function loadRecipeSummary() {
      if (isGuest) {
        setSavedCount(0);
        setTriedCount(0);
        return;
      }
      if (!user) return;

      try {
        const savedRecipes = await getSavedRecipesForUser(user.uid);
        setSavedCount(savedRecipes.length);
        setTriedCount(savedRecipes.filter(r => r.tried).length);
        setError("");
      } catch (err) {
        console.error("Load recipe summary error:", err);
        setError("Failed to load recipe summary.");
      }
    }

    loadRecipeSummary();
  }, [user, isGuest]);

  useEffect(() => {
    async function loadWeatherAndSuggestions() {
      try {
        const weatherData = await getCurrentTemperature("Seattle");
        setWeather(weatherData);
        setWeatherError("");

        const category = getWeatherCategory(weatherData.temperature);
        const recipes = await getWeatherRecipeSuggestions(category);
        setSuggestedRecipes(recipes);
      } catch (err) {
        console.error("Weather/suggestions error:", err);
        setWeatherError(err.message || "Failed to load weather suggestions.");
      }
    }

    loadWeatherAndSuggestions();
  }, []);

  return (
    <>
      <Navbar />

      <main className="page-container">
        {/* Header with logo */}
        <header className="home-header">
          <img src={logo} alt="QuickBites Logo" className="home-logo" />
          <h1>Welcome to QuickBites</h1>
        </header>

        {/* Main layout */}
        <div className="home-layout">
          {/* Left column: user info & weather */}
          <div className="card">
            {isGuest ? <p>You are browsing as a guest.</p> : <p>You are logged in as {user?.email}</p>}
            <p>Saved recipes: {savedCount}</p>
            <p>Tried recipes: {triedCount}</p>

            {weather && (
              <>
                <hr />
                <p>🌡 {weather.city}: {weather.temperature}°F</p>
                <p>Weather: {getWeatherCategory(weather.temperature)}</p>
              </>
            )}

            {weatherError && <p className="error">{weatherError}</p>}
            {error && <p className="error">{error}</p>}
          </div>

          {/* Right column: recipe suggestions */}
          <div className="card">
            <h2>Recipe Suggestions For Today</h2>

            {suggestedRecipes.length > 0 ? (
              <div className="recipe-grid">
                {suggestedRecipes.map(recipe => (
                  <article key={recipe.id} className="recipe-card">
                    <h3>{recipe.title}</h3>
                    {recipe.image ? (
                      <img src={recipe.image} alt={recipe.title} />
                    ) : (
                      <p>No image available</p>
                    )}
                  </article>
                ))}
              </div>
            ) : <p>Loading recipes...</p>}
          </div>
        </div>
      </main>
    </>
  );
}

export default HomePage;
