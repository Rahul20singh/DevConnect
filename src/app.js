const express = require("express");

const app = express();

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello, World!");
})

app.get("/user", (req, res) => {
  res.json({ name: "John Doe", age: 30 });  
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
