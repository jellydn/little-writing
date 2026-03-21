/**
 * Integration Tests: Clear/Reset Flow
 *
 * Tests the complete user flow for clearing the canvas and retrying
 * character tracing.
 *
 * User flow:
 * 1. Start tracing a character
 * 2. Draw partial strokes
 * 3. Tap Clear button
 * 4. Canvas clears
 * 5. User can retry from beginning
 */

import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAppStore } from "@/state/sessionStore";

// Mock the sound player
vi.mock("@/lib/feedback/soundPlayer", () => ({
	playSuccessSound: vi.fn(),
}));

// Mock useCanvas hook
vi.mock("@/hooks/useCanvas", () => ({
	useCanvas: vi.fn(() => ({
		canvasRef: { current: document.createElement("canvas") },
		ctx: {
			save: vi.fn(),
			restore: vi.fn(),
			fillStyle: "",
			fillRect: vi.fn(),
			strokeStyle: "",
			lineWidth: 0,
			lineCap: "",
			lineJoin: "",
			setLineDash: vi.fn(),
			beginPath: vi.fn(),
			moveTo: vi.fn(),
			lineTo: vi.fn(),
			stroke: vi.fn(),
			translate: vi.fn(),
			scale: vi.fn(),
			clip: vi.fn(),
			bezierCurveTo: vi.fn(),
			quadraticCurveTo: vi.fn(),
			arc: vi.fn(),
		} as unknown as CanvasRenderingContext2D,
		clear: vi.fn(),
	})),
}));

