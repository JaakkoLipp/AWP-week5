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

// Function to add checkboxes to the form
fetch("/categories")
  .then((response) => response.json())
  .then((categories) => {
    console.log(categories);
    const container = document.getElementById("special-diets");

    categories.forEach((category) => {
      // Create the checkbox input
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "category_" + category._id; // Prefixing ID to avoid conflicts
      checkbox.classList.add("filled-in"); // Materialize class for checkboxes
      checkbox.name = "categories";
      checkbox.value = category._id;

      // Create the visual span for Materialize
      const span = document.createElement("span");
      span.textContent = category.name;

      // Create the label and append the checkbox and span to it
      const label = document.createElement("label");
      label.htmlFor = "category_" + category._id;
      label.appendChild(checkbox);
      label.appendChild(span);

      // Append the label to the container
      container.appendChild(label);
      container.appendChild(document.createElement("br")); // Line break for spacing
    });
  })
  .catch((error) => {
    console.error("Error fetching categories:", error);
  });

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

  // Get all checked checkboxes from the special diets section
  const checkedCategories = document.querySelectorAll(
    '#special-diets input[type="checkbox"]:checked'
  );
  // Map over them to extract the values (the category ids)
  const selectedCategoryIds = Array.from(checkedCategories).map(
    (cb) => cb.value
  );

  const recipeName = document.getElementById("name-text").value;
  const recipeData = {
    name: recipeName,
    ingredients: ingredientsList,
    instructions: instructionsList,
    categories: selectedCategoryIds,
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
