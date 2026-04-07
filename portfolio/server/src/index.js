import "dotenv/config";
import cors from "cors";
import express from "express";

import { connectDB } from "./config/db.js";
import { Portfolio } from "./models/Portfolio.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { defaultPortfolio } from "./seed/defaultPortfolio.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
  })
);
app.use(express.json());

app.locals.dbConnected = false;
app.locals.memoryStore = {
  portfolio: defaultPortfolio,
  contactMessages: []
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/portfolio", portfolioRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/chat", chatRoutes);

const start = async () => {
  try {
    await connectDB();
    app.locals.dbConnected = true;

    const docCount = await Portfolio.countDocuments();
    if (docCount === 0) {
      await Portfolio.create(defaultPortfolio);
      console.log("Seeded default portfolio document");
    }
  } catch (error) {
    console.warn("MongoDB unavailable, using in-memory fallback:", error.message);
  }

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

start();
