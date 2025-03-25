import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const secretKey = process.env.JWT_SECRET; // Use environment variable or default key

export const generateToken = (userId, email) => {
  const payload = {
    id: userId,
    email: email,
  };
  const options = {
    expiresIn: "1d",

    // Token expiration time
  };
  return jwt.sign(payload, secretKey, options);
};

export const decodeToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
};
