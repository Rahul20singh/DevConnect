const validator = require("validator");
function validateData(userData) {
  const { firstName, lastName, email, age, password } = userData;
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

module.exports = validateData;
