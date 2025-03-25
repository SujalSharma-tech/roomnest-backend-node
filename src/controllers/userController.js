import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateToken, decodeToken } from "../config/jwt.js";

class UserController {
  async register(req, res) {
    const { first_name, last_name, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        first_name,
        last_name,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      const token = generateToken(newUser._id, email);
       res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        SameSite: "None",
      });

      return res.status(201).json({
        success: true,
        message: "User Successfully Registered",
        user: { id: newUser._id, first_name, last_name, email },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }

      const token = generateToken(user._id, email);
       res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        SameSite: "None",
      });

      return res.status(200).json({
        success: true,
        message: "Login Successful",
        user: {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async getMyProfile(req, res) {
    const token = req.cookies.token;

    try {
      const decoded = decodeToken(token);
      if (!decoded) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async updateProfile(req, res) {
    const token = req.cookies.token;

    try {
      const decoded = decodeToken(token);
      if (!decoded) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const updates = req.body;
      const user = await User.findByIdAndUpdate(decoded.id, updates, {
        new: true,
        runValidators: true,
      }).select("-password");
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  async logout(req, res) {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  }

  async updatePassword(req, res) {
    const token = req.cookies.token;
    const { currpassword, newpassword } = req.body;

    try {
      const decoded = decodeToken(token);
      if (!decoded) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currpassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      user.password = hashedPassword;
      await user.save();

      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  }

  async getNearestBusStand(req, res) {
    try {
      const location = req.query.location || "31.230463,75.778597"; // Default from PHP code
      const radius = req.query.radius || 5000; // Default 5000 meters
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;

      const baseUrl =
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
      const url = `${baseUrl}?location=${location}&radius=${radius}&type=transit_station&key=${apiKey}`;

      const response = await axios.get(url);
      return res.status(200).json(response.data);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch bus stand information",
        error: error.message,
      });
    }
  }
}

export default UserController;
