const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model.js");
const jwt = require("jsonwebtoken");
const Paper = require("./models/paper.js");
const path = require("path");
const fs = require("fs");
const app = express();
app.use(cors());

mongoose.connect("mongodb://localhost:27017/researchdata", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("db connected");
});

app.use(express.json());

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/register", async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      role: req.body.role,
    });
    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (user) {
      const token = jwt.sign(
        {
          email: user.email,
          password: user.password,
        },
        "asdfghjkl1234567890"
      );

      res.json({
        token: token,
        email: user.email,
        username: user.username,
        role: user.role,
      });
    } else {
      res.json({ status: "error", user: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error" });
  }
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const title = req.body.title;
  const description = req.body.description;
  const username = req.body.username;

  try {
    await Paper.create({
      title: title,
      description: description,
      pdf: req.file.filename,
      uploadedBy: username,
      count: 0,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.get("/api/get-papers", async (req, res) => {
  try {
    const papers = await Paper.find({});
    res.send(papers);
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.get("/api/search", async (req, res) => {
  let query = {};
  const searchData = req.query.search;
  console.log(searchData);
  if (searchData) {
    query = {
      $or: [
        { title: { $regex: searchData, $options: "i" } },
        { description: { $regex: searchData, $options: "i" } },
        { uploadedBy: { $regex: searchData, $options: "i" } },
      ],
    };
  }
  try {
    const papers = await Paper.find(query);
    res.send(papers);
  } catch (error) {
    console.log(error);
    res.send({ status: "error" });
  }
});

const incrementCount = async (path) => {
  try {
    // Remove leading slash from path
    const filename = path.substring(1);
    let file = await Paper.findOne({ pdf: filename });
    console.log("File found in database:", file);

    if (file) {
      file.count++;
      await file.save();
      console.log(`Count incremented for file: ${filename}`);
    } else {
      console.log("File not found in database");
    }
  } catch (err) {
    console.error("Error incrementing count:", err);
  }
};

app.use(
  "/files",
  async (req, res, next) => {
    console.log(req.path);
    await incrementCount(req.path);
    next();
  },
  express.static(path.join(__dirname, "files"))
);

app.listen(8000, () => {
  console.log("server started");
});
