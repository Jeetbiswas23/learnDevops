import { getTasksCollection } from "../config/database.js";

const getCollection = () => getTasksCollection();

export const createTask = async (task) => {
  const collection = getCollection();
  const result = await collection.insertOne(task);
  return { ...task, _id: result.insertedId };
};

export const findAllTasks = async () => {
  const collection = getCollection();
  return collection.find().sort({ createdAt: -1 }).toArray();
};

export const findTaskById = async (taskId) => {
  const collection = getCollection();
  return collection.findOne({ _id: taskId });
};

export const updateTaskById = async (taskId, updates) => {
  const collection = getCollection();
  return collection.findOneAndUpdate(
    { _id: taskId },
    { $set: updates },
    { returnDocument: "after" }
  );
};

export const deleteTaskById = async (taskId) => {
  const collection = getCollection();
  return collection.deleteOne({ _id: taskId });
};
