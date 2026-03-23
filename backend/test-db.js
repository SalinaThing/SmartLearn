import mongoose from 'mongoose';
import 'dotenv/config';

const dbUrl = process.env.MONGO_URI;
console.log("Testing connection to:", dbUrl.split('@')[1] || dbUrl);

mongoose.connect(dbUrl, {
    serverSelectionTimeoutMS: 10000,
})
.then(() => {
    console.log("SUCCESS: Connected to MongoDB");
    process.exit(0);
})
.catch((err) => {
    console.error("FAILURE: Could not connect to MongoDB", err.message);
    process.exit(1);
});
