const express = require("express");

const app = express();
const bcrypt = require("bcrypt")
const { userAuth } = require("../middlewares/auth");
const connectDB = require("../config/database");
const User = require("../models/user");
const cookieParser = require("cookie-parser")
const {validateData} = require("../utils/validator");
const authRouter = require("../Routes/auth")
const profileRouter = require("../Routes/profile")
const adminRouter = require("../Routes/admin")
const requestRouter = require("../Routes/request")
const userRouterouter = require("../Routes/user")

app.use(express.json());
app.use(cookieParser())
app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", adminRouter)
app.use("/", requestRouter)
app.use("/", userRouterouter)



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
