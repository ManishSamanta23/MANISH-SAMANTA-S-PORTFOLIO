import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    repoUrl: { type: String, required: true },
    liveUrl: { type: String, default: "" }
  },
  { _id: false }
);

const socialSchema = new mongoose.Schema(
  {
    linkedIn: { type: String, required: true },
    github: { type: String, required: true }
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    heroImage: { type: String, required: true },
    about: [{ type: String, required: true }],
    skills: [{ type: String, required: true }],
    projects: [projectSchema],
    socialLinks: socialSchema,
    chatIntro: { type: String, required: true }
  },
  { timestamps: true }
);

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);
