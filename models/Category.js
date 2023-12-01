const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let CategorySchema = new Schema({
  name: String,
});

module.exports = mongoose.model("Category", CategorySchema, "category");
