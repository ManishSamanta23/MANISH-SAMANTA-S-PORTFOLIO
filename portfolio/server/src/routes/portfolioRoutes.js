import { Router } from "express";
import { Portfolio } from "../models/Portfolio.js";
import { defaultPortfolio } from "../seed/defaultPortfolio.js";

const router = Router();

const removeHiddenProjects = (portfolio) => {
  if (!portfolio?.projects) {
    return portfolio;
  }

  return {
    ...portfolio,
    projects: portfolio.projects.filter((project) => project.title !== "Age Calculator")
  };
};

router.get("/", async (req, res) => {
  if (!req.app.locals.dbConnected) {
    return res.json(removeHiddenProjects(req.app.locals.memoryStore.portfolio || defaultPortfolio));
  }

  try {
    const data = await Portfolio.findOne().lean();
    return res.json(removeHiddenProjects(data || defaultPortfolio));
  } catch (_error) {
    return res.json(removeHiddenProjects(defaultPortfolio));
  }
});

export default router;
