const jwt = require("jsonwebtoken");

module.exports.jwtToken = (user) => {
  try {
    return jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET
    );
  } catch (error) {
    console.error("JWT Error:", error.message);
    throw error;
  }
};
