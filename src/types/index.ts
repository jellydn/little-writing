/**
 * Core type definitions for the Handwriting Tracing App
 *
 * Based on specs/001-handwriting-tracing/data-model.md
 */

/**
 * Represents a 2D coordinate point
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Character categories for organization
 */
export type Category = 'number' | 'uppercase' | 'lowercase';

/**
 * Bounding box for SVG character templates
 */
export interface Bounds {
  width: number;
  height: number;
  viewBox: string;
}

/**
 * A single stroke path in a character template
 */
export interface StrokePath {
  id: number;
  path: string;
  startPoint: Point;
  endPoint: Point;
  guidePoints: Point[];
}

/**
 * Complete template for a character with stroke order data
 */
export interface CharacterTemplate {
  character: string;
  category: Category;
  displayName?: string;
  bounds: Bounds;
  strokes: StrokePath[];
  totalStrokes: number;
}

/**
 * A user-drawn stroke
 */
export interface Stroke {
  id: number;
  points: Point[];
  isComplete: boolean;
  isValid: boolean | null;
  accuracy: number;
}

/**
 * Active tracing session for a character
 */
export interface DrawingSession {
  template: CharacterTemplate;
  strokes: Stroke[];
  currentStrokeIndex: number;
  isComplete: boolean;
  startedAt: number;
  lastActivityAt: number;
}

/**
 * Category collection for navigation
 */
export interface CategoryCollection {
  id: Category;
  displayName: string;
  characters: CharacterTemplate[];
}

/**
 * App screen navigation states
 */
export type Screen = 'category-selection' | 'character-selection' | 'tracing';

/**
 * Global application store interface
 */
export interface AppStore {
  // State
  currentScreen: Screen;
  currentCategory: Category;
  currentCharacter: CharacterTemplate | null;
  session: DrawingSession | null;

  // Actions
  navigateToCategorySelection: () => void;
  selectCategory: (category: Category) => void;
  selectCharacter: (character: CharacterTemplate) => void;
  startStroke: (point: Point) => void;
  addStrokePoint: (point: Point) => void;
  endStroke: () => void;
  clearSession: () => void;
  nextCharacter: () => void;
  previousCharacter: () => void;
}
