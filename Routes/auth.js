const express = require("express");

const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateData } = require("../utils/validator");
const secret_key = require("../utils/constants");

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
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "login successful", data: isUser });
  } catch (err) {
    console.error("Error logging user:", err);
    return res.status(500).json({ message: err.message });
  }
});

authRouter.post("/signup", async (req, res) => {
  console.log("Received signup request:", req.body);
  const userData = req.body;
  try {
    validateData(userData);
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    let newUser = new User({
      ...userData,
      password: hashedPassword,
    });
    let updatedUser = await newUser.save();
    let token = await newUser.generateToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ message: "User created successfully", data: updatedUser });
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
