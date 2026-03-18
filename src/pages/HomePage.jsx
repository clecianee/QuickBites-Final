import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getSavedRecipesForUser } from "../services/recipeStoreService";

function HomePage() {
  const { user, isGuest } = useAuth();
  const [savedCount, setSavedCount] = useState(0);
  const [triedCount, setTriedCount] = useState(0);
  const [error, setError] = useState("");

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

  return (
    <div>
      <Navbar />

      <h1>Welcome to QuickBites</h1>

      {isGuest ? (
        <p>You are browsing as a guest.</p>
      ) : (
        <p>You are logged in as {user?.email}.</p>
      )}

      <p>Saved recipes: {savedCount}</p>
      <p>Tried recipes: {triedCount}</p>

      {error && <p>{error}</p>}
    </div>
  );
}

export default HomePage;