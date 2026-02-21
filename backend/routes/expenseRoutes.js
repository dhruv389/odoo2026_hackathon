import express from "express";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  getExpensesByVehicle,
} from "../controllers/expenseController.js";

const router = express.Router();

router.get("/summary", getExpenseSummary);
router.get("/by-vehicle", getExpensesByVehicle);
router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/:id", getExpenseById);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
