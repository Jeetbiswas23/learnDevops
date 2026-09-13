import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const mongoClient = process.env.MONGODB_URI
  ? new MongoClient(process.env.MONGODB_URI)
  : null;
const databaseName = process.env.MONGODB_DATABASE || "task-api";

export const connectDatabase = async () => {
  if (mongoClient) {
    await mongoClient.connect();
    console.log("Connected to MongoDB");
  }
};

export const getTasksCollection = () =>
  mongoClient?.db(databaseName).collection("tasks") || null;
