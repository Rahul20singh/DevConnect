const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
     fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        "ref": "user"
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
         ref: "user"
    },
    status: {
        type: String,
        required: true,
        enum:{
            values: ["intersted", "ignored", "accepted", "rejected"],
            message: `{VALUE} is not a valid status`
        }

    }
}, {timestamps: true})

connectionRequestSchema.pre("save", function(next){
    console.log("this doc:::::::", this)
    next()
})

const ConnectionRequestModel = mongoose.model("request", connectionRequestSchema)

module.exports = ConnectionRequestModel;