var express = require("express");
var router = express.Router();

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

// log new recipes

let recipes = [];

router.post("/recipe/", (req, res) => {
  let recipe = req.body;
  recipes.push(recipe);
  console.log("Received recipe:", recipe);
  res.json(recipe);
});

// image route
router.post("/new_images", (req, res) => {
  console.log("/images hit, responding with Hi");
  res.send("Hi");
});

//////////////// END API ////////////////

module.exports = router;
