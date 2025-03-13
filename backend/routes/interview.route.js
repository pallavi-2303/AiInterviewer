import express from "express";
import { createInterview, getAllInterviews, getInterviewById, UpdateById } from "../controllers/interview.controller.js";
const router=express.Router();
router.route("/create").post(createInterview);
router.route("/:userId").get(getAllInterviews);
router.route("/interviewById/:interviewId").get(getInterviewById);
router.route("/:id").put(UpdateById);
export default router;