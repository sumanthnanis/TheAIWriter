const mongoose = require("mongoose");

const PaperSchema = new mongoose.Schema(
  {
    pdf: String,
    title: String,
    description: String,
    uploadedBy: String,
    count: Number,
    categories: [String], // Array field for categories
  },
  { collection: "paperDetails" }
);

const Paper = mongoose.model("Paper", PaperSchema);

module.exports = Paper;
