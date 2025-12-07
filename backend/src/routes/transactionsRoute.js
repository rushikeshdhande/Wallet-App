import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactionsByUserId,
  getSummaryByUserId,
} from "../controllers/transactionsController.js";

const router = express.Router();

// Default GET route (fix)
router.get("/", (req, res) => {
  res.json({ message: "Transactions API is working!" });
});

// Summary route
router.get("/summary/:userId", getSummaryByUserId);

// Create transaction
router.post("/", createTransaction);

// Delete transaction
router.delete("/:id", deleteTransaction);

// Get transactions by userId
router.get("/:userId", getTransactionsByUserId);

export default router;
