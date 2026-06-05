import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { generateToken } from "../lib/utils/index.js";
import { User } from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const formatUserResponse = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  profilePic: user.profilePic,
  authProvider: user.authProvider,
});
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
      res.status(201).json(formatUserResponse(newUser));
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

    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google sign-in. Please continue with Google.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);
    res.status(200).json(formatUserResponse(user));
  } catch (err) {
    console.log("Error in login controller", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const googleAuth = async (req, res) => {
  const { token } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ message: "Google token is required" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google OAuth is not configured" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!googleId || !email) {
      return res.status(400).json({ message: "Invalid Google account data" });
    }

    let user = await User.findOne({ googleId });

    if (!user) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        if (existingUser.password && !existingUser.googleId) {
          existingUser.googleId = googleId;
          existingUser.authProvider = "google";
          if (!existingUser.profilePic && picture) {
            existingUser.profilePic = picture;
          }
          await existingUser.save();
          user = existingUser;
        } else {
          return res.status(400).json({
            message: "An account with this email already exists",
          });
        }
      } else {
        user = await User.create({
          fullName: name || email.split("@")[0],
          email,
          googleId,
          authProvider: "google",
          profilePic: picture,
        });
      }
    }

    generateToken(user._id, res);
    res.status(200).json(formatUserResponse(user));
  } catch (err) {
    console.log("Error in googleAuth controller", err);
    res.status(401).json({ message: "Google authentication failed" });
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
    const { profilePic, fullName } = req.body; 
    const userId = req.user._id; 

    if (!profilePic && !fullName) {
      return res.status(400).json({ message: "Data to update is required" });
    }

    let updateData = {};
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      updateData.profilePic = uploadResponse.secure_url;
    }
    if (fullName) {
      updateData.fullName = fullName;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
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
