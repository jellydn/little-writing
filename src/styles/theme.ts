/**
 * Theme constants for the Kids Handwriting Tracing App
 *
 * Provides centralized configuration for colors, UI dimensions,
 * and validation parameters. All objects use `as const` for
 * type safety and immutability.
 */

export const COLORS = {
  guide: 'rgba(150, 150, 150, 0.5)' as const,
  correct: '#4CAF50' as const,
  incorrect: '#FF5252' as const,
  highlight: '#2196F3' as const,
  background: '#FFFFFF' as const,
  // Button colors - bright and child-friendly
  primary: '#FF6B6B',
  primaryHover: '#FF5252',
  primaryActive: '#E03E3E',
  secondary: '#4ECDC4',
  secondaryHover: '#26B5AB',
  secondaryActive: '#1A9E96',
  outline: '#FFE66D',
  outlineHover: '#FFD93D',
  outlineActive: '#F4C430',
  outlineBorder: '#FFB74D',
  text: '#FFFFFF',
  textDark: '#2D3436',
} as const;

export const UI_CONFIG = {
  MIN_TOUCH_TARGET: 44,
  CANVAS_PADDING: 40,
  GUIDE_LINE_WIDTH: 8,
  USER_STROKE_WIDTH: 12,
} as const;

export const VALIDATION_CONFIG = {
  TOLERANCE_PX: 25,
  MIN_ACCURACY: 0.7,
  MIN_STROKE_LENGTH: 20,
  SIMPLIFICATION_TOLERANCE: 2,
} as const;
