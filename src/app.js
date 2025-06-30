const express = require("express");

const app = express();
const {userAuth} = require("../middlewares/auth");

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello, World!");
})


app.get("/user", userAuth , (req, res, next) => {
  console.log("This is a middleware function");   
  res.json({ name: "Sara Doe", age: 30 });  
});

app.get("/user/data", (req, res) => {
  res.json({ name: "John Doe", age: 30 });  
})

//query paramters
app.get("/test", (req, res) => {

  res.json({ name: "mike Doe", age: 30, id: req.query });
})

//route paramaters

app.get("/test/:id/:name", (req, res) => {
  res.json({ name: req.params.name, age: 30, id: req.params.id });
})


app.post("/user", (req, res) => {
  // const user = req.body;  
  res.json({ name: "Ryan Doe", age: 30 })
})


app.delete("/user", (req, res) => {
  // const user = req.body;  
  res.json({ name: "Dan Doe", age: 30 })
})

app.put("/user", (req, res) => {
  // const user = req.body; 
  
  res.json({ name: "Jane Doe", age: 30 })
})

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
