import { recipes } from '../data/recipes.js'
import { searchSentenceInRecipesArray } from './sentenceSearch.js'

// Globals selectors
const searchInput = document.querySelector('#searchRecipeInput')
const searchIngredientInput = document.querySelector('#searchIngredientInput')
const ingredientList = document.querySelector('#ingredientsList')
const searchApplianceInput = document.querySelector('#searchApplianceInput')
const appliancesList = document.querySelector('#appliancesList')
const searchUstensilInput = document.querySelector('#searchUstensilInput')
const ustensilsList = document.querySelector('#ustensilsList')
const cardsList = document.querySelector('#cards')
const tagsList = document.querySelector('#tagsList')

// Globals variables
let sentenceRecipesArray = []
let tagRecipesArray = []
let recipesToDisplay = []
let tags = {
  ingredients : [],
  appliances : [],
  ustensils : []
}
let tagsFull = JSON.parse(JSON.stringify(tags))
let selectedTags = JSON.parse(JSON.stringify(tags))

// Handle display of list of tags on focus and blur
searchIngredientInput.addEventListener('focus', (e) => {
  toggleDisplayOfList (ingredientList, searchIngredientInput)
})
searchIngredientInput.addEventListener('blur', (e) => {
  toggleDisplayOfList (ingredientList, searchIngredientInput)
})
searchApplianceInput.addEventListener('focus', (e) => {
  toggleDisplayOfList (appliancesList, searchApplianceInput)
})
searchApplianceInput.addEventListener('blur', (e) => {
  toggleDisplayOfList (appliancesList, searchApplianceInput)
})
searchUstensilInput.addEventListener('focus', (e) => {
  toggleDisplayOfList (ustensilsList, searchUstensilInput)
})
searchUstensilInput.addEventListener('blur', (e) => {
  toggleDisplayOfList (ustensilsList, searchUstensilInput)
})
const toggleDisplayOfList = (listElement, input) => {
  if (listElement.style.display === "grid") {
    listElement.style.display = "none"
    listElement.style.removeProperty("min-width")
    input.removeAttribute('placeholder')
    input.value = ucFirst(input.nextElementSibling.textContent.split(" ")[2] + "s")
    input.setAttribute('value', ucFirst(input.nextElementSibling.textContent.split(" ")[2] + "s"))
    input.nextElementSibling.nextElementSibling.classList.remove('fa-chevron-up')
    input.nextElementSibling.nextElementSibling.classList.add('fa-chevron-down')
  } else {
    listElement.style.display = "grid"
    listElement.style.minWidth = "275px"
    input.setAttribute('placeholder', input.nextElementSibling.textContent)
    input.removeAttribute('value')
    input.value = ''
    input.nextElementSibling.nextElementSibling.classList.add('fa-chevron-up')
    input.nextElementSibling.nextElementSibling.classList.remove('fa-chevron-down')
  }
}
const updateTagList = () => {
  tags = {
    ingredients : [],
    appliances : [],
    ustensils : []
  }
  for (let index = 0; index < recipesToDisplay.length; index++) {
    const recipe = recipesToDisplay[index];
    // Ingredients
    for (let recipeIndex = 0; recipeIndex < recipe.ingredients.length; recipeIndex++) {
      const ingredient = recipe.ingredients[recipeIndex];
      if (tags.ingredients.findIndex(item => ingredient.ingredient.toLowerCase() === item.toLowerCase()) === -1
        && selectedTags.ingredients.findIndex(item => ingredient.ingredient.toLowerCase() === item.toLowerCase()) === -1) {
        tags.ingredients.push(ucFirst(ingredient.ingredient))
      }
    }
    // Appliance
    if (tags.appliances.findIndex(item => recipe.appliance.toLowerCase() === item.toLowerCase()) === -1
      && selectedTags.appliances.findIndex(item => recipe.appliance.toLowerCase() === item.toLowerCase()) === -1) {
      tags.appliances.push(ucFirst(recipe.appliance))
    }
    // Ustensiles
    for (let index = 0; index < recipe.ustensils.length; index++) {
      const ustensil = recipe.ustensils[index];
      if (tags.ustensils.findIndex(item => ustensil.toLowerCase() === item.toLowerCase()) === -1
        && selectedTags.ustensils.findIndex(item => ustensil.toLowerCase() === item.toLowerCase()) === -1) {
        tags.ustensils.push(ucFirst(ustensil))
      }
    }
  }
  tagsFull = JSON.parse(JSON.stringify(tags))
  displayTagList ()
}

