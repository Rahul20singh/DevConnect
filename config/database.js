const mongoose = require("mongoose");

async function connectDB() {

    try{
        await mongoose.connect("mongodb+srv://RahulSingh:Rahul123@namasterahul.eah4f.mongodb.net/devConnect")
    }
    catch(err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit the process with failure
    }       
}

module.exports = connectDB;

