import { config } from "dotenv";
config();
import express from "express";
import TodoRouter from "./routes/routes.js";

const app = express();

// middleware
app.use(express.json()); //to parsing req.body
app.use("/api/v2", TodoRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`connected to http://localhost:${PORT}`));
