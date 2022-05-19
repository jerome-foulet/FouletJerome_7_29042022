const searchSentenceInRecipesArray = (inputToSearch, recipesArray) => {
  // Filter recipes
  return recipesArray.filter(recipe => {
    // Create string of ingredients
    const ingredients = recipe.ingredients
      .map(ingredient => ingredient.ingredient)
      .join(' ');
      // Search input into sentence and return true or false to filter current recipe
    return `${recipe.name} ${recipe.description} ${ingredients}`
      .toLocaleLowerCase()
      .includes(inputToSearch.toLowerCase());
  });
}
export { searchSentenceInRecipesArray };