import mongoose from "mongoose";

export const connectDB = async () => {
  const dbUrl = process.env.MONGO_URI || '';

  try {
    mongoose.set('debug', true);
    console.log("Connecting to MongoDB with URL:", dbUrl.split('@')[1] || dbUrl); // Log base URL for privacy
    const data = await mongoose.connect(dbUrl, {
        serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    });

    console.log(`Database connected with ${data.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    // console.log(error); // Detailed error
    setTimeout(connectDB, 5000);
  }
};
