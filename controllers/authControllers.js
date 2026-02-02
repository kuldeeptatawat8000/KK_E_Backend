const authModel = require("../models/usersModel");
const { hashPassword, comparePassword } = require("../helpers/authHelpers");
const { jwtToken } = require("../helpers/jwtHelpers");

//Register User Controllers
module.exports.authRegister = async (req, res) => {
  try {
    const { name, email, password, phone, question, address } = req.body;

    // 1️⃣ Validate input
    if (!name || !email || !password || !phone || !question || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2️⃣ Check existing user
    const existingUser = await authModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already registered. Please login.",
      });
    }

    // 3️⃣ Hash password (await REQUIRED)
    const hashedPassword = await hashPassword(password);

    // 4️⃣ Create user
    const User = await authModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      question,
      address,
    });

    //Token Generate
    const Token = jwtToken(User);

    res.cookie("token", Token, {
      httpOnly: true, // 🔐 XSS protection
      secure: false, // true in production (HTTPS)
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 5️⃣ Send response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        Id: User._id,
        Name: User.name,
        Email: User.email,
        Phone: User.phone,
        Address: User.address,
        Question: User.question,
        role: User.role,
      },
      token: Token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//Login User Controllers
module.exports.authLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2️⃣ Check existing user
    const existingUser = await authModel.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Email and Password",
      });
    }

    // 3️⃣ Compare password (await REQUIRED)
    const ComparedPassword = await comparePassword(
      password,
      existingUser.password
    );
    if (!ComparedPassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Email and Password",
      });
    }

    //Token Generate
    const Token = jwtToken(existingUser);

    res.cookie("token", Token, {
      httpOnly: true, // 🔐 XSS protection
      secure: false, // true in production (HTTPS)
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // 5️⃣ Send response

    res.status(201).json({
      success: true,
      message: "User LoginedIn successfully",
      data: {
        Id: existingUser._id,
        Name: existingUser.name,
        Phone: existingUser.phone,
        Email: existingUser.email,
        Address: existingUser.address,
        Question: existingUser.question,
        role: existingUser.role,
      },
      token: Token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//Forgot Password User
module.exports.forgotPassword = async (req, res) => {
  try {
    const { email, newPassword, question } = req.body;

    // 1️⃣ Validation
    if (!email || !newPassword || !question) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2️⃣ Check user
    const user = await authModel.findOne({ email, question });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or security answer",
      });
    }

    // 3️⃣ Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // 4️⃣ Update password
    await authModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    // 5️⃣ Success response
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

//Test User

module.exports.authTest = (req, res) => {
  res.send("Text Procted");
};
