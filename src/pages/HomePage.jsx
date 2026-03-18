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

      <main className="page-container">
        <header>
          <h1>Welcome to QuickBites</h1>
        </header>

        <section>
          {isGuest ? (
            <p>You are browsing as a guest.</p>
          ) : (
            <p>You are logged in as {user?.email}.</p>
          )}

          <p>Saved recipes: {savedCount}</p>
          <p>Tried recipes: {triedCount}</p>
        </section>

        <section>
          {weather && (
            <>
              <p>
                Current temperature in {weather.city}: {weather.temperature}°F
              </p>
              <p>Weather category: {getWeatherCategory(weather.temperature)}</p>
            </>
          )}
        </section>

        <section>
          {suggestedRecipes.length > 0 && (
            <>
              <h2>Recipe Suggestions For Today</h2>

              <div>
                {suggestedRecipes.map((recipe) => (
                  <article key={recipe.id}>
                    <h3>{recipe.title}</h3>
                    <img src={recipe.image} alt={recipe.title} width="200" />
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        {weatherError && <p>{weatherError}</p>}
        {error && <p>{error}</p>}
      </main>
    </>
  );
}

export default HomePage;