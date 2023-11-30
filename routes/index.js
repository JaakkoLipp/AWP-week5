var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//////////////// API ////////////////

router.get("/recipe/:food/", (req, res) => {
  const foodname = req.params.food;
  res.json({
    name: foodname,
    instructions: ["a", "b"],
    ingredients: ["a", "b"],
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
