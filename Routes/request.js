const express = require("express")

const requestRouter = express.Router()
const User = require("../models/user")
const userAuth = require("../middlewares/auth")

requestRouter.get("/connection", (req, res, next)=>{
    res.status(400).send("")
})

module.exports = requestRouter;

