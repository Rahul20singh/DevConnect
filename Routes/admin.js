const express = require("express");

const admineRouter = express.Router();
const User = require("../models/user");

admineRouter.patch("/user", async (req, res) => {
  let email = req.body.email;
  let updatedData = req.body;
  console.log("email:", email);
  try {
    let updatedUser = await User.updateOne({ email: email }, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure that the update respects the schema validation
    });
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: error.message });
  }
});

admineRouter.delete("/user", async (req, res) => {
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
});

admineRouter.get("/user", async (req, res) => {
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


module.exports = admineRouter;