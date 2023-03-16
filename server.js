require("colors");
require("dotenv").config();

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

const posts = [
  {
    username: "Nir",
    title: "Post-1",
  },
  {
    username: "Idan",
    title: "Post-2",
  },
];

app.get("/", (req, res) => {
  res.send("Welcome to JWT AuthN Tutorial !");
});

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`.red);
});
