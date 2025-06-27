import Session from "../models/interview.model.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv"
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Generate Questions
export const generateQuestions = async (req, res) => {
  const { topic } = req.body;

  if (!topic) return res.status(400).json({ message: "Topic is required" });

  try {
    const prompt = `Generate *exactly* 5 mock interview questions on the topic "${topic}".Return them as a numbered list (1-5).Do *not* include any preamble or trailing text.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text || "";
    const questions = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => /^\d+\.\s+/.test(line))
      .map((line) => line.replace(/^\d+\.\s+/, ""));


    //Creating the session schema with empty answers schema inside it.
    const session = await Session.create({
      user: req.user,
      topic,
      questions,
      answers: []    
    });

    res.status(200).json({sessionId: session._id, questions});
    
  } catch (error) {
    console.error("Gemini generateQuestions error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to generate questions", error: error.message });
  }
};

// Evaluate Answer
export const evaluateAnswer = async (req, res) => {
  const {sessionId, question, answer } = req.body;

  if (!sessionId || !question || !answer) {
    return res.status(400).json({ message: "sessionId, question and answer are required" });
  }

  try {
    const prompt = `
    You are a professional mock-interview evaluator.
    Evaluate the candidate's answer and return **only** a JSON object with three keys:
      • "score": integer (0–10)  
      • "feedback": string (your brief feedback + suggestions)  
      • "ideal": string (the ideal answer outline)  

    Example output:
    \`\`\`json
    {
      "score": 7,
      "feedback": "Good structure, but you can tighten up ...",
      "ideal": "You should cover A, then B, then C."
    }
    \`\`\`

    Question: ${question}
    Candidate's Answer: ${answer}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents:prompt,
    });

    let raw = (response.text || "").trim();
    if (raw.startsWith("```")) {
    raw = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      console.error("Gemini evaluateAnswer error:", error.message);
      res.status(500).json({message: "Failed to parse the evaluation."})
    }

    const { score: numericScore, feedback, ideal } = parsed;

    // Updating the session: Putting the answers schema inside.
    await Session.findByIdAndUpdate(
      sessionId,
      {$push: {answers: {question, answer, feedback, score:numericScore, ideal}}},
      {
        new: true
      }
    );
    
    res.status(200).json({ feedback, score: numericScore , ideal});
  } catch (error) {
    console.error("Gemini evaluateAnswer error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to evaluate answer", error: error.message });
  }
};

// Get All User's History
export const getUserHistory = async (req, res) => {
  try {
    const session = await Session.find({ user: req.user }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ session });
  } catch (error) {
    console.error("Session fetch error:", error.message);
    res.status(500).json({ message: "Failed to fetch session", error: error.message });
  }
};

//Getting the particular session from the session id:
export const getSessionById = async(req, res) => {
  const {sessionId} = req.params;
  try {
    const session = await Session.findOne({_id: sessionId, user:req.user}).lean();
    if(!session) return res.status(404).json({message: "Session not found"});
    res.json({session});
  } catch (error) {
    console.log("Fetch session error: ", error);
    res.status(500).json({message: "Server error"});
  }
}

//Deleting a particular session from the session id:
export const deleteSession = async(req,res) =>{
  const {sessionId} = req.params;
  try {
    const deleted = await Session.findByIdAndDelete(sessionId);
    if(!deleted){
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "Interview deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting", error: error.message });
  }
};
