import { evaluateGuess, isValidWord } from "../src/services/word.service";
import { TileResult } from "../src/models/game.model";

describe("evaluateGuess", () => {
    it("returns all green for an exact match", () => {
        const result = evaluateGuess("crane", "crane");
        expect(result).toEqual([
            TileResult.Green,
            TileResult.Green,
            TileResult.Green,
            TileResult.Green,
            TileResult.Green,
        ]);
    });

    it("returns all grey when no letters match", () => {
        const result = evaluateGuess("zzzzz", "crane");
        expect(result).toEqual([
            TileResult.Grey,
            TileResult.Grey,
            TileResult.Grey,
            TileResult.Grey,
            TileResult.Grey,
        ]);
    });

    it("returns yellow for correct letter in wrong position", () => {
        const result = evaluateGuess("axxxx", "xaaaa");
        expect(result[0]).toBe(TileResult.Yellow);
    });

    it("returns green over yellow when letter is in correct position", () => {
        expect(evaluateGuess("crane", "crimp")).toEqual([
            TileResult.Green,
            TileResult.Green,
            TileResult.Grey,
            TileResult.Grey,
            TileResult.Grey,
        ]);
    });

    it("does not double-count duplicate letters in the guess", () => {
        const result = evaluateGuess("eeexx", "crane");
        const marked = result.filter((r) => r !== TileResult.Grey);
        expect(marked).toHaveLength(1);
    });

    it("handles duplicate letters in the target correctly", () => {
        expect(evaluateGuess("eeeee", "speed")).toEqual([
            TileResult.Grey,
            TileResult.Grey,
            TileResult.Green,
            TileResult.Green,
            TileResult.Grey,
        ]);
    });

    it("is case insensitive", () => {
        const lower = evaluateGuess("crane", "crane");
        const upper = evaluateGuess("CRANE", "crane");
        expect(upper).toEqual(lower);
    });
});

describe("isValidWord", () => {
    it("returns true for a word in the valid words list", () => {
        expect(isValidWord("crane")).toBe(true);
    });

    it("returns false for a non-word", () => {
        expect(isValidWord("zzzzz")).toBe(false);
    });

    it("is case insensitive", () => {
        expect(isValidWord("CRANE")).toBe(true);
    });
});
