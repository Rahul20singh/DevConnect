const express = require("express");

const app = express();
const bcrypt = require("bcrypt")
const { userAuth } = require("../middlewares/auth");
const connectDB = require("../config/database");
const User = require("../models/user");

const validateData = require("../utils/validator");

app.use(express.json());


app.patch("/user", async(req, res) => {

  let email = req.body.email;
  let updatedData = req.body;
  console.log("email:", email);
  try {
    let updatedUser = await User.updateOne({"email": email}, updatedData, {
      new: true, // Return the updated document
      runValidators: true // Ensure that the update respects the schema validation
    });
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: error.message });
    
  }

})


app.delete("/user", async(req, res) => {

  try {
    let userId = req.body.userId;
    if (!userId) {
      console.error("User ID is required for deletion");
      return res.status(400).json({ error: "User ID is required" });
    }
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
    
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Error deleting user:", error);
  }
})



app.get("/user", async(req, res) => {

  let userId = req.body.userId;


  try {

    let userData = await User.findById(userId);
    if (!userData) {  


      
      console.error("User not found with ID:", userId);
      return res.status(404).json({ error: "User not found" });
    } 

    res.json(userData);
  } catch (err) {


    console.error("Error in /user route:", err);
    return res.status(500).json({ error: "Internal Server Error" });

  }
});

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

app.post("/login", async (req, res) => {
  console.log("Received login request:", req.body);
  const {email, password} = req.body;
  try {
    let isUser = await User.findOne({email: email})
    if(!isUser) {
      throw new Error("invalid credentials")
    }

    let verifyPassword = await bcrypt.compare(password, isUser.password);
    console.log("Password verification result:", verifyPassword);
    if(!verifyPassword){
      throw new Error("invalid credentials");  
    }
   

  
    res.send("login successful");
  } catch (err) {
    console.error("Error logging user:", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/signup", async (req, res) => {
  console.log("Received signup request:", req.body);
  const userData = req.body;
  try {

    await validateData(userData);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    let newUser = new User({
      firstName: userData.firstName,
      lastName: userData.lastName,
      age: userData.age,
      email: userData.email,
      password: hashedPassword,
    });

    await newUser.save();
    res.send("User created successfully");
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ error: err.message });
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
