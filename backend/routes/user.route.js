import express from "express";
import { saveUser } from "../controllers/user.controller.js";
const router=express.Router();
router.route("/save-user").post(saveUser);
export default router;