import { useEffect, useState } from "react";
import { Button, Stack, Text } from "@mantine/core";
import { useWindowEvent } from "@mantine/hooks";
import { GameStatus } from "@wordle/shared";
import { useGame } from "../hooks/useGame";
import Board from "./Board";
import { GameComplete } from "./GameComplete";

const WORD_LENGTH = 5;

export function Game() {
    const { game, loading, error, startGame, submitGuess } = useGame();
    const [currentGuess, setCurrentGuess] = useState("");

    useEffect(() => {
        void startGame();
    }, [startGame]);

    useWindowEvent("keydown", (e) => {
        if (!game || game.status !== GameStatus.InProgress || loading) return;

        if (e.key === "Enter" && currentGuess.length === WORD_LENGTH) {
            void submitGuess(currentGuess).then((accepted) => {
                if (accepted) setCurrentGuess("");
            });
        } else if (e.key === "Backspace") {
            setCurrentGuess((prev) => prev.slice(0, -1));
        } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < WORD_LENGTH) {
            setCurrentGuess((prev) => prev + e.key.toLowerCase());
        }
    });

    return (
        <Stack align="center" gap="md">
            <Button onClick={() => void startGame()}>New game</Button>
            <Text size="lg" fw={500}>
                {game ? `Game ID: ${game.id}` : "Loading..."}
            </Text>
            <Text size="md">
                {game?.status === GameStatus.InProgress ? "Type your guess and press Enter" : ""}
            </Text>
            <Text size="md" c="dimmed">
                Number of guesses: {game?.guesses.length ?? 0}
            </Text>

            <Board game={game} currentGuess={currentGuess} />
            {game?.status === GameStatus.Complete && (
                <GameComplete game={game} onPlayAgain={() => void startGame()} />
            )}
            {error && <Text c="red">{error}</Text>}
        </Stack>
    );
}
