const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoConnectionString =
      process.env.MONGO_URI ||
      `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(mongoConnectionString);

    console.log("✅ MongoDB connected");
    console.log(`🧩 Connected to DB: ${process.env.MONGO_DB}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
