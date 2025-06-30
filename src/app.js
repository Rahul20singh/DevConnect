const express = require("express");

const app = express();
const { userAuth } = require("../middlewares/auth");
const connectDB = require("../config/database");
const User = require("../models/user");

app.use(express.json());

app.get("/feed", async(req, res) => {
  try{
    let allUsers = await User.find();
    console.log("Fetched users:", allUsers);
    res.json(allUsers);
  }
  catch(err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  } 
});

app.post("/signup", async (req, res) => {
  console.log("Received signup request:", req.body);
  const { firstName, lastName, age, city, email, password } = req.body;
  try {
    let newUser = new User({
      firstName: firstName,
      lastName: lastName,
      age: age,
    });

    await newUser.save();
    res.send("User created successfully");
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// app.get("/user", userAuth, (req, res, next) => {
//   console.log("This is a middleware function");
//   res.json({ name: "Sara Doe", age: 30 });
// });

// app.get("/user/data", (req, res) => {
//   res.json({ name: "John Doe", age: 30 });
// });

// //query paramters
// app.get("/test", (req, res) => {
//   res.json({ name: "mike Doe", age: 30, id: req.query });
// });

// //route paramaters

// app.get("/test/:id/:name", (req, res) => {
//   res.json({ name: req.params.name, age: 30, id: req.params.id });
// });

// app.post("/user", (req, res) => {
//   // const user = req.body;
//   res.json({ name: "Ryan Doe", age: 30 });
// });

// app.delete("/user", (req, res) => {
//   // const user = req.body;
//   res.json({ name: "Dan Doe", age: 30 });
// });

// app.put("/user", (req, res) => {
//   // const user = req.body;

//   res.json({ name: "Jane Doe", age: 30 });
// });

connectDB()
  .then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit the process with failure
  });
