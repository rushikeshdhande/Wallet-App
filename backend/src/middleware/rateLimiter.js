import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    if (!ratelimit) return next(); // Redis not configured → skip

    const { success } = await ratelimit.limit("rate-limit");

    if (!success) {
      return res.status(429).json({ message: "Too many requests" });
    }

    next();
  } catch (error) {
    console.log("Rate limit error:", error);
    next(); // Do NOT block requests if rate limit fails
  }
};

export default rateLimiter;
