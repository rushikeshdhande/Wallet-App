import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import job from "./config/cron.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Body parser
app.use(express.json());

// Rate limiter (auto-disable when Redis not configured)
app.use(rateLimiter);

// Cron runs only in production
if (process.env.NODE_ENV === "production") {
  job.start();
}

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/api/transactions", transactionsRoute);

// Start server after DB init
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at: http://localhost:${PORT}`);
      console.log("Database initialized successfully");
    });
  })
  .catch((err) => console.error("Failed to start server:", err));
