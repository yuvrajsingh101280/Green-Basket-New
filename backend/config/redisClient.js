// config/redisClient.js
import { Redis } from '@upstash/redis';
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

const redisClient = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
});





export default redisClient;
