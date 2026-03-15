import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

export const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});
