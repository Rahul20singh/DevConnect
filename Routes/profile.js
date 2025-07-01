const express = require("express")

const profileRouter = express.Router()
const User = require("../models/user")
const {userAuth} = require("../middlewares/auth")

profileRouter.get("/profile", userAuth,  async(req, res) => {
  try{
    let _id = req.user._id
    let allUsers = await User.findById(_id);
    console.log("Fetched users:", allUsers);
    res.json(allUsers);
  }
  catch(err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  } 
});

profileRouter.get("/feed", userAuth,  async(req, res) => {
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

module.exports = profileRouter;