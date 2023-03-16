require("colors");
require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 4000;

let refreshTokens = [];

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("AuthZ server !");
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
}

// create a new token from refresh token.
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;

  // body does not contain a token field.
  if (refreshToken == null) return res.sendStatus(401);

  // verify that refreshToken is valid.
  if (!refreshToken.includes(refreshTokens)) return res.sendStatus(403);

  // confirm the validity of refreshToken.
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // refreshToken is not vaild.

    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken });
  });
});

app.post("/login", (req, res) => {
  // Authenticate User

  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`.red);
});
