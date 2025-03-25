// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const app = require('./src/app');
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
