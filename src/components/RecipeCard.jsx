function RecipeCard({ recipe, onViewDetails, onSaveRecipe, showSaveButton = false, isSaved = false }) {
  return (
    <div className="recipe-card">
      <div className="recipe-image-wrapper">
        <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      </div>

      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.title}</h3>

        <div className="recipe-card-buttons">
          <button type="button" className="btn btn-secondary" onClick={() => onViewDetails(recipe.id)}>
            View Details
          </button>

          {showSaveButton && (
            <button
              type="button"
              className={`btn ${isSaved ? "btn-saved-green" : "btn-primary"}`}
              onClick={onSaveRecipe}
            >
              {isSaved ? "Saved" : "Save Recipe"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
