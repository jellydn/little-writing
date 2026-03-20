import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CategorySelector } from "@/components/navigation/CategorySelector";

describe("CategorySelector", () => {
	const mockOnSelectCategory = vi.fn();

	beforeEach(() => {
		mockOnSelectCategory.mockClear();
	});

	it("should render all category cards", () => {
		render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

		expect(
			screen.getByRole("button", { name: /Select Numbers/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Select Uppercase/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Select Lowercase/i }),
		).toBeInTheDocument();
	});

	it("should call onSelectCategory when Numbers card is clicked", () => {
		render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

		const numbersCard = screen.getByRole("button", { name: /Select Numbers/i });
		fireEvent.click(numbersCard);

		expect(mockOnSelectCategory).toHaveBeenCalledTimes(1);
		expect(mockOnSelectCategory).toHaveBeenCalledWith("number");
	});

	it("should call onSelectCategory when Uppercase card is clicked", () => {
		render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

		const uppercaseCard = screen.getByRole("button", {
			name: /Select Uppercase/i,
		});
		fireEvent.click(uppercaseCard);

		expect(mockOnSelectCategory).toHaveBeenCalledTimes(1);
		expect(mockOnSelectCategory).toHaveBeenCalledWith("uppercase");
	});

	it("should call onSelectCategory when Lowercase card is clicked", () => {
		render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

		const lowercaseCard = screen.getByRole("button", {
			name: /Select Lowercase/i,
		});
		fireEvent.click(lowercaseCard);

		expect(mockOnSelectCategory).toHaveBeenCalledTimes(1);
		expect(mockOnSelectCategory).toHaveBeenCalledWith("lowercase");
	});

	it("should handle keyboard navigation with Enter key", () => {
		render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

		const numbersCard = screen.getByRole("button", { name: /Select Numbers/i });
		fireEvent.keyDown(numbersCard, { key: "Enter" });

		expect(mockOnSelectCategory).toHaveBeenCalledWith("number");
	});

	it("should handle keyboard navigation with Space key", () => {
		render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

		const uppercaseCard = screen.getByRole("button", {
			name: /Select Uppercase/i,
		});
		fireEvent.keyDown(uppercaseCard, { key: " " });

		expect(mockOnSelectCategory).toHaveBeenCalledWith("uppercase");
	});

	it("should not call onSelectCategory for other keys", () => {
		render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

		const numbersCard = screen.getByRole("button", { name: /Select Numbers/i });
		fireEvent.keyDown(numbersCard, { key: "a" });

		expect(mockOnSelectCategory).not.toHaveBeenCalled();
	});

	it("should apply hover styles on mouse enter", () => {
		render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

		const numbersCard = screen.getByRole("button", { name: /Select Numbers/i });
		fireEvent.mouseEnter(numbersCard);

		expect(numbersCard).toHaveStyle({
			transform: "translateY(-4px)",
		});
	});

	it("should apply active styles on mouse down", () => {
		render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

		const numbersCard = screen.getByRole("button", { name: /Select Numbers/i });
		fireEvent.mouseDown(numbersCard);

		expect(numbersCard).toHaveStyle({
			transform: "translateY(-2px) scale(0.98)",
		});
	});

	it("should reset hover state on mouse leave", () => {
		render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

		const numbersCard = screen.getByRole("button", { name: /Select Numbers/i });
		fireEvent.mouseEnter(numbersCard);
		fireEvent.mouseLeave(numbersCard);

		expect(numbersCard).not.toHaveStyle({
			transform: "translateY(-4px)",
		});
	});

	it("should reset active state on mouse up", () => {
		render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

		const numbersCard = screen.getByRole("button", { name: /Select Numbers/i });
		fireEvent.mouseDown(numbersCard);
		fireEvent.mouseUp(numbersCard);

		expect(numbersCard).not.toHaveStyle({
			transform: "translateY(-2px) scale(0.98)",
		});
	});

	it("should have accessible role and tabIndex", () => {
		render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

		const numbersCard = screen.getByRole("button", { name: /Select Numbers/i });
		expect(numbersCard).toHaveAttribute("type", "button");
	});

	it("should have hidden heading for screen readers", () => {
		render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

		const heading = screen.getByText("Choose a category");
		expect(heading).toHaveClass("visually-hidden");
	});
});
