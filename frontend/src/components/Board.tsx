import { Flex, Stack } from "@mantine/core";
import type { GameState, Guess } from "@wordle/shared";
import { Tile } from "./Tile";

const WORD_LENGTH = 5;

interface BoardProps {
    game: GameState | null;
    currentGuess: string;
}

function buildRows(game: GameState | null, currentGuess: string) {
    const maxAttempts = game?.maxAttempts ?? 6;
    const submittedCount = game?.guesses.length ?? 0;

    return Array.from({ length: maxAttempts }, (_, row) => {
        const guess: Guess | undefined = game?.guesses[row];
        const isActive = row === submittedCount;

        return Array.from({ length: WORD_LENGTH }, (_, col) => ({
            letter: guess ? guess.word[col] : isActive ? currentGuess[col] : undefined,
            result: guess?.result[col],
            isActive,
        }));
    });
}

function Board({ game, currentGuess }: BoardProps) {
    const rows = buildRows(game, currentGuess);

    return (
        <Stack gap="xs">
            {rows.map((row, r) => (
                <Flex key={r} gap="xs">
                    {row.map((tile, c) => (
                        <Tile key={c} {...tile} />
                    ))}
                </Flex>
            ))}
        </Stack>
    );
}

export default Board;
