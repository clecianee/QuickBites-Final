function RecipeCard({
  recipe,
  onViewDetails,
  onSaveRecipe,
  showSaveButton = false,
}) {
  return (
    <div className="recipe-card">
      <h3>{recipe.title}</h3>
      <img src={recipe.image} alt={recipe.title} />

      <div className="recipe-card-buttons">
        <button type="button" onClick={() => onViewDetails(recipe.id)}>
          View Details
        </button>

        {showSaveButton && (
          <button type="button" onClick={() => onSaveRecipe(recipe)}>
            Save Recipe
          </button>
        )}
      </div>
    </div>
  );
}

export default RecipeCard;