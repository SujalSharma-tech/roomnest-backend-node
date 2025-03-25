import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbUrl = process.env.DATABASE_URL;

    await mongoose.connect(dbUrl);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
