import type { GameState } from "@wordle/shared";

const BASE_URL = "http://localhost:3000/game";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? res.statusText);
    }
    return res.json() as Promise<T>;
}

export function createGame(): Promise<GameState> {
    return request<GameState>("/", { method: "POST" });
}

export function getGame(id: string): Promise<GameState> {
    return request<GameState>(`/${id}`);
}

export function submitGuess(id: string, word: string): Promise<GameState> {
    return request<GameState>(`/${id}/guess`, {
        method: "POST",
        body: JSON.stringify({ word }),
    });
}
