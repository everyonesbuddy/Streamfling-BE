import express from "express";
const requireSignin = require("../middlewares/index");

const router = express.Router();

import { getAi, promptAi } from "../controllers/ai";

router.get("/ai", getAi);
router.post("/prompt-ai", promptAi);

module.exports = router;
