import dotenv from "dotenv";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  const startServer = async () => {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  };

  startServer().catch((error) => {
    console.error("Failed to start backend:", error.message);
    process.exitCode = 1;
  });
}

export default app;