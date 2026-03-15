import mongoose from "mongoose";

export const connectDB = async () => {
  const dbUrl = process.env.MONGO_URI || '';

  try {
    const data = await mongoose.connect(dbUrl);

    console.log(`Database connected with ${data.connection.host}`);

  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);

    // Retry connection after 5 seconds if it fails
    setTimeout(connectDB, 5000);
  }
};
