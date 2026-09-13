import { ObjectId } from "mongodb";
import {
  createTask,
  deleteTaskById,
  findAllTasks,
  findTaskById,
  updateTaskById
} from "../models/taskModel.js";
import { getTasksCollection } from "../config/database.js";

const parseTaskId = (id, res) => {
  if (!ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid task id" });
    return null;
  }

  return new ObjectId(id);
};

const requireTasksCollection = (res) => {
  if (!getTasksCollection()) {
    res.status(503).json({ error: "MongoDB is not configured" });
    return null;
  }

  return true;
};

export const create = async (req, res) => {
  if (!requireTasksCollection(res)) return;

  const { title, completed = false } = req.body;
  if (typeof title !== "string" || !title.trim()) {
    res.status(400).json({ error: "title is required" });
    return;
  }
  if (typeof completed !== "boolean") {
    res.status(400).json({ error: "completed must be a boolean" });
    return;
  }

  const now = new Date();
  const task = { title: title.trim(), completed, createdAt: now, updatedAt: now };
  res.status(201).json(await createTask(task));
};

export const getAll = async (req, res) => {
  if (!requireTasksCollection(res)) return;
  res.json(await findAllTasks());
};

export const getOne = async (req, res) => {
  const taskId = parseTaskId(req.params.id, res);
  if (!taskId || !requireTasksCollection(res)) return;

  const task = await findTaskById(taskId);
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.json(task);
};

export const update = async (req, res) => {
  const taskId = parseTaskId(req.params.id, res);
  if (!taskId || !requireTasksCollection(res)) return;

  const updates = {};
  if (req.body.title !== undefined) {
    if (typeof req.body.title !== "string" || !req.body.title.trim()) {
      res.status(400).json({ error: "title must be a non-empty string" });
      return;
    }
    updates.title = req.body.title.trim();
  }
  if (req.body.completed !== undefined) {
    if (typeof req.body.completed !== "boolean") {
      res.status(400).json({ error: "completed must be a boolean" });
      return;
    }
    updates.completed = req.body.completed;
  }
  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "Provide title or completed to update" });
    return;
  }

  updates.updatedAt = new Date();
  const task = await updateTaskById(taskId, updates);
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.json(task);
};

export const remove = async (req, res) => {
  const taskId = parseTaskId(req.params.id, res);
  if (!taskId || !requireTasksCollection(res)) return;

  const result = await deleteTaskById(taskId);
  if (result.deletedCount === 0) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  res.status(204).send();
};
