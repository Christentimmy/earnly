import express, { Express } from "express";
import morgan from "morgan";
import config from "./config/config";
const app: Express = express();
import { connectToDatabase } from "./config/database";

const port = config.port;

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

connectToDatabase();

app.listen(port, async () => {
  console.log(`⚡️Server is running on port: ${port}`);
});
