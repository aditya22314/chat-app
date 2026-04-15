import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils/index.js";
import { User } from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
export const Signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  //Best practice give try catch block everytime
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10); // This prevents rainbow attack
    const hashedPassword = await bcrypt.hash(password, salt); // Bcrypt.hash takes two arguments password and salt

    const newUser = new User({
      /// Create a user and give hashed password
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      //generate jwt token here ..
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    console.log("Error in signup controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.log("Error in login controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      // Here i cleared the cookie using maxAge:0 and empty string
      maxAge: 0,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log("Error in logout controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body; //Taking the profile pic(Updated
    const userId = req.user._id; //Taking the user id from the protect route
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true },
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Sever error" });
  }
};
