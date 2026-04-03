export enum TileResult {
    Green = "green",
    Yellow = "yellow",
    Grey = "grey",
}

export enum GameStatus {
    InProgress = "in_progress",
    Complete = "complete",
}

export interface Guess {
    word: string;
    result: TileResult[];
}

export interface GameState {
    id: string;
    status: GameStatus;
    guesses: Guess[];
    maxAttempts: number;
    targetWord: string;
    createdAt: string;
}
