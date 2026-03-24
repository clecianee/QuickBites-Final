import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getSavedRecipesForUser } from "../services/recipeStoreService";
import {
  getCurrentTemperature,
  getWeatherCategory,
  getWeatherSearchQuery,
} from "../services/weatherService";
import { getWeatherRecipeSuggestions } from "../services/recipeService";
import "../styles/home.css";

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

      if (!user) {
        return;
      }

      try {
        const savedRecipes = await getSavedRecipesForUser(user.uid);
        setSavedCount(savedRecipes.length);
        setTriedCount(savedRecipes.filter((recipe) => recipe.tried).length);
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
        const weatherSearchQuery = getWeatherSearchQuery(category);
        console.log("Home weather search query:", weatherSearchQuery);

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

      <main className="home-page page">
        <header className="home-hero card">
          <div className="home-hero-text">
            <h1 className="home-title">Welcome to QuickBites</h1>
            <p className="home-subtitle">
              Discover recipes, track your favorites, and get suggestions based
              on today’s weather.
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
              <p>
                <span className="home-info-label">City:</span> {weather.city}
              </p>
              <p>
                <span className="home-info-label">Temperature:</span>{" "}
                {weather.temperature}°F
              </p>
              <p>
                <span className="home-info-label">Category:</span>{" "}
                {getWeatherCategory(weather.temperature)}
              </p>
            </div>
          ) : (
            <p className="home-muted">Loading weather...</p>
          )}
        </section>

        <section className="home-suggestions">
          {suggestedRecipes.length > 0 && (
            <>
              <div className="home-section-header">
                <h2 className="home-section-title">Recipe Suggestions For Today</h2>
                <p className="home-section-subtitle">
                  Picked to match today’s weather mood.
                </p>
              </div>

              <div className="home-suggestions-grid">
                {suggestedRecipes.map((recipe) => (
                  <article key={recipe.id} className="home-suggestion-card card">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="home-suggestion-image"
                    />
                    <h3 className="home-suggestion-title">{recipe.title}</h3>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        {weatherError && <p className="home-error">{weatherError}</p>}
        {error && <p className="home-error">{error}</p>}
      </main>
    </>
  );
}

export default HomePage;