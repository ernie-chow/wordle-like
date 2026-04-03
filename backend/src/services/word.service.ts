import { TileResult } from "../models/game.model";
import validWords from "../data/valid-wordle-words.json";
import answerWords from "../data/wordle-answers-alphabetical.json";

const validWordSet = new Set<string>(validWords);
const answerWordSet = new Set<string>(answerWords);

export function getRandomWord(): string {
    const index = Math.floor(Math.random() * answerWords.length);
    return answerWords[index];
}

export function isValidWord(word: string): boolean {
    return (
        validWordSet.has(word.toLowerCase()) ||
        answerWordSet.has(word.toLowerCase())
    );
}

function applyGreens(
    guessLetters: string[],
    targetLetters: string[],
    result: TileResult[],
): void {
    guessLetters.forEach((char, i) => {
        if (char === targetLetters[i]) {
            result[i] = TileResult.Green;
            targetLetters[i] = "";
        }
    });
}

function applyYellows(
    guessLetters: string[],
    targetLetters: string[],
    result: TileResult[],
): void {
    guessLetters.forEach((char, i) => {
        if (result[i] === TileResult.Green) return;
        const targetIndex = targetLetters.indexOf(char);
        if (targetIndex !== -1) {
            result[i] = TileResult.Yellow;
            targetLetters[targetIndex] = "";
        }
    });
}

export function evaluateGuess(guess: string, target: string): TileResult[] {
    const result: TileResult[] = new Array(target.length).fill(TileResult.Grey);
    const targetLetters = target.split("");
    const guessLetters = guess.toLowerCase().split("");

    applyGreens(guessLetters, targetLetters, result);
    applyYellows(guessLetters, targetLetters, result);

    return result;
}
