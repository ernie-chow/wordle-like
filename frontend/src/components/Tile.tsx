import { Flex, Text } from "@mantine/core";
import { TileResult } from "@wordle/shared";
import { tileColours } from "../constants/tileColours";

export interface TileProps {
    letter?: string;
    result?: TileResult;
    isActive?: boolean;
}

export function Tile({ letter, result, isActive }: TileProps) {
    const submitted = result !== undefined;

    return (
        <Flex
            w={56}
            h={56}
            align="center"
            justify="center"
            style={{
                border: `2px solid ${
                    submitted
                        ? "transparent"
                        : isActive && letter
                          ? "var(--mantine-color-dark-4)"
                          : "var(--mantine-color-gray-4)"
                }`,
                backgroundColor: submitted ? tileColours[result] : "transparent",
            }}
        >
            {letter && (
                <Text
                    fw={700}
                    size="xl"
                    c={submitted ? "white" : "var(--mantine-color-dark-9)"}
                    style={{ userSelect: "none" }}
                >
                    {letter.toUpperCase()}
                </Text>
            )}
        </Flex>
    );
}
