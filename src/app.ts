import express, { Request, Response, NextFunction } from "express";

import transactionRoutes from "./routes/transaction";
import analyticsRoutes from "./routes/analytics";

const app = express();


app.use(express.json());

app.get("/status", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// Routes
app.use("/v1", transactionRoutes);
app.use("/v1/analytics", analyticsRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(
  (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
);

export default app;