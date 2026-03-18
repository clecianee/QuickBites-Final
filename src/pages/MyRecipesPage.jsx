import "../styles/recipes.css";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  getSavedRecipesForUser,
  deleteSavedRecipeForUser,
  updateRecipeForUser
} from "../services/recipeStoreService";

function MyRecipesPage() {
  const { user, isGuest } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [draftNote, setDraftNote] = useState("");

  useEffect(() => {
    async function loadRecipes() {
      if (isGuest) {
        setRecipes([]);
        setMessage("Guests do not have saved recipes.");
        return;
      }

      if (!user) {
        setError("No logged-in user found.");
        return;
      }

      try {
        const savedRecipes = await getSavedRecipesForUser(user.uid);
        setRecipes(savedRecipes);
        setMessage(`Loaded ${savedRecipes.length} saved recipe(s).`);
        setError("");
      } catch (err) {
        console.error("Load recipes error:", err);
        setError("Failed to load saved recipes.");
      }
    }

    loadRecipes();
  }, [user, isGuest]);

  async function handleDelete(recipeId) {
    if (!user) return;
    const confirmed = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmed) return;

    try {
      await deleteSavedRecipeForUser(user.uid, recipeId);
      setRecipes((currentRecipes) =>
        currentRecipes.filter((recipe) => recipe.id !== recipeId)
      );
      setMessage("Recipe deleted.");
      setError("");
    } catch (err) {
      console.error("Delete recipe error:", err);
      setError("Failed to delete recipe.");
    }
  }

  async function handleToggleTried(recipeId, currentValue) {
    if (!user) return;
    try {
      await updateRecipeForUser(user.uid, recipeId, { tried: !currentValue });
      setRecipes((currentRecipes) =>
        currentRecipes.map((recipe) =>
          recipe.id === recipeId ? { ...recipe, tried: !currentValue } : recipe
        )
      );
      setMessage("Recipe updated.");
      setError("");
    } catch (err) {
      console.error("Toggle tried error:", err);
      setError("Failed to update recipe.");
    }
  }

  function handleStartEditing(recipe) {
    setEditingRecipeId(recipe.id);
    setDraftNote(recipe.notes || "");
  }

  function handleCancelEditing() {
    setEditingRecipeId(null);
    setDraftNote("");
  }

  async function handleSaveNotes(recipeId) {
    if (!user) return;
    try {
      await updateRecipeForUser(user.uid, recipeId, { notes: draftNote });
      setRecipes((currentRecipes) =>
        currentRecipes.map((recipe) =>
          recipe.id === recipeId ? { ...recipe, notes: draftNote } : recipe
        )
      );
      setEditingRecipeId(null);
      setDraftNote("");
      setMessage("Notes saved.");
      setError("");
    } catch (err) {
      console.error("Save notes error:", err);
      setError("Failed to save notes.");
    }
  }

  return (
    <>
      <Navbar />

      <main className="page-container">
        <header>
          <h1>My Saved Recipes</h1>
        </header>

        {message && <p>{message}</p>}
        {error && <p className="error">{error}</p>}

        <section>
          {recipes.length === 0 ? (
            <p>No saved recipes yet.</p>
          ) : (
            <div className="recipe-grid">
              {recipes.map((recipe) => (
                <article key={recipe.id} className="recipe-card">
                  <h3>{recipe.title}</h3>
                  <img src={recipe.image} alt={recipe.title} />
                  <p>Ready in: {recipe.readyInMinutes ?? "N/A"} minutes</p>
                  <p>Servings: {recipe.servings ?? "N/A"}</p>
                  <p>Tried: {recipe.tried ? "Yes" : "No"}</p>

                  <button
                    type="button"
                    onClick={() => handleToggleTried(recipe.id, recipe.tried)}
                  >
                    Mark as {recipe.tried ? "Not Tried" : "Tried"}
                  </button>

                  <section>
                    <p>Notes:</p>
                    {editingRecipeId === recipe.id ? (
                      <>
                        <textarea
                          value={draftNote}
                          onChange={(e) => setDraftNote(e.target.value)}
                        />
                        <br />
                        <button type="button" onClick={() => handleSaveNotes(recipe.id)}>
                          Save Notes
                        </button>
                        <button type="button" onClick={handleCancelEditing}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <p>{recipe.notes || "No notes yet."}</p>
                        <button type="button" onClick={() => handleStartEditing(recipe)}>
                          Edit Notes
                        </button>
                      </>
                    )}
                  </section>

                  <br />

                  <button type="button" onClick={() => handleDelete(recipe.id)}>
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default MyRecipesPage;
