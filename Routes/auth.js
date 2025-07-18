const express = require("express");

const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateData } = require("../utils/validator");

// authRouter.get("/test", (req, res) => {
//   res.cookie("test", "123", {
//     httpOnly: true,
//     sameSite: "Lax",
//     secure: false,
//   });
//   res.json({ message: "CORS test OK" });
// });


authRouter.post("/login", async (req, res) => {
  console.log("Received login request:", req.body);
  const { email, password } = req.body;
  try {
    let isUser = await User.findOne({ email: email });
    if (!isUser) {
      throw new Error("invalid credentials");
    }

    let verifyPassword = await isUser.validatePassword(password);
    console.log("Password verification result:", verifyPassword);
    if (!verifyPassword) {
      throw new Error("invalid credentials");
    }

    let token = await isUser.generateToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({ message: "login successful", data: isUser });
  } catch (err) {
    console.error("Error logging user:", err);
    return res.status(500).json({ error: err.message });
  }
});

authRouter.post("/signup", async (req, res) => {
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
      photoUrl: userData.photoUrl
    });

    await newUser.save();
    res.send("User created successfully");
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ error: err.message });
  }
});

authRouter.post("/logout", (req, res, next) => {
  // res.cokkie("token", null, {
  //     expires: new Date(Date.now())
  // })
  res.clearCookie("token").send("Logout successful");
});

module.exports = authRouter;
