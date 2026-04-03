import { useCallback, useState } from "react";
import type { GameState } from "@wordle/shared";
import * as api from "../services/api";

interface UseGameReturn {
    game: GameState | null;
    loading: boolean;
    error: string | null;
    startGame: () => Promise<void>;
    submitGuess: (word: string) => Promise<boolean>;
}

export function useGame(): UseGameReturn {
    const [game, setGame] = useState<GameState | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startGame = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setGame(await api.createGame());
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to start game");
        } finally {
            setLoading(false);
        }
    }, []);

    const submitGuess = useCallback(
        async (word: string): Promise<boolean> => {
            if (!game) return false;
            setLoading(true);
            setError(null);
            try {
                setGame(await api.submitGuess(game.id, word));
                return true;
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to submit guess");
                return false;
            } finally {
                setLoading(false);
            }
        },
        [game],
    );

    return { game, loading, error, startGame, submitGuess };
}
