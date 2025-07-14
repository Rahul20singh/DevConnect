const express = require("express");

const profileRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
let { validateProfileEdit } = require("../utils/validator");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    let _id = req.user._id;
    let allUsers = await User.findById(_id);
    console.log("Fetched users:", allUsers);
    res.json(allUsers);
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// profileRouter.get("/feed", userAuth,  async(req, res) => {
//   try{
//     let allUsers = await User.find();
//     console.log("Fetched users:", allUsers);
//     res.json(allUsers);
//   }
//   catch(err) {
//     console.error("Error fetching profile:", err);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

profileRouter.post("/profile/edit", userAuth, async (req, res, next) => {
  try {
    validateProfileEdit(req.body);
    let loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
  
    await loggedInUser.save();
    res.json({
      message: loggedInUser.firstName + "profile is updated",
      user: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("error at updating profle" + error.message);
  }
});

module.exports = profileRouter;
