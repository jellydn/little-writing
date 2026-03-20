/**
 * Unit tests for touchHandler.ts
 *
 * Tests pointer event handling, palm rejection, and stroke lifecycle
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	createPointerHandlers,
	type PointerHandlers,
	type StrokeCallbacks,
} from "@/lib/canvas/touchHandler";

describe("createPointerHandlers", () => {
	let mockCallbacks: StrokeCallbacks;
	let handlers: PointerHandlers;
	let createMockTarget: () => HTMLElement & {
		setPointerCapture: ReturnType<typeof vi.fn>;
		releasePointerCapture: ReturnType<typeof vi.fn>;
	};
	let createMockPointerEvent: (
		type: string,
		props: {
			pointerId?: number;
			pointerType?: string;
			width?: number;
			height?: number;
			offsetX?: number;
			offsetY?: number;
			pressure?: number;
			target?: HTMLElement;
		},
	) => PointerEvent;

	beforeEach(() => {
		mockCallbacks = {
			onStrokeStart: vi.fn(),
			onStrokeMove: vi.fn(),
			onStrokeEnd: vi.fn(),
		};
		handlers = createPointerHandlers(mockCallbacks);

		// Helper to create a mock target element with pointer capture methods
		createMockTarget = (): HTMLElement & {
			setPointerCapture: ReturnType<typeof vi.fn>;
			releasePointerCapture: ReturnType<typeof vi.fn>;
		} => {
			const mockTarget = document.createElement(
				"div",
			) as unknown as HTMLElement & {
				setPointerCapture: ReturnType<typeof vi.fn>;
				releasePointerCapture: ReturnType<typeof vi.fn>;
			};
			mockTarget.setPointerCapture = vi.fn();
			mockTarget.releasePointerCapture = vi.fn();
			return mockTarget;
		};

		// Helper to create a mock PointerEvent
		createMockPointerEvent = (
			type: string,
			props: {
				pointerId?: number;
				pointerType?: string;
				width?: number;
				height?: number;
				offsetX?: number;
				offsetY?: number;
				pressure?: number;
				target?: HTMLElement;
			} = {},
		): PointerEvent => {
			const mockTarget = props.target ?? createMockTarget();

			const eventInit = {
				pointerId: props.pointerId ?? 1,
				pointerType: props.pointerType ?? "mouse",
				width: props.width ?? 10,
				height: props.height ?? 10,
				pressure: props.pressure ?? 0.5,
				bubbles: true,
				cancelable: true,
			};

			// Create the event using the mocked PointerEvent
			const event = new PointerEvent(type, eventInit);

			// Override properties that need custom values
			Object.defineProperty(event, "offsetX", {
				value: props.offsetX ?? 0,
				writable: false,
				configurable: true,
			});
			Object.defineProperty(event, "offsetY", {
				value: props.offsetY ?? 0,
				writable: false,
				configurable: true,
			});
			Object.defineProperty(event, "target", {
				value: mockTarget,
				writable: false,
				configurable: true,
			});

			// Mock preventDefault
			event.preventDefault = vi.fn();

			return event;
		};
	});

	describe("onPointerDown", () => {
		it("should call onStrokeStart with correct point", () => {
			const event = createMockPointerEvent("pointerdown", {
				offsetX: 100,
				offsetY: 200,
			});

			handlers.onPointerDown(event);

			expect(mockCallbacks.onStrokeStart).toHaveBeenCalledWith({
				x: 100,
				y: 200,
			});
			expect(event.preventDefault).toHaveBeenCalled();
		});

		it("should call setPointerCapture", () => {
			const mockTarget = createMockTarget();
			const event = createMockPointerEvent("pointerdown", {
				target: mockTarget,
			});

			handlers.onPointerDown(event);

			expect(mockTarget.setPointerCapture).toHaveBeenCalledWith(
				event.pointerId,
			);
		});

		it("should reject palm contact (large touch area)", () => {
			const event = createMockPointerEvent("pointerdown", {
				width: 60,
				height: 60,
			});

			handlers.onPointerDown(event);

			expect(mockCallbacks.onStrokeStart).not.toHaveBeenCalled();
			expect(event.preventDefault).toHaveBeenCalled();
		});

		it("should accept stylus input", () => {
			const event = createMockPointerEvent("pointerdown", {
				pointerType: "pen",
				offsetX: 50,
				offsetY: 50,
			});

			handlers.onPointerDown(event);

			expect(mockCallbacks.onStrokeStart).toHaveBeenCalledWith({
				x: 50,
				y: 50,
			});
		});

		it("should accept mouse input", () => {
			const event = createMockPointerEvent("pointerdown", {
				pointerType: "mouse",
				offsetX: 10,
				offsetY: 10,
			});

			handlers.onPointerDown(event);

			expect(mockCallbacks.onStrokeStart).toHaveBeenCalledWith({
				x: 10,
				y: 10,
			});
		});

		it("should accept touch input (small contact area)", () => {
			const event = createMockPointerEvent("pointerdown", {
				pointerType: "touch",
				width: 30,
				height: 30,
			});

			handlers.onPointerDown(event);

			expect(mockCallbacks.onStrokeStart).toHaveBeenCalled();
		});
	});

	describe("onPointerMove", () => {
		it("should not call onStrokeMove if pointer is not down", () => {
			const event = createMockPointerEvent("pointermove", {
				offsetX: 100,
				offsetY: 200,
			});

			handlers.onPointerMove(event);

			expect(mockCallbacks.onStrokeMove).not.toHaveBeenCalled();
		});

		it("should not call onStrokeMove for secondary pointer", () => {
			const downEvent = createMockPointerEvent("pointerdown", { pointerId: 1 });
			handlers.onPointerDown(downEvent);

			const moveEvent = createMockPointerEvent("pointermove", {
				pointerId: 2, // Different pointer
			});

			handlers.onPointerMove(moveEvent);

			expect(mockCallbacks.onStrokeMove).not.toHaveBeenCalled();
		});

		it("should require minimum movement before calling onStrokeMove", () => {
			const downEvent = createMockPointerEvent("pointerdown", {
				pointerId: 1,
				offsetX: 100,
				offsetY: 100,
			});
			handlers.onPointerDown(downEvent);

			// Small movement (< 20px)
			const moveEvent = createMockPointerEvent("pointermove", {
				pointerId: 1,
				offsetX: 110,
				offsetY: 105,
			});

			handlers.onPointerMove(moveEvent);

			expect(mockCallbacks.onStrokeMove).not.toHaveBeenCalled();
		});

		it("should call onStrokeMove after minimum movement threshold", () => {
			const downEvent = createMockPointerEvent("pointerdown", {
				pointerId: 1,
				offsetX: 100,
				offsetY: 100,
			});
			handlers.onPointerDown(downEvent);

			// Large movement (> 20px)
			const moveEvent = createMockPointerEvent("pointermove", {
				pointerId: 1,
				offsetX: 150,
				offsetY: 150,
			});

			handlers.onPointerMove(moveEvent);

			expect(mockCallbacks.onStrokeMove).toHaveBeenCalledWith({
				x: 150,
				y: 150,
			});
		});

		it("should continue calling onStrokeMove after threshold is met", () => {
			const downEvent = createMockPointerEvent("pointerdown", {
				pointerId: 1,
				offsetX: 100,
				offsetY: 100,
			});
			handlers.onPointerDown(downEvent);

			// First move - meets threshold
			const moveEvent1 = createMockPointerEvent("pointermove", {
				pointerId: 1,
				offsetX: 150,
				offsetY: 150,
			});
			handlers.onPointerMove(moveEvent1);

			// Second move - small movement but should still work
			const moveEvent2 = createMockPointerEvent("pointermove", {
				pointerId: 1,
				offsetX: 155,
				offsetY: 155,
			});
			handlers.onPointerMove(moveEvent2);

			expect(mockCallbacks.onStrokeMove).toHaveBeenCalledTimes(2);
		});
	});

	describe("onPointerUp", () => {
		it("should not call onStrokeEnd if pointer was not down", () => {
			const event = createMockPointerEvent("pointerup", { pointerId: 1 });

			handlers.onPointerUp(event);

			expect(mockCallbacks.onStrokeEnd).not.toHaveBeenCalled();
		});

		it("should not call onStrokeEnd for secondary pointer", () => {
			const downEvent = createMockPointerEvent("pointerdown", { pointerId: 1 });
			handlers.onPointerDown(downEvent);

			const upEvent = createMockPointerEvent("pointerup", { pointerId: 2 });

			handlers.onPointerUp(upEvent);

			expect(mockCallbacks.onStrokeEnd).not.toHaveBeenCalled();
		});

		it("should not call onStrokeEnd if minimum movement not met", () => {
			const downEvent = createMockPointerEvent("pointerdown", {
				pointerId: 1,
				offsetX: 100,
				offsetY: 100,
			});
			handlers.onPointerDown(downEvent);

			// Small movement (< 20px)
			const moveEvent = createMockPointerEvent("pointermove", {
				pointerId: 1,
				offsetX: 110,
				offsetY: 105,
			});
			handlers.onPointerMove(moveEvent);

			const upEvent = createMockPointerEvent("pointerup", { pointerId: 1 });
			handlers.onPointerUp(upEvent);

			expect(mockCallbacks.onStrokeEnd).not.toHaveBeenCalled();
		});

		it("should call onStrokeEnd after valid stroke", () => {
			const downEvent = createMockPointerEvent("pointerdown", {
				pointerId: 1,
				offsetX: 100,
				offsetY: 100,
			});
			handlers.onPointerDown(downEvent);

			// Movement meeting threshold
			const moveEvent = createMockPointerEvent("pointermove", {
				pointerId: 1,
				offsetX: 150,
				offsetY: 150,
			});
			handlers.onPointerMove(moveEvent);

			const upEvent = createMockPointerEvent("pointerup", { pointerId: 1 });
			handlers.onPointerUp(upEvent);

			expect(mockCallbacks.onStrokeEnd).toHaveBeenCalled();
		});

		it("should call releasePointerCapture", () => {
			const mockTarget = createMockTarget();

			const downEvent = createMockPointerEvent("pointerdown", {
				pointerId: 1,
				target: mockTarget,
			});
			handlers.onPointerDown(downEvent);

			const moveEvent = createMockPointerEvent("pointermove", {
				pointerId: 1,
				offsetX: 200,
				offsetY: 100,
			});
			handlers.onPointerMove(moveEvent);

			const upEvent = createMockPointerEvent("pointerup", {
				pointerId: 1,
				target: mockTarget,
			});
			handlers.onPointerUp(upEvent);

			expect(mockTarget.releasePointerCapture).toHaveBeenCalledWith(1);
		});

		it("should handle releasePointerCapture errors gracefully", () => {
			const mockTarget = createMockTarget();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(mockTarget.releasePointerCapture as any) = vi.fn(() => {
				throw new Error("InvalidPointerId");
			});

			const downEvent = createMockPointerEvent("pointerdown", {
				pointerId: 1,
				target: mockTarget,
			});
			handlers.onPointerDown(downEvent);

			const moveEvent = createMockPointerEvent("pointermove", {
				pointerId: 1,
				offsetX: 200,
				offsetY: 100,
			});
			handlers.onPointerMove(moveEvent);

			const upEvent = createMockPointerEvent("pointerup", {
				pointerId: 1,
				target: mockTarget,
			});

			// Should not throw
			expect(() => handlers.onPointerUp(upEvent)).not.toThrow();
		});
	});

	describe("onPointerCancel", () => {
		it("should treat cancel same as up", () => {
			const downEvent = createMockPointerEvent("pointerdown", {
				pointerId: 1,
				offsetX: 100,
				offsetY: 100,
			});
			handlers.onPointerDown(downEvent);

			const moveEvent = createMockPointerEvent("pointermove", {
				pointerId: 1,
				offsetX: 200,
				offsetY: 100,
			});
			handlers.onPointerMove(moveEvent);

			const cancelEvent = createMockPointerEvent("pointercancel", {
				pointerId: 1,
			});
			handlers.onPointerCancel(cancelEvent);

			expect(mockCallbacks.onStrokeEnd).toHaveBeenCalled();
		});
	});

	describe("stroke lifecycle integration", () => {
		it("should handle complete stroke: down -> move -> up", () => {
			const downEvent = createMockPointerEvent("pointerdown", {
				pointerId: 1,
				offsetX: 100,
				offsetY: 100,
			});

			const moveEvent1 = createMockPointerEvent("pointermove", {
				pointerId: 1,
				offsetX: 200,
				offsetY: 100,
			});

			const moveEvent2 = createMockPointerEvent("pointermove", {
				pointerId: 1,
				offsetX: 300,
				offsetY: 100,
			});

			const upEvent = createMockPointerEvent("pointerup", { pointerId: 1 });

			handlers.onPointerDown(downEvent);
			handlers.onPointerMove(moveEvent1);
			handlers.onPointerMove(moveEvent2);
			handlers.onPointerUp(upEvent);

			expect(mockCallbacks.onStrokeStart).toHaveBeenCalledTimes(1);
			expect(mockCallbacks.onStrokeMove).toHaveBeenCalledTimes(2);
			expect(mockCallbacks.onStrokeEnd).toHaveBeenCalledTimes(1);
		});

		it("should reset state after stroke completion", () => {
			const downEvent1 = createMockPointerEvent("pointerdown", {
				pointerId: 1,
				offsetX: 100,
				offsetY: 100,
			});
			const moveEvent1 = createMockPointerEvent("pointermove", {
				pointerId: 1,
				offsetX: 200,
				offsetY: 100,
			});
			const upEvent1 = createMockPointerEvent("pointerup", { pointerId: 1 });

			handlers.onPointerDown(downEvent1);
			handlers.onPointerMove(moveEvent1);
			handlers.onPointerUp(upEvent1);

			// New stroke should work
			const downEvent2 = createMockPointerEvent("pointerdown", {
				pointerId: 2,
				offsetX: 50,
				offsetY: 50,
			});
			const moveEvent2 = createMockPointerEvent("pointermove", {
				pointerId: 2,
				offsetX: 150,
				offsetY: 50,
			});
			const upEvent2 = createMockPointerEvent("pointerup", { pointerId: 2 });

			handlers.onPointerDown(downEvent2);
			handlers.onPointerMove(moveEvent2);
			handlers.onPointerUp(upEvent2);

			expect(mockCallbacks.onStrokeStart).toHaveBeenCalledTimes(2);
			expect(mockCallbacks.onStrokeMove).toHaveBeenCalledTimes(2);
			expect(mockCallbacks.onStrokeEnd).toHaveBeenCalledTimes(2);
		});

		it("should reject secondary pointer during active stroke", () => {
			const downEvent1 = createMockPointerEvent("pointerdown", {
				pointerId: 1,
				offsetX: 100,
				offsetY: 100,
			});
			handlers.onPointerDown(downEvent1);

			const downEvent2 = createMockPointerEvent("pointerdown", {
				pointerId: 2,
				offsetX: 200,
				offsetY: 200,
			});
			handlers.onPointerDown(downEvent2);

			// Second pointer should be rejected
			expect(mockCallbacks.onStrokeStart).toHaveBeenCalledTimes(1);
		});
	});

	describe("palm rejection edge cases", () => {
		it("should accept contact when only width exceeds threshold", () => {
			const event = createMockPointerEvent("pointerdown", {
				width: 60,
				height: 30, // Only one dimension exceeds
			});

			handlers.onPointerDown(event);

			expect(mockCallbacks.onStrokeStart).toHaveBeenCalled();
		});

		it("should accept contact when only height exceeds threshold", () => {
			const event = createMockPointerEvent("pointerdown", {
				width: 30,
				height: 60, // Only one dimension exceeds
			});

			handlers.onPointerDown(event);

			expect(mockCallbacks.onStrokeStart).toHaveBeenCalled();
		});

		it("should reject contact when both dimensions exceed threshold", () => {
			const event = createMockPointerEvent("pointerdown", {
				width: 55,
				height: 55, // Both exceed 50
			});

			handlers.onPointerDown(event);

			expect(mockCallbacks.onStrokeStart).not.toHaveBeenCalled();
		});
	});
});
