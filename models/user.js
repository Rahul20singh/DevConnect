const mongoose = require("mongoose");
const validator = require("validator")


const bcrypt = require("bcrypt");
const secret_key = require("../utils/constants")
const jwt = require("jsonwebtoken")

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



userSchema.methods.validatePassword = async function (password) {
  let isPasswordCorrect = await bcrypt.compare(password, this.password);
  console.log("inside hash password method", this.password);
  if (isPasswordCorrect) {
    return true;
  }
  return false;
};

userSchema.methods.generateToken = async function(){

  let token = await jwt.sign({_id: this._id}, secret_key, {expiresIn: "7d"})
  console.log("token::::::::::::", token)
  return token

}


const User = mongoose.model("user", userSchema);

module.exports = User;

