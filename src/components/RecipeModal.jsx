function RecipeModal({ recipe, onClose }) {
  if (!recipe) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-title"
    >
      <div className="modal-content">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close recipe details"
        >
          Close
        </button>

        <h2 id="recipe-title">{recipe.title}</h2>

        <img
          src={recipe.image}
          alt={`Image of ${recipe.title}`}
        />

        <p>Ready in: {recipe.readyInMinutes} minutes</p>
        <p>Servings: {recipe.servings}</p>
        <p>Health score: {recipe.healthScore}</p>

        <p>
          Price per serving: $
          {recipe.pricePerServing
            ? (recipe.pricePerServing / 100).toFixed(2)
            : "N/A"}
        </p>

        <h3>Ingredients</h3>
        <ul>
          {recipe.extendedIngredients?.map((ingredient) => (
            <li key={ingredient.id}>{ingredient.original}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RecipeModal;