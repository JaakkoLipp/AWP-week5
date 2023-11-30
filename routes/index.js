var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");

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