describe("Clear/Reset Flow Integration", () => {
	beforeEach(() => {
		// Reset store state before each test
		act(() => {
			useAppStore.setState({
				currentScreen: "category-selection",
				currentCategory: "number",
				currentCharacter: null,
				session: null,
			});
		});
	});

	it("should render Clear button on tracing screen", async () => {
		render(<AppLayout />);

		// Navigate to tracing screen
		act(() => {
			useAppStore.getState().selectCategory("number");
		});

		await waitFor(() => {
			expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
		});

		const characterButton = screen.getByText("0");
		fireEvent.click(characterButton);

		await waitFor(() => {
			expect(screen.getByText(/Trace:/i)).toBeInTheDocument();
		});

		// Clear button should be present
		const clearButton = screen.getByLabelText("Clear drawing");
		expect(clearButton).toBeInTheDocument();
	});

	it("should clear session when Clear button is clicked", async () => {
		render(<AppLayout />);

		// Navigate to tracing screen
		act(() => {
			useAppStore.getState().selectCategory("number");
		});

		await waitFor(() => {
			expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
		});

		const characterButton = screen.getByText("0");
		fireEvent.click(characterButton);

		await waitFor(() => {
			expect(screen.getByText(/Trace:/i)).toBeInTheDocument();
		});

		// Start a stroke
		act(() => {
			const store = useAppStore.getState();
			store.startStroke({ x: 50, y: 10 });
			store.addStrokePoint({ x: 55, y: 30 });
			store.addStrokePoint({ x: 60, y: 50 });
		});

		// Verify stroke exists
		expect(useAppStore.getState().session?.strokes.length).toBe(1);

		// Click Clear button
		const clearButton = screen.getByLabelText("Clear drawing");
		fireEvent.click(clearButton);

		// Session should be reset
		await waitFor(() => {
			expect(useAppStore.getState().session?.strokes.length).toBe(0);
			expect(useAppStore.getState().session?.currentStrokeIndex).toBe(0);
		});
	});

	it("should allow retry after clearing", async () => {
		render(<AppLayout />);

		// Navigate to tracing screen and complete a stroke
		act(() => {
			useAppStore.getState().selectCategory("number");
		});

		await waitFor(() => {
			expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
		});

		const characterButton = screen.getByText("0");
		fireEvent.click(characterButton);

		await waitFor(() => {
			expect(screen.getByText(/Trace:/i)).toBeInTheDocument();
		});

		// Complete the stroke
		act(() => {
			const store = useAppStore.getState();
			store.startStroke({ x: 50, y: 10 });
			store.endStroke();
		});

		await waitFor(() => {
			expect(useAppStore.getState().session?.isComplete).toBe(true);
			expect(screen.getByText("Great job!")).toBeInTheDocument();
		});

		// Clear the session
		const clearButton = screen.getByLabelText("Clear drawing");
		fireEvent.click(clearButton);

		// Session should be reset
		await waitFor(() => {
			expect(useAppStore.getState().session?.isComplete).toBe(false);
			expect(screen.queryByText("Great job!")).not.toBeInTheDocument();
		});

		// User should be able to start a new stroke
		act(() => {
			const store = useAppStore.getState();
			store.startStroke({ x: 50, y: 10 });
			store.addStrokePoint({ x: 50, y: 50 });
			store.endStroke();
		});

		// New stroke should be added
		await waitFor(() => {
			expect(useAppStore.getState().session?.strokes.length).toBe(1);
			expect(useAppStore.getState().session?.isComplete).toBe(true);
		});
	});

	it("should clear completed session and reset to initial state", async () => {
		render(<AppLayout />);

		// Navigate to tracing screen
		act(() => {
			useAppStore.getState().selectCategory("number");
		});

		await waitFor(() => {
			expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
		});

		const characterButton = screen.getByText("0");
		fireEvent.click(characterButton);

		await waitFor(() => {
			expect(screen.getByText(/Trace:/i)).toBeInTheDocument();
		});

		// Complete the stroke
		act(() => {
			const store = useAppStore.getState();
			store.startStroke({ x: 50, y: 10 });
			store.endStroke();
		});

		await waitFor(() => {
			expect(screen.getByText("Great job!")).toBeInTheDocument();
		});

		// Clear the session
		const clearButton = screen.getByLabelText("Clear drawing");
		fireEvent.click(clearButton);

		// Session should be reset to initial state
		await waitFor(() => {
			expect(useAppStore.getState().session?.strokes.length).toBe(0);
			expect(useAppStore.getState().session?.currentStrokeIndex).toBe(0);
			expect(useAppStore.getState().session?.isComplete).toBe(false);
		});

		// Success message should be gone
		expect(screen.queryByText("Great job!")).not.toBeInTheDocument();
	});

	it("should reset progress indicator after clear", async () => {
		render(<AppLayout />);

		// Navigate to tracing screen
		act(() => {
			useAppStore.getState().selectCategory("number");
		});

		await waitFor(() => {
			expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
		});

		const characterButton = screen.getByText("1");
		fireEvent.click(characterButton);

		// Initial progress indicator
		await waitFor(() => {
			expect(screen.getByText(/Stroke 1 of 1/i)).toBeInTheDocument();
		});

		// Complete the stroke
		act(() => {
			const store = useAppStore.getState();
			store.startStroke({ x: 50, y: 20 });
			store.endStroke();
		});

		await waitFor(() => {
			expect(useAppStore.getState().session?.currentStrokeIndex).toBe(1);
		});

		// Clear the session
		const clearButton = screen.getByLabelText("Clear drawing");
		fireEvent.click(clearButton);

		// Progress should reset
		await waitFor(() => {
			expect(useAppStore.getState().session?.currentStrokeIndex).toBe(0);
		});

		// Progress indicator should still show Stroke 1 of 1 (but reset)
		expect(screen.getByText(/Stroke 1 of 1/i)).toBeInTheDocument();
	});

	it("should preserve character template when clearing session", async () => {
		render(<AppLayout />);

		// Navigate to tracing screen
		act(() => {
			useAppStore.getState().selectCategory("number");
		});

		await waitFor(() => {
			expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
		});

		const characterButton = screen.getByText("0");
		fireEvent.click(characterButton);

		await waitFor(() => {
			expect(screen.getByText(/Trace:/i)).toBeInTheDocument();
		});

		const originalCharacter = useAppStore.getState().currentCharacter;
		const originalTemplate = useAppStore.getState().session?.template;

		// Clear the session
		const clearButton = screen.getByLabelText("Clear drawing");
		fireEvent.click(clearButton);

		// Template should be preserved
		await waitFor(() => {
			expect(useAppStore.getState().session?.template).toEqual(
				originalTemplate,
			);
			expect(useAppStore.getState().currentCharacter).toEqual(
				originalCharacter,
			);
		});
	});

	it("should create new timestamp after clearing", async () => {
		render(<AppLayout />);

		// Navigate to tracing screen
		act(() => {
			useAppStore.getState().selectCategory("number");
		});

		await waitFor(() => {
			expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
		});

		const characterButton = screen.getByText("0");
		fireEvent.click(characterButton);

		await waitFor(() => {
			expect(screen.getByText(/Trace:/i)).toBeInTheDocument();
		});

		const originalStartTime = useAppStore.getState().session?.startedAt || 0;

		// Wait a bit to ensure timestamp difference
		await new Promise((resolve) => setTimeout(resolve, 10));

		// Clear the session
		const clearButton = screen.getByLabelText("Clear drawing");
		fireEvent.click(clearButton);

		// New timestamps should be created
		await waitFor(() => {
			const newStartTime = useAppStore.getState().session?.startedAt || 0;
			expect(newStartTime).toBeGreaterThan(originalStartTime);
		});
	});

	it("should keep Next button enabled after clearing session", async () => {
		render(<AppLayout />);

		// Navigate to tracing screen
		act(() => {
			useAppStore.getState().selectCategory("number");
		});

		await waitFor(() => {
			expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
		});

		const characterButton = screen.getByText("0");
		fireEvent.click(characterButton);

		await waitFor(() => {
			expect(screen.getByText(/Trace:/i)).toBeInTheDocument();
		});

		// Next button should be enabled (no completion required)
		expect(screen.getByLabelText("Next character")).not.toBeDisabled();

		// Clear the session
		const clearButton = screen.getByLabelText("Clear drawing");
		fireEvent.click(clearButton);

		// Next button should still be enabled
		await waitFor(() => {
			expect(screen.getByLabelText("Next character")).not.toBeDisabled();
		});
	});
});
