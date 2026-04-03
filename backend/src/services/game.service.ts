import { randomUUID } from "crypto";
import { GameState, GameStatus, TileResult } from "../models/game.model";
import { getRandomWord, isValidWord, evaluateGuess } from "./word.service";

const store = new Map<string, GameState>();
const MAX_ATTEMPTS = 6;
const REDACTED = "*****";

function redact(game: GameState): GameState {
    if (game.status === GameStatus.InProgress) {
        return { ...game, targetWord: REDACTED };
    }
    return game;
}

export function createGame(): GameState {
    const game: GameState = {
        id: randomUUID(),
        status: GameStatus.InProgress,
        guesses: [],
        maxAttempts: MAX_ATTEMPTS,
        targetWord: getRandomWord(),
        createdAt: new Date().toISOString(),
    };
    store.set(game.id, game);
    return redact(game);
}

export function getGame(id: string): GameState | undefined {
    const game = store.get(id);
    return game ? redact(game) : undefined;
}

type GuessError = { error: string; status: number };
type GuessSuccess = { game: GameState };

function validateGuess(game: GameState, word: string): GuessError | null {
    if (game.status === GameStatus.Complete)
        return { error: "Game is already complete", status: 400 };
    if (game.guesses.length >= game.maxAttempts)
        return { error: "Maximum attempts reached", status: 400 };
    if (!isValidWord(word)) return { error: "Invalid word", status: 400 };
    return null;
}

export function submitGuess(id: string, word: string): GuessSuccess | GuessError {
    const game = store.get(id);
    if (!game) return { error: "Game not found", status: 404 };

    const validationError = validateGuess(game, word);
    if (validationError) return validationError;

    const result = evaluateGuess(word, game.targetWord);
    game.guesses.push({ word, result });

    const isWin = result.every((r) => r === TileResult.Green);
    if (isWin || game.guesses.length >= game.maxAttempts) {
        game.status = GameStatus.Complete;
    }

    return { game: redact(game) };
}
