var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");
const Category = require("../models/Category");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/*
  const foodname = req.params.food;
  res.json({
    name: foodname,
    instructions: ["a", "b"],
    ingredients: ["a", "b"],
  });

*/

//////////////// API ////////////////

// gets the recipe from database
router.get("/recipe/:food", (req, res, next) => {
  const name = req.params.food;

  Recipe.find({ name: new RegExp(name, "i") })
    .then((recipe) => {
      if (recipe.length > 0) {
        console.log(recipe);
        return res.send(recipe);
      } else {
        return res.status(404).send("No recipe found for: " + name);
      }
    })
    .catch((err) => {
      return next(err);
    });
});

//populate special diets
router.get("/categories", (req, res) => {
  Category.find({})
    .then((categories) => {
      console.log(categories);
      res.json(categories);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

router.post("/recipe/", (req, res, next) => {
  // MongooseError: Model.findOne() no longer accepts a callback -> promise
  Recipe.findOne({ name: req.body.name })
    .then((recipe) => {
      // If recipe already exists
      if (recipe) {
        return res.status(403).send("Recipe already exists!");
      }

      // If the recipe doesn't exist
      const newRecipe = new Recipe({
        name: req.body.name,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        categories: req.body.categories,
      });

      // Save the new recipe
      return newRecipe.save().then(() => {
        res.send(req.body);
      });
    })
    .catch((err) => {
      next(err);
    });
});

// image route
router.post("/new_images", (req, res) => {
  console.log("/images hit, responding with Hi");
  res.send("Hi");
});

//////////////// END API ////////////////

module.exports = router;
