import { screen } from "@testing-library/react";
import { TileResult } from "@wordle/shared";
import { renderWithMantine } from "../test/renderWithMantine";
import { Tile } from "./Tile";

describe("Tile", () => {
    it("renders empty with no props", () => {
        const { container } = renderWithMantine(<Tile />);
        expect(container.firstChild).toBeTruthy();
        expect(screen.queryByText(/./)).toBeNull();
    });

    it("renders the letter uppercased", () => {
        renderWithMantine(<Tile letter="a" />);
        expect(screen.getByText("A")).toBeInTheDocument();
    });

    it("renders nothing when no letter is provided", () => {
        const { container } = renderWithMantine(<Tile result={TileResult.Grey} />);
        expect(container.querySelector("p")).toBeNull();
    });

    it("renders a submitted tile with a letter", () => {
        renderWithMantine(<Tile letter="c" result={TileResult.Green} />);
        expect(screen.getByText("C")).toBeInTheDocument();
    });
});
