
const jwt = require("jsonwebtoken")
let secret_key = require("../utils/constants")
const User = require("../models/user")
async function userAuth(req, res, next){

    let {token} = req.cookies
    console.log("token:::::::;", token)

    try {
        let verifyToken = await jwt.verify(token, secret_key)
   let {_id} = verifyToken;
   let user = await User.findById(_id)

   if(!user){
    throw new Error("token is not correct")
   }

   req.user = user;
   next()
   console.log("userrrrrrrr", user)
    } catch (error) {
        res.status(400).send("user not found")
        
    }

}

module.exports = {
    userAuth
}