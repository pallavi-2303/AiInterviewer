import express from "express";
import { createCoverLetter, deleteCoverLetter, getCoverLetterById, getCoverLetters, updateCoverLetter } from "../controllers/coverLetter.controller.js";
const router=express.Router();
router.route("/create").post(createCoverLetter);
router.route("/get").get(getCoverLetters);
router.route("/").get(getCoverLetterById);
router.route("/").put(updateCoverLetter);
router.route("/:id").delete(deleteCoverLetter);
export default router;
