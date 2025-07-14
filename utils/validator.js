const validator = require("validator");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");

function validateData(userData) {
  const { firstName, lastName, email, age, password, photoUrl } = userData;
  console.log("Validating user data:", userData);
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  } else if (email && !validator.isEmail(email)) {
    throw new Error("Invalid email format");
  } else if (age && (age < 18 || age > 50)) {
    throw new Error("Age must be between 18 and 50");
  } else if (
    !password ||
    password.length < 6 ||
    validator.isStrongPassword(password)
  ) {
    console.log("Password is not strong");
    throw new Error("Password must be at least 6 characters long");
  }
}

function validateProfileEdit(data) {
  let requiredFields = ["firstName", "lastName", "age", "photoUrl", "gender", "city", "skills", "about"];
  let validField = Object.keys(data).every((key) =>
    requiredFields.includes(key)
  );
  if (!validField) {
    throw new Error("edit is not allowed on given fields");
  }

  // if (data.firstName || !data.lastName) {
  //   throw new Error("First name and last name are required");
  // } else if (data.age && (data.age < 18 || data.age > 50)) {
  //   throw new Error("Age must be between 18 and 50");
  // }
}

async function validateAndSaveRequestFields(data) {
  let validStatus = ["intersted", "ignored"];
  if (!validStatus.includes(data.status)) {
    throw new Error(`${data.status} is not a valid status`);
  }

  console.log("dataa", data.toUserId, data.fromUserId);
  if (data.toUserId.equals(data.fromUserId)) {
    throw new Error("request cant be sent to same user");
  }

  let fromUser = await User.findById(data.fromUserId);
  console.log("fromUserrrrrr", fromUser);
  if (!fromUser) {
    throw new Error("User is not present");
  }

  let query = {
    $or: [
      {
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
      },
      {
        fromUserId: data.toUserId,
        toUserId: data.fromUserId,
      },
    ],
  };

  let isRequestPresent = await ConnectionRequestModel.findOne(query);
  console.log("isRequestPresent", isRequestPresent);
  if (isRequestPresent) {
    throw new Error("request already present");
  }

  let newConnectionRequest = await new ConnectionRequestModel(data);
  newConnectionRequest.save();
}

// let query = {
//   status: "intersted",
//   $or: [
//     {
//       toUserId: loggedInUser._id,
//     },
//     {
//       fromUserId: loggedInUser._id,
//     },
//   ],
// };

module.exports = {
  validateData,
  validateProfileEdit,
  validateAndSaveRequestFields,
};
