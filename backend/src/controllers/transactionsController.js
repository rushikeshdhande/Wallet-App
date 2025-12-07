import { sql } from "../config/db.js";

// GET all transactions for a user
export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;

    const transactions = await sql`
      SELECT * FROM transactions
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    res.status(200).json(transactions);

  } catch (error) {
    console.error("Error getting transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// CREATE transaction
export async function createTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || amount === undefined || !category || !user_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;

    res.status(201).json(result[0]);

  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE transaction
export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully" });

  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// SUMMARY: balance, income, expenses
export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    const balance = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance
      FROM transactions WHERE user_id = ${userId};
    `;

    const income = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income
      FROM transactions
      WHERE user_id = ${userId} AND amount > 0;
    `;

    const expenses = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expenses
      FROM transactions
      WHERE user_id = ${userId} AND amount < 0;
    `;

    res.status(200).json({
      balance: balance[0].balance,
      income: income[0].income,
      expenses: expenses[0].expenses,
    });

  } catch (error) {
    console.error("Error getting summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