// Search functions
const runSentenceSearch = (e) => {
  if (searchInput.value.length < 3) {
    if (sentenceRecipesArray.length !== recipes.length) {
      sentenceRecipesArray = recipes
      displayRecipes ()
    }
    return
  }
  sentenceRecipesArray = searchSentenceInRecipesArray(searchInput.value, recipes)
  displayRecipes ()
}
const runTagSearch = (e) => {
  // Check if selectedTags empty to reset tagRecipesArray = recipes and skip search
  if (isTagArrayEmpty (selectedTags)) {
    tagRecipesArray = recipes
    displayRecipes ()
    return
  }
  searchSelectedTagsInRecipesArray ()
  displayRecipes ()
}
const searchSelectedTagsInRecipesArray = () => {
  tagRecipesArray = []
  let matchedRecipes = recipes.filter((recipe) => {
    // Ingredients
    let recipesIngredientsArray = recipe.ingredients.map((ingredient) => {
      return ingredient.ingredient.toLowerCase()
    })
    // If all selectedTags ingredients are not in recipesIngredients, skip current recipe
    if (!selectedTags.ingredients.every(element => recipesIngredientsArray.indexOf(element.toLowerCase()) > -1)) 
      return false

    // Ustensils
    let recipesUstensilsArray = recipe.ustensils.map((ustensil) => {
      return ustensil.toLowerCase()
    })
    // If all selectedTags ustensils are not in recipesUstensilsArray, skip current recipe
    if (!selectedTags.ustensils.every(element => recipesUstensilsArray.indexOf(element.toLowerCase()) > -1)) 
      return false

    // Appliance
    // If all selectedTags appliances are not equal to recipe appliance, skip current recipe
    if (!selectedTags.appliances.every(element => recipe.appliance.toLowerCase() === element.toLowerCase()))
      return false

    // If all conditions are ok then return recipe
    return true
  })
  tagRecipesArray = matchedRecipes
}

// Display functions
const displayRecipes = () => {
  mergeRecipesArrayToDisplay ()
  updateTagList ()
  cardsList.textContent = ''
  if (recipesToDisplay.length === 0) {
    cardsList.appendChild(htmlToElement(`
      <h2>Aucune recette ne correspond à votre critère… vous pouvez
      chercher « tarte aux pommes », « poisson », etc.</h2>
    `))
    return
  }
  console.log(recipesToDisplay);
  for (let index = 0; index < recipesToDisplay.length; index++) {
    const recipe = recipesToDisplay[index];
    // Create DOM element
    const recipeCardDOM = htmlToElement (`
      <div class="card">
        <header>
        </header>
        <section>
          <div>
            <h2>${recipe.name}</h2>
            <i class="fa-regular fa-clock"></i>
            <p>${recipe.time} min</p>
          </div>
          <div class="recette">
            <ul>
              ${getIngredientsHTML (recipe)}
            </ul>
            <p>
            ${recipe.description}
            </p>
          </div>
        </section>
      </div>
    `)
    cardsList.appendChild(recipeCardDOM)
  }
}
const getIngredientsHTML = (recipe) => {
  let ingredientsHTML = ''
  for (let index = 0; index < recipe.ingredients.length; index++) {
    const ingredient = recipe.ingredients[index];
    let quantity = ''
    if ('quantity' in ingredient || 'quantite' in ingredient) {
      quantity = `: ${ingredient.quantity??ingredient.quantite??''} `
      if ('unit' in ingredient) {
        quantity += convertUnit (ingredient.unit)
      }
    }
    ingredientsHTML += `
      <li><span>${ingredient.ingredient}</span>${quantity}</li>
    `
  }
  return ingredientsHTML
}
const convertUnit = (unitToConvert) => {
  switch (unitToConvert) {
    case 'cuillères à soupe':
    case 'cuillère à soupe':
      return 'càs'
      break;
    case 'cuillères à café':
      return 'càc'
      break;
    case 'grammes':
      return 'g'
      break;
    default:
      return unitToConvert
      break;
  }
}
const displayTagList = () => {
  for (var category in tags) {
    let selector
    if (category === 'ingredients') selector = ingredientList
    if (category === 'appliances') selector = appliancesList
    if (category === 'ustensils') selector = ustensilsList
    selector.textContent = ''
    for (let index = 0; index < tags[category].length; index++) {
      const tag = tags[category][index];
      selector.appendChild(htmlToElement(`
        <li>${tag}</li>
      `)).addEventListener('mousedown', selectTag)
    }
  }
}
const displaySelectedTags = () => {
  tagsList.textContent = ''
  for (var category in selectedTags) {
    for (let index = 0; index < selectedTags[category].length; index++) {
      const tag = selectedTags[category][index];
      tagsList.appendChild(htmlToElement(`
        <li class="tag bg-${category}">
          <p>${tag}</p>
          <i class="fa-regular fa-circle-xmark text-light"></i>
        </li>
      `)).querySelector('i').addEventListener('click', removeTag)
    }
  }
}

