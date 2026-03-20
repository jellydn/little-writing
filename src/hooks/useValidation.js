/**
 * Real-time stroke validation hook
 *
 * Provides stroke validation functionality using point-to-segment
 * distance algorithm. Wraps strokeValidator utility with React
 * hook interface for use in tracing components.
 *
 * Reference: specs/001-handwriting-tracing/contracts/ui-contracts.md
 * Task: T022
 */
import { useMemo } from 'react';
import { VALIDATION_CONFIG } from '../styles/theme';
import { validateStroke as validateStrokeUtil, pointToSegmentDistance, } from '../lib/canvas/strokeValidator';
/**
 * Calculates minimum distance from a point to any segment in a path
 *
 * Uses point-to-segment distance algorithm to find the closest point
 * on any segment of the guide path.
 *
 * @param point - The point to check
 * @param path - The stroke path containing guide points
 * @param tolerance - Maximum distance to be considered "within tolerance"
 * @returns true if point is within tolerance of the path
 */
function isPointWithinTolerance(point, path, tolerance) {
    const guidePoints = path.guidePoints;
    // Need at least 2 points to form a segment
    if (guidePoints.length < 2) {
        // If only one point, check distance to that point
        if (guidePoints.length === 1) {
            const dx = point.x - guidePoints[0].x;
            const dy = point.y - guidePoints[0].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance <= tolerance;
        }
        // No points, cannot be within tolerance
        return false;
    }
    // Check distance to each segment in the guide path
    for (let i = 0; i < guidePoints.length - 1; i++) {
        const segmentStart = guidePoints[i];
        const segmentEnd = guidePoints[i + 1];
        const dist = pointToSegmentDistance(point, segmentStart, segmentEnd);
        if (dist <= tolerance) {
            return true;
        }
    }
    return false;
}
/**
 * Hook for real-time stroke validation
 *
 * Provides validation functions for checking stroke accuracy and
 * real-time point-in-tolerance checks during drawing.
 *
 * @param config - Validation configuration (uses defaults from VALIDATION_CONFIG if not provided)
 * @returns Validation functions and state
 *
 * @example
 * ```tsx
 * const { validateStroke, isWithinTolerance } = useValidation({
 *   tolerancePx: 25,
 *   minAccuracy: 0.7
 * });
 *
 * // Validate complete stroke
 * const result = validateStroke(userStroke, guidePath);
 * if (result.isCorrect) {
 *   // Show success feedback
 * }
 *
 * // Real-time check during drawing
 * const onPointMove = (point: Point) => {
 *   if (!isWithinTolerance(point, currentGuidePath)) {
 *     // Show warning that user is straying from path
 *   }
 * };
 * ```
 */
export function useValidation(config = {}) {
    // Merge provided config with defaults
    const validationConfig = useMemo(() => ({
        tolerancePx: config.tolerancePx ?? VALIDATION_CONFIG.TOLERANCE_PX,
        minAccuracy: config.minAccuracy ?? VALIDATION_CONFIG.MIN_ACCURACY,
    }), [config.tolerancePx, config.minAccuracy]);
    /**
     * Validates a complete stroke against a guide path
     *
     * Wraps the utility function to pass configuration parameters.
     * Returns accuracy percentage and boolean validity.
     *
     * @param stroke - The user-drawn stroke to validate
     * @param guide - The guide path to validate against
     * @returns Validation result with accuracy and feedback color
     */
    const validateStroke = useMemo(() => (stroke, guide) => {
        return validateStrokeUtil(stroke.points, guide);
    }, []);
    /**
     * Checks if a single point is within tolerance of a guide path
     *
     * Useful for real-time feedback during drawing. Can be called
     * on each pointer move event to provide immediate visual feedback
     * when the user strays from the guide path.
     *
     * @param point - The point to check
     * @param path - The guide path to check against
     * @returns true if the point is within tolerance distance of the path
     */
    const isWithinTolerance = useMemo(() => (point, path) => {
        return isPointWithinTolerance(point, path, validationConfig.tolerancePx);
    }, [validationConfig.tolerancePx]);
    return {
        validateStroke,
        isWithinTolerance,
    };
}
