import { TileResult } from "@wordle/shared";

export const tileColours: Record<TileResult, string> = {
    [TileResult.Green]: "var(--mantine-color-green-7)",
    [TileResult.Yellow]: "var(--mantine-color-yellow-5)",
    [TileResult.Grey]: "var(--mantine-color-gray-6)",
};