// Utilities functions
const isTagArrayEmpty = (tagArray) => {
  if (tagArray['ingredients'].length === 0 
    && tagArray['appliances'].length === 0
    && tagArray['ustensils'].length === 0
  ) return true
  else {
    return false
  }
}
const mergeRecipesArrayToDisplay = () => {
  recipesToDisplay = []
  if (tagRecipesArray.length === 0 && sentenceRecipesArray.length === 0) {
    if (searchInput.value.length < 3 && isTagArrayEmpty(selectedTags)) recipesToDisplay = recipes
    return
  } else if (sentenceRecipesArray.length === 0) {
    recipesToDisplay = tagRecipesArray
    return
  } else if (tagRecipesArray.length === 0) {
    recipesToDisplay = sentenceRecipesArray
    return
  }
  for (let sentenceIndex = 0; sentenceIndex < sentenceRecipesArray.length; sentenceIndex++) {
    const sentenceRecipe = sentenceRecipesArray[sentenceIndex];
    for (let tagIndex = 0; tagIndex < tagRecipesArray.length; tagIndex++) {
      const tagRecipe = tagRecipesArray[tagIndex];
      if (sentenceRecipe.id === tagRecipe.id) recipesToDisplay.push(tagRecipe)
    }
  }
}
const selectTag = (e) => {
  const category = e.target.parentElement.id.replace("List", '')
  const tagValue = e.target.textContent
  // Remove tag from list and update display
  tags[category].splice(tags[category].indexOf(tagValue), 1)
  displayTagList ()
  // Add tag on selectedTags and display selectedTags
  selectedTags[category].push(tagValue)
  displaySelectedTags ()
  runTagSearch ()
}
const removeTag = (e) => {
  const tagValue = e.target.parentElement.querySelector('p').textContent
  const category = e.target.parentElement.classList.value.replace('tag bg-', '')
  // Remove tag from selected and update display
  selectedTags[category].splice(selectedTags[category].indexOf(tagValue), 1)
  displaySelectedTags ()
  // Add tag on list and update display
  tags[category].push(tagValue)
  displayTagList ()
  runTagSearch ()
}
const restrictTagListOnInput = (e, category) => {
  // Range of chars a-z
  //if (e.keyCode >= 65 && e.keyCode <= 90) {
    // Get value and return only those who matches
    const enteredValue = e.target.value
    tags[category] = tags[category].filter(element => element.toLowerCase().includes(enteredValue.toLowerCase()))
    displayTagList ()
    tags[category] = JSON.parse(JSON.stringify(tagsFull[category]))
    tags[category] = tags[category].filter(element => !selectedTags[category].includes(element))
  //}
}
const ucFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const htmlToElement = (html) => {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

// Global listeners
searchInput.addEventListener('keyup', runSentenceSearch)
searchIngredientInput.addEventListener('keyup', function(e) {
  restrictTagListOnInput(e, 'ingredients')
})
searchApplianceInput.addEventListener('keyup', function(e) {
  restrictTagListOnInput(e, 'appliances')
})
searchUstensilInput.addEventListener('keyup', function(e) {
  restrictTagListOnInput(e, 'ustensils')
})

// Init function
const init = () => {
  // Display all recipes
  recipesToDisplay = recipes
  displayRecipes ()
}

init ()