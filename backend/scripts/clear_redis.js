import mongoose from "mongoose";
import dotenv from "dotenv";
import { Redis } from "ioredis";

dotenv.config();

const clearRedis = async () => {
    try {
        const redis = new Redis(process.env.REDIS_URL);
        console.log("Connected to Redis");

        const keys = await redis.keys('*');
        if (keys.length > 0) {
            await redis.del(...keys);
            console.log(`Cleared ${keys.length} keys from Redis.`);
        } else {
            console.log("Redis is already empty.");
        }
        
        process.exit(0);
    } catch (error) {
        console.error("Redis clear failed:", error);
        process.exit(1);
    }
};

clearRedis();
