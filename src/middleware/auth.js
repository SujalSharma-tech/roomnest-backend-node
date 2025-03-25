import jwt from "jsonwebtoken";
import { secretKey } from "../config/jwt.js";
import { promisify } from "util";

const authenticate = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, secretKey);
    req.user = decoded.data;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default authenticate;
