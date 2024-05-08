const mongoose = require("mongoose");
const User = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
  },
  { collection: "user-data" }
);

const model = mongoose.model("User", User);
module.exports = model;
