import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CharacterGrid } from "@/components/navigation/CharacterGrid";
import type { Category, CharacterTemplate } from "@/types";

describe("CharacterGrid", () => {
	const mockCharacters: CharacterTemplate[] = [
		{
			character: "A",
			category: "uppercase" as Category,
			displayName: "Letter A",
			bounds: { width: 100, height: 100, viewBox: "0 0 100 100" },
			strokes: [],
			totalStrokes: 3,
		},
		{
			character: "B",
			category: "uppercase" as Category,
			displayName: "Letter B",
			bounds: { width: 100, height: 100, viewBox: "0 0 100 100" },
			strokes: [],
			totalStrokes: 2,
		},
		{
			character: "C",
			category: "uppercase" as Category,
			displayName: "Letter C",
			bounds: { width: 100, height: 100, viewBox: "0 0 100 100" },
			strokes: [],
			totalStrokes: 1,
		},
	];

	const mockOnSelectCharacter = vi.fn();
	const mockOnBack = vi.fn();

	beforeEach(() => {
		mockOnSelectCharacter.mockClear();
		mockOnBack.mockClear();
	});

	it("should render category title", () => {
		render(
			<CharacterGrid
				category="uppercase"
				characters={mockCharacters}
				onSelectCharacter={mockOnSelectCharacter}
				onBack={mockOnBack}
			/>,
		);

		expect(screen.getAllByText("Uppercase Letters").length).toBeGreaterThan(0);
	});

	it("should render all character cards", () => {
		render(
			<CharacterGrid
				category="uppercase"
				characters={mockCharacters}
				onSelectCharacter={mockOnSelectCharacter}
				onBack={mockOnBack}
			/>,
		);

		const canvases = document.querySelectorAll("canvas");
		expect(canvases).toHaveLength(3);
	});

	it("should call onSelectCharacter when character is clicked", () => {
		render(
			<CharacterGrid
				category="uppercase"
				characters={mockCharacters}
				onSelectCharacter={mockOnSelectCharacter}
				onBack={mockOnBack}
			/>,
		);

		const characterA = screen.getByLabelText("Select Letter A");
		fireEvent.click(characterA);

		expect(mockOnSelectCharacter).toHaveBeenCalledTimes(1);
		expect(mockOnSelectCharacter).toHaveBeenCalledWith(mockCharacters[0]);
	});

	it("should call onBack when back button is clicked", () => {
		render(
			<CharacterGrid
				category="uppercase"
				characters={mockCharacters}
				onSelectCharacter={mockOnSelectCharacter}
				onBack={mockOnBack}
			/>,
		);

		const backButton = screen.getByRole("button", {
			name: /go back to category selection/i,
		});
		fireEvent.click(backButton);

		expect(mockOnBack).toHaveBeenCalledTimes(1);
	});

	it("should handle keyboard navigation with Enter key", () => {
		render(
			<CharacterGrid
				category="uppercase"
				characters={mockCharacters}
				onSelectCharacter={mockOnSelectCharacter}
				onBack={mockOnBack}
			/>,
		);

		const characterB = screen.getByLabelText("Select Letter B");
		fireEvent.keyDown(characterB, { key: "Enter" });

		expect(mockOnSelectCharacter).toHaveBeenCalledWith(mockCharacters[1]);
	});

	it("should handle keyboard navigation with Space key", () => {
		render(
			<CharacterGrid
				category="uppercase"
				characters={mockCharacters}
				onSelectCharacter={mockOnSelectCharacter}
				onBack={mockOnBack}
			/>,
		);

		const characterC = screen.getByLabelText("Select Letter C");
		fireEvent.keyDown(characterC, { key: " " });

		expect(mockOnSelectCharacter).toHaveBeenCalledWith(mockCharacters[2]);
	});

	it("should apply pressed style on pointer down", () => {
		render(
			<CharacterGrid
				category="uppercase"
				characters={mockCharacters}
				onSelectCharacter={mockOnSelectCharacter}
				onBack={mockOnBack}
			/>,
		);

		const characterA = screen.getByLabelText("Select Letter A");
		fireEvent.pointerDown(characterA);

		expect(characterA).toHaveStyle({
			transform: "scale(0.95)",
		});
	});

	it("should reset pressed state on pointer up", () => {
		render(
			<CharacterGrid
				category="uppercase"
				characters={mockCharacters}
				onSelectCharacter={mockOnSelectCharacter}
				onBack={mockOnBack}
			/>,
		);

		const characterA = screen.getByLabelText("Select Letter A");
		fireEvent.pointerDown(characterA);
		fireEvent.pointerUp(characterA);

		expect(characterA).not.toHaveStyle({
			transform: "scale(0.95)",
		});
	});

	it("should reset pressed state on pointer leave", () => {
		render(
			<CharacterGrid
				category="uppercase"
				characters={mockCharacters}
				onSelectCharacter={mockOnSelectCharacter}
				onBack={mockOnBack}
			/>,
		);

		const characterA = screen.getByLabelText("Select Letter A");
		fireEvent.pointerDown(characterA);
		fireEvent.pointerLeave(characterA);

		expect(characterA).not.toHaveStyle({
			transform: "scale(0.95)",
		});
	});

	it("should display correct category name for numbers", () => {
		render(
			<CharacterGrid
				category="number"
				characters={mockCharacters}
				onSelectCharacter={mockOnSelectCharacter}
				onBack={mockOnBack}
			/>,
		);

		expect(screen.getAllByText("Numbers").length).toBeGreaterThan(0);
	});

	it("should display correct category name for lowercase", () => {
		render(
			<CharacterGrid
				category="lowercase"
				characters={mockCharacters}
				onSelectCharacter={mockOnSelectCharacter}
				onBack={mockOnBack}
			/>,
		);

		expect(screen.getAllByText("Lowercase Letters").length).toBeGreaterThan(0);
	});

	it("should have proper ARIA attributes", () => {
		render(
			<CharacterGrid
				category="uppercase"
				characters={mockCharacters}
				onSelectCharacter={mockOnSelectCharacter}
				onBack={mockOnBack}
			/>,
		);

		const grid = screen.getByRole("list", { name: /uppercase letters grid/i });
		expect(grid).toBeInTheDocument();

		const characterA = screen.getByLabelText("Select Letter A");
		expect(characterA.tagName).toBe("BUTTON");
	});

	it("should render characters without displayName", () => {
		const charactersWithoutDisplayName: CharacterTemplate[] = [
			{
				character: "X",
				category: "uppercase" as Category,
				bounds: { width: 100, height: 100, viewBox: "0 0 100 100" },
				strokes: [],
				totalStrokes: 2,
			},
		];

		render(
			<CharacterGrid
				category="uppercase"
				characters={charactersWithoutDisplayName}
				onSelectCharacter={mockOnSelectCharacter}
				onBack={mockOnBack}
			/>,
		);

		expect(screen.getByLabelText("Select X")).toBeInTheDocument();
	});
});
