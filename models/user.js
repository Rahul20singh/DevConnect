const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 50,
      // required: true
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Invalid gender type");
        }
      },
    },
    city: {
      type: String,
      // required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minLength: 5,
      maxLength: 50,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Invalid email format");
        }
      }
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    about: {
      type: String,
      default: "Hey there! I am using DevTinder",
    },
    skills: {
      type: [String],
      default: ["JavaScript", "React", "Node.js"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
