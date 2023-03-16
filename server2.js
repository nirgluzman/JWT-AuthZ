require("colors");
require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 4000;

// Sample posts
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

const app = express();

app.use(express.json());

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Authentication header is missing
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token is not valid.
    req.user = user;
    next();
  });
}

app.get("/", (req, res) => {
  res.send("Welcome to JWT AuthN Tutorial !");
});

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.post("/login", (req, res) => {
  // Authenticate User

  const username = req.body.username;
  const user = { name: username };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`.red);
});
