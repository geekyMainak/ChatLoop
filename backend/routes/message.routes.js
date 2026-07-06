import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/:id", isAuth, getMessages);
router.post("/send/:id", isAuth, upload.single("image"), sendMessage);

export default router;
