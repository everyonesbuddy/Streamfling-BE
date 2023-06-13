import express from "express";

const router = express.Router();

import { ai, promptAi } from "../controllers/ai";

//new /ai
router.get("/ai", ai);

//new /prompt ai
router.post("/prompt-ai", promptAi);

module.exports = router;
