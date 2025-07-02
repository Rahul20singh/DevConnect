const express = require("express");

const requestRouter = express.Router();
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const { validateAndSaveRequestFields } = require("../utils/validator");

requestRouter.post(
  "/request/send/:status/:fromUserId",
  userAuth,
  async (req, res, next) => {
    let status = req.params.status;
    let toUserId = req.user._id;
    let fromUserId = req.params.fromUserId;
    try {
      await validateAndSaveRequestFields({ status, toUserId, fromUserId });
      res.send("Connection request sent");
    } catch (error) {
      res.status(400).send("Eror::::::" + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res, next) => {

    let status = req.params.status;
    let requestId = req.params.requestId;
    let fromUserId = req.user._id;
    try {
      let allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error(status + " is not a valid status");
      }

      let isRequestPresent = await ConnectionRequestModel.findOne({
        _id: requestId,
        fromUserId: fromUserId,
        "status": "intersted"
      });

      if (!isRequestPresent) {
        throw new Error("connection is not found");
      }
      isRequestPresent['status'] = status;
      let updatedRequest = await isRequestPresent.save()
      res.json({"message": `request is updated to status ${status}`, "result": updatedRequest})
    } catch (error) {
      res.status(400).send("Eror::::::" + error.message);
    }
  }
);

module.exports = requestRouter;
