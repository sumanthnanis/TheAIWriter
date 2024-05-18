const mongoose = require("mongoose");

const PaperSchema = new mongoose.Schema(
  {
    pdf: String,
    title: String,
    description: String,
    uploadedBy: String,
    count: Number,
    citations: Number,
    draft: Number,
    categories: [String],
    publicationDate: Date,
  },
  { collection: "paperDetails" }
);

const Paper = mongoose.model("Paper", PaperSchema);

module.exports = Paper;
