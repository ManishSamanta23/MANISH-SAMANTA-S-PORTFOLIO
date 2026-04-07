import { Router } from "express";
import { ContactMessage } from "../models/ContactMessage.js";

const router = Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email and message are required" });
  }

  if (!req.app.locals.dbConnected) {
    req.app.locals.memoryStore.contactMessages.push({
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    });
    return res.status(201).json({ message: "Message saved in fallback mode" });
  }

  await ContactMessage.create({ name, email, message });
  return res.status(201).json({ message: "Message saved successfully" });
});

export default router;
