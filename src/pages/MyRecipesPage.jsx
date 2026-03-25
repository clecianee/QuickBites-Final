import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  getSavedRecipesForUser,
  deleteSavedRecipeForUser,
  updateRecipeForUser,
} from "../services/recipeStoreService";
import { getRecipeDetails } from "../services/recipeService";
import RecipeModal from "../components/RecipeModal";

function MyRecipesPage() {
  const { user, isGuest } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [draftNote, setDraftNote] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

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

    const confirmed = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
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
      await updateRecipeForUser(user.uid, recipeId, {
        tried: !currentValue,
      });

      setRecipes((currentRecipes) =>
        currentRecipes.map((recipe) =>
          recipe.id === recipeId
            ? { ...recipe, tried: !currentValue }
            : recipe
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
      await updateRecipeForUser(user.uid, recipeId, {
        notes: draftNote,
      });

      setRecipes((currentRecipes) =>
        currentRecipes.map((recipe) =>
          recipe.id === recipeId
            ? { ...recipe, notes: draftNote }
            : recipe
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

  // --- View Details ---
  async function handleViewDetails(recipeId) {
    setIsLoadingDetails(true);
    try {
      const details = await getRecipeDetails(recipeId);
      setSelectedRecipe(details);
    } catch (err) {
      console.error("Details error:", err);
      setError("Failed to load recipe details.");
    } finally {
      setIsLoadingDetails(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="myrecipes-page page">
        <header className="myrecipes-header">
          <h1 className="myrecipes-title">My Saved Recipes</h1>
        </header>

        {message && <p className="myrecipes-message">{message}</p>}
        {error && <p className="myrecipes-error">{error}</p>}

        <section className="myrecipes-section">
          {recipes.length === 0 ? (
            <p className="myrecipes-empty">No saved recipes yet.</p>
          ) : (
            <div className="myrecipes-grid">
              {recipes.map((recipe) => (
                <article key={recipe.id} className="myrecipes-card card">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="myrecipes-image"
                  />

                  <h3 className="myrecipes-card-title">{recipe.title}</h3>

                  <div className="myrecipes-info">
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          recipe.tried
                            ? "myrecipes-badge tried"
                            : "myrecipes-badge not-tried"
                        }
                      >
                        {recipe.tried ? "Tried" : "Not Tried"}
                      </span>
                    </p>
                  </div>

                  <div className="myrecipes-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleViewDetails(recipe.id)}
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleDelete(recipe.id)}
                    >
                      Delete
                    </button>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        handleToggleTried(recipe.id, recipe.tried)
                      }
                    >
                      Mark as {recipe.tried ? "Not Tried" : "Tried"}
                    </button>
                  </div>

                  <div className="myrecipes-notes">
                    <p className="myrecipes-notes-label">Notes</p>

                    {editingRecipeId === recipe.id ? (
                      <>
                        <textarea
                          className="myrecipes-textarea"
                          value={draftNote}
                          onChange={(event) =>
                            setDraftNote(event.target.value)
                          }
                        />

                        <div className="myrecipes-note-buttons">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleSaveNotes(recipe.id)}
                          >
                            Save
                          </button>

                          <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={handleCancelEditing}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="myrecipes-note-text">
                          {recipe.notes || "No notes yet."}
                        </p>

                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => handleStartEditing(recipe)}
                        >
                          Edit Notes
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {isLoadingDetails && <p>Loading recipe details...</p>}

        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </main>
    </>
  );
}

export default MyRecipesPage;
