import { config } from "dotenv";
import pool from "../configs/connect_db.js";

export const createTodo = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(404)
      .json({ success: false, message: "fill all required inputs" });
  }
  try {
    const newTodo = await pool.query(
      `INSERT INTO todos (title,description) VALUES ($1,$2) RETURNING *`,
      [title, description]
    );
    console.log(newTodo.rows[0]);
    if (!newTodo.rows[0].length === 0) {
      throw new Error("failed to create new todo");
    }
    return res.status(200).json({ success: true, data: newTodo.rows[0] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const getTodos = async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todos ORDER BY title ASC");
    if (!allTodos) {
      return res.status(404).json({
        success: false,
        message: "empty todos",
      });
    }
    return res
      .status(200)
      .json({ success: true, counts: allTodos.rowCount, data: allTodos.rows });
  } catch (error) {
    console.log("failed to fetch todos: " + error.message);
    return res.status(500).json({ success: false, message: error });
  }
};

export const updatetodo = async (req, res) => {
  const { title, description, completed, created_at } = req.body;

  const { id } = req.params;
  console.log(id);
  const fields = [];
  const values = [];
  let index = 1;

  if (title != undefined) {
    fields.push(`title=$${index++}`);
    values.push(title);
    console.log("title: " + index);
  }
  if (description != undefined) {
    fields.push(`description=$${index++}`);
    values.push(description);
    console.log("description: " + index);
  }
  if (completed != undefined) {
    fields.push(`completed=$${index++}`);
    values.push(completed);
    console.log("completed: " + index);
  }
  if (created_at != undefined) {
    fields.push(`created_at=$${index++}`);
    values.push(created_at);
    console.log("created_at: " + index);
  }

  try {
    const returned = await pool.query(
      `UPDATE todos SET ${fields.join(
        ", "
      )} WHERE todo_id=$${index} RETURNING *`,

      [...values, id]
    );
    if (returned.rows.length != 0) {
      console.log(returned);
    }
  } catch (error) {
    console.error("failed to update data at: " + error);
  }
};
