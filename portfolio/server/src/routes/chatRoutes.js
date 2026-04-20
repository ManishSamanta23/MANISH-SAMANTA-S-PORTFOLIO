import { Router } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();

const aboutMe = "I am Manish Samanta, a B.Tech CSE student at Sister Nivedita University, graduating in 2027. I focus on Web Development and Generative AI and build projects using HTML, CSS, JavaScript, Python, MySQL, and Flutter.";

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-2.5-flash" }) : null;

const answerFor = (text) => {
  const msg = text.toLowerCase();

  if (msg.includes("skill")) {
    return "My key skills are HTML, CSS, JavaScript, Python, MySQL, C, C++, Flutter, Git, and GitHub.";
  }

  if (msg.includes("project")) {
    return "I have built a Scientific Calculator, a Tic-Tac-Toe Game, an Avaran app, and a Finance Dashboard.";
  }

  if (msg.includes("study") || msg.includes("college") || msg.includes("graduat")) {
    return "I am studying B.Tech CSE at Sister Nivedita University and plan to graduate in 2027.";
  }

  if (msg.includes("contact") || msg.includes("linkedin") || msg.includes("github")) {
    return "You can connect with me on LinkedIn and GitHub from the contact section.";
  }

  return `${aboutMe} Feel free to ask about my projects, skills, or learning path.`;
};

router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }

  if (!model) {
    return res.json({ reply: answerFor(message) });
  }

  const prompt = `You are a helpful assistant answering questions only about this person.\n\nAbout me:\n${aboutMe}\n\nUser question: ${message}\n\nRules:\n- Keep replies short and clear.\n- If the question is not about me, politely say you can only answer about me.\n- When relevant, include skills, projects, or study details from the profile above.`;

  try {
    const result = await model.generateContent(prompt);
    const reply = result.response.text()?.trim();

    if (!reply) {
      return res.json({ reply: answerFor(message) });
    }

    return res.json({ reply });
  } catch (error) {
    console.error("Gemini chat error:", error);
    return res.json({ reply: answerFor(message) });
  }
});

export default router;
