import { db } from "./firebase";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc
} from "firebase/firestore";

export async function saveRecipeForUser(userId, recipe) {
  const recipeRef = doc(db, "users", userId, "recipes", String(recipe.id));

  await setDoc(recipeRef, {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    readyInMinutes: recipe.readyInMinutes || null,
    servings: recipe.servings || null,
    healthScore: recipe.healthScore || null,
    pricePerServing: recipe.pricePerServing || null,
    notes: recipe.notes || "",
    tried: recipe.tried || false,
    savedAt: new Date().toISOString()
  });
}

export async function getSavedRecipesForUser(userId) {
  const recipesCollection = collection(db, "users", userId, "recipes");
  const snapshot = await getDocs(recipesCollection);

  return snapshot.docs.map((docItem) => docItem.data());
}

export async function deleteSavedRecipeForUser(userId, recipeId) {
  const recipeRef = doc(db, "users", userId, "recipes", String(recipeId));
  await deleteDoc(recipeRef);
}

export async function updateRecipeForUser(userId, recipeId, updates) {
  const recipeRef = doc(db, "users", userId, "recipes", String(recipeId));
  await updateDoc(recipeRef, updates);
}