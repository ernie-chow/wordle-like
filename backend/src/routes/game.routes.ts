import { Router } from "express";
import { validateGuidParam } from "../middleware/validateGuid";
import {
    handleCreateGame,
    handleGetGame,
    handleSubmitGuess,
} from "../controllers/game.controller";

const router = Router();

router.post("/", handleCreateGame);
router.get("/:id", validateGuidParam("id"), handleGetGame);
router.post("/:id/guess", validateGuidParam("id"), handleSubmitGuess);

export default router;
