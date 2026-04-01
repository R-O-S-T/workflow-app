import express from "express";
import { workflowsRouter } from "./routes/workflows.js";
import { executionsRouter } from "./routes/executions.js";
import { registryRouter } from "./routes/registry.js";
import { initDb } from "./db/client.js";

const app = express();
app.use(express.json());

app.use("/api/workflows", workflowsRouter);
app.use("/api", executionsRouter);
app.use("/api/registry", registryRouter);

const PORT = 3001;

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to initialize database:", err);
  process.exit(1);
});
