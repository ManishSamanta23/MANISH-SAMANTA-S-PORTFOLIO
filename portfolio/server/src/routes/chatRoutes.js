import { Router } from "express";

const router = Router();

const aboutMe = "I am Manish Samanta, a B.Tech CSE student at Sister Nivedita University, graduating in 2027. I focus on Web Development and Generative AI and build projects using HTML, CSS, JavaScript, Python, MySQL, and Flutter.";

const answerFor = (text) => {
  const msg = text.toLowerCase();

  if (msg.includes("skill")) {
    return "My key skills are HTML, CSS, JavaScript, Python, MySQL, C, C++, Flutter, Git, and GitHub.";
  }

  if (msg.includes("project")) {
    return "I have built a Scientific Calculator, an Age Calculator, and a Tic-Tac-Toe Game.";
  }

  if (msg.includes("study") || msg.includes("college") || msg.includes("graduat")) {
    return "I am studying B.Tech CSE at Sister Nivedita University and plan to graduate in 2027.";
  }

  if (msg.includes("contact") || msg.includes("linkedin") || msg.includes("github")) {
    return "You can connect with me on LinkedIn and GitHub from the contact section.";
  }

  return `${aboutMe} Feel free to ask about my projects, skills, or learning path.`;
};

router.post("/", (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "message is required" });
  }

  return res.json({ reply: answerFor(message) });
});

export default router;
