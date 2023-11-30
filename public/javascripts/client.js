// on pageload get pizza recipe

function loadinitrecipe() {
  const recipedefault = "Pizza";
  fetch(`/recipe/${recipedefault}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("fetch failed");
      }
      return response.json();
    })
    .then((recipes) => {
      //take first result into page
      const recipe = recipes[0];
      const recipeElement = document.getElementById("recipe-div");
      recipeElement.innerHTML = `
              <h2>${recipe.name}</h2>
              <h4>Ingredients:</h4>
              <ul>${recipe.ingredients
                .map((ingredient) => `<li>${ingredient}</li>`)
                .join("")}</ul>
              <h4>Instructions:</h4>
              <ol>${recipe.instructions
                .map((step) => `<li>${step}</li>`)
                .join("")}</ol>
          `;
    })
    .catch((error) => console.error("Error:", error));
}
loadinitrecipe();

// UI code

document
  .getElementById("nav-recipe-search")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const recipe = document.getElementById("search").value;

    // get recipe data
    fetch(`/recipe/${recipe}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("fetch failed");
        }
        return response.json();
      })
      .then((recipes) => {
        //take first result into page
        const recipe = recipes[0];

        console.log(recipe);
        const recipeElement = document.getElementById("recipe-div");
        recipeElement.innerHTML = `
              <h2>${recipe.name}</h2>
              <h4>Ingredients:</h4>
              <ul>${recipe.ingredients
                .map((ingredient) => `<li>${ingredient}</li>`)
                .join("")}</ul>
              <h4>Instructions:</h4>
              <ol>${recipe.instructions
                .map((step) => `<li>${step}</li>`)
                .join("")}</ol>
          `;
      })
      .catch((error) => console.error("Error:", error));
  });

// new recipe arrays
let ingredientsList = [];
let instructionsList = [];

// Handle adding an ingredient
document.getElementById("add-ingredient").addEventListener("click", () => {
  const ingredient = document.getElementById("ingredients-text").value;
  ingredientsList.push(ingredient); // augh
  document.getElementById("ingredients-text").value = "";
});

// Handle adding an instruction
document.getElementById("add-instruction").addEventListener("click", () => {
  const instruction = document.getElementById("instructions-text").value;
  instructionsList.push(instruction);
  document.getElementById("instructions-text").value = "";
});

// Handle form submission
document.getElementById("recipe-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const recipeName = document.getElementById("name-text").value;
  const recipeData = {
    name: recipeName,
    ingredients: ingredientsList,
    instructions: instructionsList,
  };

  fetch("/recipe/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipeData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((recipeResponse) => {
      console.log("Recipe submitted:", recipeResponse);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  //claer fields
  document.getElementById("name-text").value = "";
  ingredientsList = [];
  instructionsList = [];
});

// Image uploading
document
  .getElementById("image-upload-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData();
    const imageFiles = document.getElementById("image-input").files;
    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("images", imageFiles[i]);
    }

    fetch("/new_images", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
