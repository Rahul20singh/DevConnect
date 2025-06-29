const express = require("express");

const app = express();

app.use("/homePage", (req, res) => {
  res.send("Hello, from home page!");
});

app.use("/feedPage", (req, res) => {
  res.send("Hello, from feed page!");
});

app.use("/loginPage", (req, res) => {
  res.send("Hello, from login page!");
});

app.use("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
