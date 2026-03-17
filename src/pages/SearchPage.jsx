import { useState } from "react";
import Navbar from "../components/Navbar";
import { searchRecipes, getRecipeDetails } from "../services/recipeService";
import {
  saveRecipeForUser,
  getSavedRecipesForUser
} from "../services/recipeStoreService";
import { useAuth } from "../context/AuthContext";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { user, isGuest } = useAuth();
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);

  async function handleSearch(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSelectedRecipe(null);

    try {
      const results = await searchRecipes(query);
      setRecipes(results);
      setMessage(`Found ${results.length} recipes.`);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "Failed to search recipes.");
    }
  }

  async function handleViewDetails(recipeId) {
    setError("");
    setMessage(`Loading details for recipe ${recipeId}...`);

    try {
      const details = await getRecipeDetails(recipeId);
      console.log("Recipe details loaded:", details);
      setSelectedRecipe(details);
      setMessage(`Loaded details for: ${details.title}`);
    } catch (err) {
      console.error("Details error:", err);
      setError(err.message || "Failed to fetch recipe details.");
      setMessage("");
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
    <div>
      <Navbar />

      <h1>Search Recipes</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for recipes..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <div>
        {recipes.map((recipe) => (
          <div key={recipe.id}>
            <h3>{recipe.title}</h3>
            <img src={recipe.image} alt={recipe.title} width="150" />
            <br />
            <button type="button" onClick={() => handleViewDetails(recipe.id)}>
              View Details
            </button>
            <button
              type="button"
              onClick={() =>
                handleSaveRecipe(
                  selectedRecipe && selectedRecipe.id === recipe.id
                    ? selectedRecipe
                    : recipe
                )
              }
            >
              Save Recipe
            </button>
          </div>
        ))}
      </div>

      {selectedRecipe && (
        <div>
          <button type="button" onClick={() => setSelectedRecipe(null)}>
            Close Details
          </button>

          <h2>{selectedRecipe.title}</h2>
          <img
            src={selectedRecipe.image}
            alt={selectedRecipe.title}
            width="200"
          />
          <p>Ready in: {selectedRecipe.readyInMinutes} minutes</p>
          <p>Servings: {selectedRecipe.servings}</p>
          <p>Health score: {selectedRecipe.healthScore}</p>
          <p>Price per serving: {selectedRecipe.pricePerServing}</p>

          <h3>Ingredients</h3>
          <ul>
            {selectedRecipe.extendedIngredients?.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.original}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchPage;