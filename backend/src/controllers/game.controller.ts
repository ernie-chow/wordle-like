import { Request, Response } from "express";
import { createGame, getGame, submitGuess } from "../services/game.service";

export function handleCreateGame(_req: Request, res: Response): void {
    res.status(201).json(createGame());
}

export function handleGetGame(req: Request, res: Response): void {
    const game = getGame(req.params.id as string);
    if (!game) {
        res.status(404).json({ error: "Game not found" });
        return;
    }
    res.json(game);
}

export function handleSubmitGuess(req: Request, res: Response): void {
    const { word } = req.body as { word: string };
    if (!word || typeof word !== "string") {
        res.status(400).json({ error: "Request body must include word" });
        return;
    }

    const result = submitGuess(req.params.id as string, word);
    if ("error" in result) {
        const { status, ...body } = result;
        res.status(status).json(body);
        return;
    }
    res.json(result.game);
}
