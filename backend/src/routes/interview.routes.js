import express from "express"
import { generateQuestions, evaluateAnswer, getUserHistory, getSessionById, deleteSession } from "../controllers/interview.controller.js";
import {protectRoute} from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/start", protectRoute, generateQuestions);
router.post("/submit-answer", protectRoute, evaluateAnswer);
router.get("/history", protectRoute, getUserHistory);
router.get("/session/:sessionId", protectRoute, getSessionById);
router.delete("/session/:sessionId", protectRoute, deleteSession);

export default router;