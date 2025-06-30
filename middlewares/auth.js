let userAuth = (req, res, next) => {
    let token = "1233"
    if(token !== "12333") {
        console.log("User is not authenticated");
        return res.status(401).json({ error: "Unauthorized" }); 
    }
  console.log("User is authenticated");
  next();
};

module.exports = {
    userAuth,
}
