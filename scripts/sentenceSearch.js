const searchSentenceInRecipesArray = (inputToSearch, recipesArray) => {
  return recipesArray.filter(recipe => {
    const ingredients = recipe.ingredients
      .map(ingredient => ingredient.ingredient.toLowerCase())
      .join(' ')
    return [recipe.name, recipe.description, ingredients]
      .join(' ')
      .toLocaleLowerCase()
      .includes(inputToSearch.toLowerCase())
  })
}
export { searchSentenceInRecipesArray };