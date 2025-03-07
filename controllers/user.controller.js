import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const cookieOptions = {
  httpOnly: true, // Prevents XSS attacks
  secure: process.env.NODE_ENV === "production", // Use HTTPS in production
  sameSite: "strict", // Prevents CSRF attacks
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    console.log(fullName, email, password);
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fileds are required",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email laready exists....",
      });
    }
    console.log("Before creating user");

    const user = await User.create({
      fullName,
      email,
      password,
      avatar: {
        public_id: email,
        secure_url: "url",
      },
    });
    console.log("User created:", user); // Debugging log
    // TODO:

    // await user.save();

    user.password = undefined;

    const token = await user.generateJWTToken();

    res.cookie("token", token, cookieOptions);
    return res.status(201).json({
      success: true,
      message: "User Created successfully!!!",
      user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fileds are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password does not match",
      });
    }
    const token = await user.generateJWTToken();
    user.password = undefined;
console.log(token,"LLLLl")
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      message: "User login successfully!!!",
      user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
const logout = async (req, res) => {
  try {
    res.cookie("token", null, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });
    return res.status(200).json({
      success: true,
      message: "User logout successfully!!!",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }
    return res.status(200).json({
      success: true,
      message: "This is your profile detils",
      user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export { register, login, logout, getProfile };
