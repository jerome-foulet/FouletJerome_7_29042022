const searchSentenceInRecipesArray = (inputToSearch, recipesArray) => {
  let matchedRecipes = []
  for (let recipesIndex = 0; recipesIndex < recipesArray.length; recipesIndex++) {
    const recipe = recipesArray[recipesIndex];
    let ingredients = ''
    for (let ingredientIndex = 0; ingredientIndex < recipe.ingredients.length; ingredientIndex++) {
      const ingredient = recipe.ingredients[ingredientIndex];
      // Space to avoid fusion of 2 ingredients
      ingredients += ` ${ingredient.ingredient}`
    }
    // Space to avoid fusion of our 3 use case
    const sentenceToSearchIn = `${recipe.name} ${recipe.description} ${ingredients}`
    if (sentenceToSearchIn.toLowerCase().indexOf(inputToSearch.toLowerCase(), 0) !== -1) {
      matchedRecipes.push(recipe)
    }
  }
  return matchedRecipes
}
export { searchSentenceInRecipesArray };