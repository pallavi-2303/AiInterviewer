import express from "express";
import { getResume, saveResume } from "../controllers/resume.controller.js";
const router=express.Router();
router.route("/save/:userId").post(saveResume);
router.route("/get/:userId").get(getResume);
export default router;
