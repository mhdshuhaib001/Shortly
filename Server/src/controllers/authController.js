import jwt from "jsonwebtoken";
import User from "../models/User.js";
import axios from "axios";

const authController = {
  googleAuth: async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }

      let userData = null;
      // Google auth implementation to fetch user information using the Google access token
      try {
        const userInfoResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        userData = {
          googleId: userInfoResponse.data.sub,
          email: userInfoResponse.data.email,
          name: userInfoResponse.data.name,
          picture: userInfoResponse.data.picture
        };
      } catch (error) {
        console.error(
          "Failed to fetch user info:",
          error.response?.data || error.message
        );
        return res.status(401).json({ error: "Invalid access token" });
      }

      if (!userData || !userData.googleId) {
        return res
          .status(400)
          .json({ error: "Failed to get user information from Google" });
      }

      let user = await User.findOne({ googleId: userData.googleId });
      if (!user) {
        user = await User.create(userData);
      }

      const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h"
      });

      res.json({
        token: jwtToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture
        }
      });
    } catch (error) {
      console.error("Google Auth Error:", error);
      res.status(500).json({
        error: "Authentication failed",
        details: error.message
      });
    }
  },

  verifyToken: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture
      });
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  }
};

export default authController;
