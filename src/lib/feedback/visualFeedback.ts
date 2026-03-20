/**
 * Visual feedback utilities for stroke rendering and animations
 *
 * Provides color management and state transitions for visual feedback
 * during handwriting tracing validation.
 */

import { COLORS } from '../../styles/theme';

/**
 * Returns the appropriate stroke color based on validation state
 *
 * @param isValid - Whether the stroke passed validation
 * @returns Color string (green for valid, red for invalid)
 */
export function getStrokeFeedbackColor(isValid: boolean): string {
  return isValid ? COLORS.correct : COLORS.incorrect;
}

/**
 * Returns opacity value based on stroke state
 *
 * @param state - Current state of the stroke
 * @returns Opacity value between 0 and 1
 */
export function getStrokeOpacity(
  state: 'drawing' | 'complete' | 'validated'
): number {
  switch (state) {
    case 'drawing':
      return 0.6;
    case 'complete':
      return 0.8;
    case 'validated':
      return 1.0;
    default:
      return 1.0;
  }
}

/**
 * Returns the appropriate animation name based on validation result
 *
 * @param isValid - Whether the stroke passed validation
 * @returns Animation keyframe name ('success' | 'shake' | 'pulse')
 */
export function getFeedbackAnimation(isValid: boolean): string {
  if (isValid) {
    return 'success';
  }
  return 'shake';
}
