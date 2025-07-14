const express = require("express");

const userRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    let toUser = req.user;

    let allRequest = await ConnectionRequestModel.find({
      fromUserId: toUser._id,
      status: "intersted",
    })
      .populate("toUserId", ["firstName", "lastName", "about", "age", "gender"])
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "about",
        "age",
        "gender",
      ]);

    res.json({ message: "find all the request", result: allRequest });
  } catch (error) {
    res.status(400).send("error:: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    let loggedInUserId = req.user._id;
    let allConnections = await ConnectionRequestModel.find({
      status: "accepted",
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    })
      .populate("fromUserId", "firstName lastName about age gender")
      .populate("toUserId", [
        "firstName",
        "lastName",
        "about",
        "age",
        "gender",
      ]);

    console.log("allConnections::::::::::::::::::::::", allConnections);
    let result = allConnections.map((each) => {
      if (each.fromUserId._id.toString() === loggedInUserId.toString()) {
        return each.toUserId;
      }
      return each.fromUserId;
    });
    res.json({ message: "find all connections", data: result });
  } catch (error) {
    res.status(400).send("error:::::::: " + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    let loggedInUser = req.user;

    let limit = parseInt(req.query.limit) || 2;
    limit = limit > 50 ? 50 : limit;
    let page = parseInt(req.query.page) || 1;
    let skip = (page - 1) * limit;

    let allConnections = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    console.log("allConnections" + allConnections);
    let getUniqueConnectionIds = new Set();
    allConnections.forEach((each) => {
      getUniqueConnectionIds.add(each.toUserId.toString());
      getUniqueConnectionIds.add(each.fromUserId.toString());
    });
    console.log("getUniqueConnectionIds::::::::::::: ", getUniqueConnectionIds);

    let allUsers = await User.find({
      _id: {
        $nin: Array.from(getUniqueConnectionIds),
      },
    }).select("firstName lastName, photoUrl age gender about");
    // .skip(skip)
    // .limit(limit);

    console.log("allUsers:::::::::::::: ", allUsers);
    res.json({ message: "all connection found", data: allUsers });
  } catch (error) {
    res.status(400).send("error::::::::: ", error);
  }
});
module.exports = userRouter;
