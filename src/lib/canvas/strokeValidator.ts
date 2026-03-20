/**
 * Stroke validation using point-to-segment distance algorithm
 *
 * Validates user-drawn strokes against guide paths by calculating
 * the minimum distance from each user point to the nearest segment
 * of the guide path.
 *
 * Reference: specs/001-handwriting-tracing/research.md section 2
 */

import { COLORS, VALIDATION_CONFIG } from '../../styles/theme';
import type { Point, StrokePath } from '../../types';

/**
 * Result of stroke validation
 */
export interface ValidationResult {
  /** Whether the stroke meets the minimum accuracy threshold */
  isCorrect: boolean;
  /** Accuracy score from 0 to 1 (1 = perfect) */
  accuracy: number;
  /** CSS color for feedback display */
  feedbackColor: string;
}

/**
 * Calculates the squared distance between two points
 * (avoids sqrt for performance when comparing distances)
 */
function distanceSquared(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return dx * dx + dy * dy;
}

/**
 * Calculates the actual distance between two points
 */
function distance(p1: Point, p2: Point): number {
  return Math.sqrt(distanceSquared(p1, p2));
}

/**
 * Finds the closest point on a line segment to a given point
 *
 * @param point - The point to find distance for
 * @param lineStart - Start point of the line segment
 * @param lineEnd - End point of the line segment
 * @returns The closest point on the segment
 */
function closestPointOnSegment(
  point: Point,
  lineStart: Point,
  lineEnd: Point
): Point {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;

  // If segment is a point, return that point
  if (dx === 0 && dy === 0) {
    return lineStart;
  }

  // Calculate projection parameter t
  // t represents where the closest point falls on the segment:
  // t = 0 -> at lineStart
  // t = 1 -> at lineEnd
  // t < 0 -> closest point is before lineStart
  // t > 1 -> closest point is after lineEnd
  const t =
    ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) /
    (dx * dx + dy * dy);

  // Clamp t to segment bounds [0, 1]
  const clampedT = Math.max(0, Math.min(1, t));

  // Calculate closest point on segment
  return {
    x: lineStart.x + clampedT * dx,
    y: lineStart.y + clampedT * dy,
  };
}

/**
 * Calculates the minimum distance from a point to a line segment
 *
 * Uses vector projection to find the closest point on the segment,
 * then returns the Euclidean distance to that point.
 *
 * Algorithm:
 * 1. Project point onto the line containing the segment
 * 2. Clamp projection to segment bounds
 * 3. Calculate distance to the clamped point
 *
 * @param point - The point to measure distance from
 * @param lineStart - Start point of the line segment
 * @param lineEnd - End point of the line segment
 * @returns Minimum distance from point to segment in pixels
 */
export function pointToSegmentDistance(
  point: Point,
  lineStart: Point,
  lineEnd: Point
): number {
  const closest = closestPointOnSegment(point, lineStart, lineEnd);
  return distance(point, closest);
}

/**
 * Calculates minimum distance from a point to any segment in a path
 *
 * @param point - The point to measure distance from
 * @param guidePath - The stroke path containing guide points
 * @returns Minimum distance to any segment in the path
 */
function pointToPathDistance(point: Point, guidePath: StrokePath): number {
  const guidePoints = guidePath.guidePoints;

  // Need at least 2 points to form a segment
  if (guidePoints.length < 2) {
    // If only one point, return distance to that point
    if (guidePoints.length === 1) {
      return distance(point, guidePoints[0]);
    }
    // No points, return maximum distance
    return Number.MAX_VALUE;
  }

  let minDistance = Number.MAX_VALUE;

  // Check distance to each segment in the guide path
  for (let i = 0; i < guidePoints.length - 1; i++) {
    const segmentStart = guidePoints[i];
    const segmentEnd = guidePoints[i + 1];
    const dist = pointToSegmentDistance(point, segmentStart, segmentEnd);
    minDistance = Math.min(minDistance, dist);

    // Early exit if we find a point very close to the path
    if (minDistance === 0) {
      return 0;
    }
  }

  return minDistance;
}

/**
 * Validates a user-drawn stroke against a guide path
 *
 * Algorithm:
 * 1. For each point in the user's stroke, calculate minimum distance to guide path
 * 2. Count points within tolerance distance
 * 3. Calculate accuracy as percentage of points within tolerance
 * 4. Return validation result based on accuracy threshold
 *
 * @param userPoints - Array of points from user's drawn stroke
 * @param guidePath - The guide stroke path to validate against
 * @returns Validation result with accuracy and feedback
 */
export function validateStroke(
  userPoints: Point[],
  guidePath: StrokePath
): ValidationResult {
  // Handle edge cases
  if (userPoints.length === 0) {
    return {
      isCorrect: false,
      accuracy: 0,
      feedbackColor: COLORS.incorrect,
    };
  }

  if (guidePath.guidePoints.length === 0) {
    // No guide points - cannot validate
    return {
      isCorrect: true,
      accuracy: 1,
      feedbackColor: COLORS.correct,
    };
  }

  const tolerance = VALIDATION_CONFIG.TOLERANCE_PX;
  let pointsWithinTolerance = 0;
  const distances: number[] = [];

  // Calculate distance for each user point
  for (const point of userPoints) {
    const dist = pointToPathDistance(point, guidePath);
    distances.push(dist);

    if (dist <= tolerance) {
      pointsWithinTolerance++;
    }
  }

  // Calculate accuracy (0 to 1)
  const accuracy = pointsWithinTolerance / userPoints.length;

  // Determine if stroke is correct based on minimum accuracy threshold
  const minAccuracy = VALIDATION_CONFIG.MIN_ACCURACY;
  const isCorrect = accuracy >= minAccuracy;

  // Select feedback color based on result
  const feedbackColor = isCorrect ? COLORS.correct : COLORS.incorrect;

  return {
    isCorrect,
    accuracy,
    feedbackColor,
  };
}

/**
 * Calculates the average deviation of a stroke from its guide path
 * Useful for detailed feedback and analytics
 *
 * @param userPoints - Array of points from user's drawn stroke
 * @param guidePath - The guide stroke path
 * @returns Average distance in pixels
 */
export function calculateAverageDeviation(
  userPoints: Point[],
  guidePath: StrokePath
): number {
  if (userPoints.length === 0 || guidePath.guidePoints.length === 0) {
    return 0;
  }

  let totalDistance = 0;

  for (const point of userPoints) {
    totalDistance += pointToPathDistance(point, guidePath);
  }

  return totalDistance / userPoints.length;
}

/**
 * Finds the worst deviation point in a stroke
 * Useful for highlighting where the user went wrong
 *
 * @param userPoints - Array of points from user's drawn stroke
 * @param guidePath - The guide stroke path
 * @returns The point with maximum distance from guide path
 */
export function findWorstDeviationPoint(
  userPoints: Point[],
  guidePath: StrokePath
): { point: Point; distance: number } | null {
  if (userPoints.length === 0 || guidePath.guidePoints.length === 0) {
    return null;
  }

  let maxDistance = 0;
  let worstPoint: Point | null = null;

  for (const point of userPoints) {
    const dist = pointToPathDistance(point, guidePath);
    if (dist > maxDistance) {
      maxDistance = dist;
      worstPoint = point;
    }
  }

  return worstPoint ? { point: worstPoint, distance: maxDistance } : null;
}
