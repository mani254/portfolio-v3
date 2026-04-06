import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRoute from "./routes/testRoute";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/test", testRoute);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the Portfolio Backend API server!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
