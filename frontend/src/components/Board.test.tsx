import { screen } from "@testing-library/react";
import { GameStatus, TileResult } from "@wordle/shared";
import type { GameState } from "@wordle/shared";
import { renderWithMantine } from "../test/renderWithMantine";
import Board from "./Board";

const baseGame: GameState = {
    id: "00000000-0000-0000-0000-000000000000",
    status: GameStatus.InProgress,
    guesses: [],
    maxAttempts: 6,
    targetWord: "*****",
    createdAt: new Date().toISOString(),
};

describe("Board", () => {
    it("renders 6 rows of 5 tiles when no guesses have been made", () => {
        const { container } = renderWithMantine(<Board game={baseGame} currentGuess="" />);
        // Each tile is a flex container — 6 rows × 5 tiles = 30
        const rows = container.querySelectorAll(".mantine-Stack-root > *");
        expect(rows).toHaveLength(6);
    });

    it("renders null game as an empty 6x5 grid", () => {
        const { container } = renderWithMantine(<Board game={null} currentGuess="" />);
        const rows = container.querySelectorAll(".mantine-Stack-root > *");
        expect(rows).toHaveLength(6);
    });

    it("shows submitted guess letters on the board", () => {
        const game: GameState = {
            ...baseGame,
            guesses: [
                {
                    word: "crane",
                    result: [
                        TileResult.Green,
                        TileResult.Grey,
                        TileResult.Grey,
                        TileResult.Grey,
                        TileResult.Grey,
                    ],
                },
            ],
        };
        renderWithMantine(<Board game={game} currentGuess="" />);
        expect(screen.getByText("C")).toBeInTheDocument();
        expect(screen.getByText("R")).toBeInTheDocument();
        expect(screen.getByText("A")).toBeInTheDocument();
        expect(screen.getByText("N")).toBeInTheDocument();
        expect(screen.getByText("E")).toBeInTheDocument();
    });

    it("shows the current in-progress guess letters", () => {
        renderWithMantine(<Board game={baseGame} currentGuess="aud" />);
        expect(screen.getByText("A")).toBeInTheDocument();
        expect(screen.getByText("U")).toBeInTheDocument();
        expect(screen.getByText("D")).toBeInTheDocument();
    });
});
