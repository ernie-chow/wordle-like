import { Button, Stack, Text } from "@mantine/core";
import { TileResult } from "@wordle/shared";
import type { GameState } from "@wordle/shared";

interface GameCompleteProps {
    game: GameState;
    onPlayAgain: () => void;
}

function isWin(game: GameState): boolean {
    return game.guesses.at(-1)?.result.every((r) => r === TileResult.Green) ?? false;
}

export function GameComplete({ game, onPlayAgain }: GameCompleteProps) {
    return (
        <Stack align="center" gap="xs">
            {isWin(game) ? (
                <Text c="green" fw={700}>
                    You won!
                </Text>
            ) : (
                <Text c="red" fw={700}>
                    Game over... the word was {game.targetWord.toUpperCase()}
                </Text>
            )}
            <Button onClick={onPlayAgain}>Play again</Button>
        </Stack>
    );
}
