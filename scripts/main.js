import { recipes } from '../data/recipes.js'

// Globals selectors
const searchInput = document.querySelector('#searchRecipeInput')
const searchIngredientInput = document.querySelector('#searchIngredientInput')
const ingredientList = document.querySelector('#ingredientsList')
const searchApplianceInput = document.querySelector('#searchApplianceInput')
const appliancesList = document.querySelector('#appliancesList')
const searchUstensilInput = document.querySelector('#searchUstensilInput')
const ustensilsList = document.querySelector('#ustensilsList')
const cardsList = document.querySelector('#cards')

// Global variables
let recipesToDisplay = []

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

// Display function
function displayRecipes () {
  cardsList.textContent = ''
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
function getIngredientsHTML (recipe) {
  let ingredientsHTML = ''
  for (let index = 0; index < recipe.ingredients.length; index++) {
    let ingredient = recipe.ingredients[index];
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
function convertUnit (unitToConvert) {
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

// Utilities functions
function ucFirst (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function htmlToElement (html) {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

// Init function
function init () {
  // Display all recipes
  recipesToDisplay = recipes
  displayRecipes ()
}

init ()