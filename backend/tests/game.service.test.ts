import { createGame, getGame, submitGuess } from "../src/services/game.service";
import { GameStatus, TileResult } from "../src/models/game.model";
import * as wordService from "../src/services/word.service";

const KNOWN_WORD = "crane";

beforeEach(() => {
    jest.spyOn(wordService, "getRandomWord").mockReturnValue(KNOWN_WORD);
    jest.spyOn(wordService, "isValidWord").mockReturnValue(true);
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("createGame", () => {
    it("returns a game with correct initial shape", () => {
        const game = createGame();
        expect(game.status).toBe(GameStatus.InProgress);
        expect(game.guesses).toHaveLength(0);
        expect(game.maxAttempts).toBe(6);
        expect(game.id).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
        );
    });

    it("redacts the target word while in progress", () => {
        const game = createGame();
        expect(game.targetWord).toBe("*****");
    });
});

describe("getGame", () => {
    it("returns undefined for an unknown id", () => {
        expect(getGame("00000000-0000-0000-0000-000000000000")).toBeUndefined();
    });

    it("returns the game for a known id", () => {
        const created = createGame();
        const fetched = getGame(created.id);
        expect(fetched).toBeDefined();
        expect(fetched!.id).toBe(created.id);
    });

    it("redacts the target word while in progress", () => {
        const created = createGame();
        const fetched = getGame(created.id)!;
        expect(fetched.targetWord).toBe("*****");
    });
});

describe("submitGuess", () => {
    it("returns an error for an unknown game id", () => {
        const result = submitGuess("00000000-0000-0000-0000-000000000000", "crane");
        expect(result).toEqual({ error: "Game not found", status: 404 });
    });

    it("returns an error for an invalid word", () => {
        jest.spyOn(wordService, "isValidWord").mockReturnValue(false);
        const game = createGame();
        const result = submitGuess(game.id, "zzzzz");
        expect(result).toEqual({ error: "Invalid word", status: 400 });
    });

    it("records the guess and keeps the game in progress on a wrong guess", () => {
        const game = createGame();
        const result = submitGuess(game.id, "audio");
        expect("error" in result).toBe(false);
        if ("game" in result) {
            expect(result.game.guesses).toHaveLength(1);
            expect(result.game.status).toBe(GameStatus.InProgress);
            expect(result.game.targetWord).toBe("*****");
        }
    });

    it("marks the game complete and reveals the word on a correct guess", () => {
        const game = createGame();
        const result = submitGuess(game.id, KNOWN_WORD);
        expect("game" in result).toBe(true);
        if ("game" in result) {
            expect(result.game.status).toBe(GameStatus.Complete);
            expect(result.game.targetWord).toBe(KNOWN_WORD);
        }
    });

    it("marks the game complete after max attempts are exhausted", () => {
        const game = createGame();
        // submit 5 wrong guesses
        for (let i = 0; i < 5; i++) {
            jest.spyOn(wordService, "evaluateGuess").mockReturnValue(
                Array(5).fill(TileResult.Grey),
            );
            submitGuess(game.id, "audio");
        }
        // 6th wrong guess
        jest.spyOn(wordService, "evaluateGuess").mockReturnValue(
            Array(5).fill(TileResult.Grey),
        );
        const result = submitGuess(game.id, "audio");
        expect("game" in result).toBe(true);
        if ("game" in result) {
            expect(result.game.status).toBe(GameStatus.Complete);
            expect(result.game.targetWord).toBe(KNOWN_WORD);
        }
    });

    it("returns an error when the game is already complete", () => {
        const game = createGame();
        submitGuess(game.id, KNOWN_WORD);
        const result = submitGuess(game.id, KNOWN_WORD);
        expect(result).toEqual({ error: "Game is already complete", status: 400 });
    });
});