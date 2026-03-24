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
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close recipe details"
        >
          Close
        </button>

        <h2 id="recipe-title" className="modal-title">
          {recipe.title}
        </h2>

        <img
          src={recipe.image}
          alt={`Image of ${recipe.title}`}
          className="modal-image"
        />

        <div className="modal-stats">
          <p className="modal-stat">
            <span className="modal-stat-label">Ready in:</span>{" "}
            {recipe.readyInMinutes} minutes
          </p>
          <p className="modal-stat">
            <span className="modal-stat-label">Servings:</span>{" "}
            {recipe.servings}
          </p>
          <p className="modal-stat">
            <span className="modal-stat-label">Health score:</span>{" "}
            {recipe.healthScore}
          </p>
          <p className="modal-stat">
            <span className="modal-stat-label">Price per serving:</span> $
            {recipe.pricePerServing
              ? (recipe.pricePerServing / 100).toFixed(2)
              : "N/A"}
          </p>
        </div>

        <div className="modal-ingredients-section">
          <h3 className="modal-subtitle">Ingredients</h3>
          <ul className="modal-ingredients-list">
            {recipe.extendedIngredients?.map((ingredient) => (
              <li key={ingredient.id} className="modal-ingredient-item">
                {ingredient.original}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RecipeModal;