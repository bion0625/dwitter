import rateLimit from "express-rate-limit";
import { config } from "../config.js";

export const limit = rateLimit({
    windowMs: config.rateLimit.windowMs,
    limit: config.rateLimit.limit,
    // keyGenerator: (req, res) => 'dwitter',
});