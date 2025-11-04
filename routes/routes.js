import express from "express";
import {
  createTodo,
  deleteTodo,
  getTodos,
  singleTodo,
  updateTodo,
} from "../controllers/todo_controllers.js";
import { verifyid } from "../middleware/verifyid.js";

const TodoRouter = express.Router();
TodoRouter.get("/fetch/todos", getTodos).get(
  "/fetch/single/todo/:id",
  verifyid,
  singleTodo
);
TodoRouter.post("/create/todo", createTodo);
TodoRouter.patch("/update/todo/:id", verifyid, updateTodo);
TodoRouter.delete("/remove/todo/:id", verifyid, deleteTodo);

export default TodoRouter;
