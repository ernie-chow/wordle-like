import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GameStatus, TileResult } from "@wordle/shared";
import type { GameState } from "@wordle/shared";
import { renderWithMantine } from "../test/renderWithMantine";
import { GameComplete } from "./GameComplete";

const baseGame: GameState = {
    id: "00000000-0000-0000-0000-000000000000",
    status: GameStatus.Complete,
    guesses: [],
    maxAttempts: 6,
    targetWord: "crane",
    createdAt: new Date().toISOString(),
};

const winGame: GameState = {
    ...baseGame,
    guesses: [
        {
            word: "crane",
            result: Array(5).fill(TileResult.Green),
        },
    ],
};

const lossGame: GameState = {
    ...baseGame,
    guesses: [
        {
            word: "audio",
            result: Array(5).fill(TileResult.Grey),
        },
    ],
};

describe("GameComplete", () => {
    it("shows you won message on a winning game", () => {
        renderWithMantine(<GameComplete game={winGame} onPlayAgain={() => {}} />);
        expect(screen.getByText("You won!")).toBeInTheDocument();
    });

    it("shows game over message with the target word on a loss", () => {
        renderWithMantine(<GameComplete game={lossGame} onPlayAgain={() => {}} />);
        expect(screen.getByText(/game over/i)).toBeInTheDocument();
        expect(screen.getByText(/CRANE/)).toBeInTheDocument();
    });

    it("calls onPlayAgain when the button is clicked", async () => {
        const onPlayAgain = vi.fn();
        renderWithMantine(<GameComplete game={winGame} onPlayAgain={onPlayAgain} />);
        await userEvent.click(screen.getByRole("button", { name: /play again/i }));
        expect(onPlayAgain).toHaveBeenCalledOnce();
    });
});
