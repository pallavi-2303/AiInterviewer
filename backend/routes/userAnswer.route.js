import express from "express";
import { giveFeedBacks, saveUserAnswer } from "../controllers/userAnswer.controller.js";
const router=express.Router();
router.route("/usersave").post(saveUserAnswer);
router.route("/feedbacks/:userId/:interviewId").get(giveFeedBacks)
export default router;