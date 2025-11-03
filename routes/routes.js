import express from "express";
import {
  createTodo,
  getTodos,
  updatetodo,
} from "../controllers/todo_controllers.js";

const TodoRouter = express.Router();
TodoRouter.get("/fetch/todos", getTodos);
TodoRouter.post("/create/todo", createTodo);
TodoRouter.patch("/update/todo/:id", updatetodo);

export default TodoRouter;
