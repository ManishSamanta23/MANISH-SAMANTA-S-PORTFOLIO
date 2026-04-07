import { Router } from "express";
import { Portfolio } from "../models/Portfolio.js";
import { defaultPortfolio } from "../seed/defaultPortfolio.js";

const router = Router();

router.get("/", async (req, res) => {
  if (!req.app.locals.dbConnected) {
    return res.json(req.app.locals.memoryStore.portfolio || defaultPortfolio);
  }

  try {
    const data = await Portfolio.findOne().lean();
    return res.json(data || defaultPortfolio);
  } catch (_error) {
    return res.json(defaultPortfolio);
  }
});

export default router;
