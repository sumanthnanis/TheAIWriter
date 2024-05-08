const mongoose = require("mongoose");
const Paper = new mongoose.Schema(
  {
    pdf: String,
    title: String,
    description: String,
  },
  { collection: "paperDetails" }
);
const model = mongoose.model("Paper", Paper);
module.exports = model;
