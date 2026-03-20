/**
 * Configuration constants for touch handling
 */
const CONFIG = {
    PALM_REJECTION_SIZE: 50, // px - ignore touches larger than this
    MIN_STROKE_LENGTH: 20, // px - minimum movement to count as stroke
};
/**
 * Creates pointer event handlers for canvas touch/stylus input
 *
 * Features:
 * - Stylus detection via pointerType === "pen"
 * - Palm rejection (ignores contacts >50x50px)
 * - Minimum stroke length requirement (20px)
 * - Multi-touch handling (ignores secondary pointers)
 *
 * @param callbacks - Stroke lifecycle functions
 * @returns Pointer event handlers for canvas
 *
 * @example
 * ```ts
 * const handlers = createPointerHandlers({
 *   onStrokeStart: (point) => console.log('Start', point),
 *   onStrokeMove: (point) => console.log('Move', point),
 *   onStrokeEnd: () => console.log('End'),
 * });
 *
 * canvas.addEventListener('pointerdown', handlers.onPointerDown);
 * canvas.addEventListener('pointermove', handlers.onPointerMove);
 * canvas.addEventListener('pointerup', handlers.onPointerUp);
 * canvas.addEventListener('pointercancel', handlers.onPointerCancel);
 * ```
 */
export function createPointerHandlers(callbacks) {
    const state = {
        isPointerDown: false,
        currentPointerId: null,
        startPoint: null,
        hasMovedEnough: false,
    };
    /**
     * Calculates Euclidean distance between two points
     */
    function distance(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * Checks if a pointer event should be rejected (palm or secondary touch)
     */
    function shouldRejectPointer(event) {
        // Palm rejection: ignore large contact areas
        if (event.width > CONFIG.PALM_REJECTION_SIZE &&
            event.height > CONFIG.PALM_REJECTION_SIZE) {
            return true;
        }
        // Multi-touch: ignore secondary pointers during drawing
        if (state.isPointerDown &&
            state.currentPointerId !== null &&
            event.pointerId !== state.currentPointerId) {
            return true;
        }
        return false;
    }
    function onPointerDown(event) {
        // Prevent default touch actions like scrolling
        event.preventDefault();
        // Check for palm rejection or multi-touch
        if (shouldRejectPointer(event)) {
            return;
        }
        // Detect input type (stylus vs finger vs mouse)
        const _isStylus = event.pointerType === 'pen';
        const _pressure = event.pressure;
        // Initialize stroke state
        state.isPointerDown = true;
        state.currentPointerId = event.pointerId;
        state.startPoint = { x: event.offsetX, y: event.offsetY };
        state.hasMovedEnough = false;
        // Capture pointer for tracking outside canvas
        event.target.setPointerCapture(event.pointerId);
        // Notify stroke start
        callbacks.onStrokeStart({ x: event.offsetX, y: event.offsetY });
    }
    function onPointerMove(event) {
        event.preventDefault();
        // Only handle the current active pointer
        if (!state.isPointerDown ||
            state.currentPointerId === null ||
            event.pointerId !== state.currentPointerId) {
            return;
        }
        const currentPoint = { x: event.offsetX, y: event.offsetY };
        // Check minimum stroke length requirement
        if (!state.hasMovedEnough && state.startPoint) {
            const moveDistance = distance(state.startPoint, currentPoint);
            if (moveDistance >= CONFIG.MIN_STROKE_LENGTH) {
                state.hasMovedEnough = true;
            }
            else {
                // Not moved enough yet, don't process this point
                return;
            }
        }
        // Notify stroke movement
        callbacks.onStrokeMove(currentPoint);
    }
    function onPointerEnd(event) {
        event.preventDefault();
        // Only handle the current active pointer
        if (!state.isPointerDown ||
            state.currentPointerId === null ||
            event.pointerId !== state.currentPointerId) {
            return;
        }
        // Release pointer capture
        try {
            event.target.releasePointerCapture(event.pointerId);
        }
        catch {
            // Ignore errors if pointer was already released
        }
        // Only complete stroke if it met minimum length requirement
        if (state.hasMovedEnough) {
            callbacks.onStrokeEnd();
        }
        // Reset state
        state.isPointerDown = false;
        state.currentPointerId = null;
        state.startPoint = null;
        state.hasMovedEnough = false;
    }
    function onPointerCancel(event) {
        // Treat cancel same as up
        onPointerEnd(event);
    }
    return {
        onPointerDown,
        onPointerMove,
        onPointerUp: onPointerEnd,
        onPointerCancel,
    };
}
