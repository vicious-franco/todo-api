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
    if (newTodo.rows.length === 0) {
      throw new Error("failed to create new todo");
    }
    return res.status(200).json({ success: true, data: newTodo.rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export const getTodos = async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todos ORDER BY title ASC");
    if (allTodos.rows[0].length === 0) {
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

export const updateTodo = async (req, res) => {
  const { title, description, completed, created_at } = req.body;

  const { id } = req.id;

  const fields = [];
  const values = [];
  let index = 0;

  if (title != undefined) {
    fields.push(`title=$${++index}`);
    values.push(title);
  }
  if (description != undefined) {
    fields.push(`description=$${++index}`);
    values.push(description);
  }
  if (completed != undefined) {
    fields.push(`completed=$${++index}`);
    values.push(completed);
  }
  if (created_at != undefined) {
    fields.push(`created_at=$${++index}`);
    values.push(created_at);
  }

  try {
    const updatedTodo = await pool.query(
      `UPDATE todos SET ${fields.join(
        ", "
      )} WHERE todo_id=$${++index} RETURNING *`,
      [...values, id]
    );
    if (updatedTodo.rows.length === 0) {
      throw new Error(`Failed to update Todo with ID ${id}`);
    }
    return res.status(200).json({
      success: true,
      data: updatedTodo.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTodo = async (req, res) => {
  const { id } = req.id;

  try {
    const removeTodo = await pool.query(
      `DELETE FROM todos WHERE todo_id=$1 RETURNING *`,
      [id]
    );
    if (removeTodo.rows.length === 0) {
      throw new Error(`Failed to delete todo with ID ${id}`);
    }
    return res.status(204).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const singleTodo = async (req, res) => {
  const { id } = req.id;
  console.log(id);

  try {
    const todo = await pool.query(`SELECT * FROM todos WHERE todo_id=$1 `, [
      id,
    ]);
    if (todo.rows.length === 0) {
      throw new Error(`Failed to fetch todo with ID ${id}`);
    }
    res.status(200).json({ success: true, data: todo.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
