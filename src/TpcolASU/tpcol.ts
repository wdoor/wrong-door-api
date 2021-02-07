import express, { Router } from "express";

import Schedule from "./api/schedule";

// Определение роутера
const router = Router();

// Парсим body на json
router.use("/", express.json());

//          --- Routers ---
router.use("/schedule", Schedule);
//          --- Routers ---

export default router;
