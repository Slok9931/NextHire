import express from "express";
import cloudinary from "cloudinary";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/upload", async (req, res) => {
  try {
    const { buffer, public_id } = req.body;
    if (public_id) {
      await cloudinary.v2.uploader.destroy(public_id);
    }
    const cloud = await cloudinary.v2.uploader.upload(buffer);
    res.json({
      url: cloud.secure_url,
      public_id: cloud.public_id,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

router.post("/career", async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills) {
      return res.status(400).json({ message: "Skills are required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: "Gemini API key not configured" });
    }

    const prompt = `
Based on the following skills: ${skills}.
Please act as a career advisor and generate a career path suggestion.
Your entire response must be in a valid JSON format. Do not include any text or markdown
formatting outside of the JSON structure.
The JSON object should have the following structure:
{
"summary": "A brief, encouraging summary of the user's skill set and their general job
title.",
"jobOptions": [
{
"title": "The name of the job role.",
"responsibilities": "A description of what the user would do in this role.",
"why": "An explanation of why this role is a good fit for their skills."
}
],
"skillsToLearn": [
{
"category": "A general category for skill improvement (e.g., 'Deepen Your Existing Stack
Mastery', 'DevOps & Cloud').",
"skills": [
{
"title": "The name of the skill to learn.",
"why": "Why learning this skill is important.",
"how": "Specific examples of how to learn or apply this skill."
}
]
}
],
"learningApproach": {
"title": "How to Approach Learning",
"points": ["A bullet point list of actionable advice for learning."]
}
}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (!text) {
      return res
        .status(500)
        .json({ message: "Failed to generate career path" });
    }

    let jsonRes;
    try {
      const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      jsonRes = JSON.parse(cleanText);
    } catch (parseError) {
      return res.status(500).json({
        message: "Failed to parse AI response",
        error:
          parseError instanceof Error
            ? parseError.message
            : "Unknown parse error",
      });
    }

    res.json(jsonRes);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
