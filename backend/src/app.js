import cors from "cors";
import express from "express";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "backend",
    message: "MERN DevOps backend is running"
  });
});

app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello from the Express backend 🚀"
  });
});

app.use("/api/tasks", taskRoutes);

export default app;
