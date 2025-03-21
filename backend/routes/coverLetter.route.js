import express from "express";
import { createCoverLetter, deleteCoverLetter, getCoverLetterById, getCoverLetters, updateCoverLetter } from "../controllers/coverLetter.controller.js";
const router=express.Router();
router.route("/create").post(createCoverLetter);
router.route("/get/:id").get(getCoverLetters);
router.route("/:id").get(getCoverLetterById);
router.route("/:id").put(updateCoverLetter);
router.route("/:id").delete(deleteCoverLetter);
export default router;
