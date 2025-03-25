import express from "express";
import UserController from "../controllers/userController.js";
import authenticate from "../middleware/auth.js";

const router = express.Router();
const userController = new UserController();

// User registration
router.post("/register", userController.register);

// User login
router.post("/login", userController.login);

// Get user profile
router.get("/getprofile", authenticate, userController.getMyProfile);

// Update user profile
router.put("/updateprofile", authenticate, userController.updateProfile);

// Update user password
router.put("/password", authenticate, userController.updatePassword);

// User logout
router.post("/logout", authenticate, userController.logout);

export default router;
