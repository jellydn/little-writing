/**
 * Character data exports for the Handwriting Tracing App
 *
 * This file provides access to all character templates organized by category.
 * TODO: Replace placeholder data with actual JSON imports from assets/characters/
 *
 * Reference: specs/001-handwriting-tracing/data-model.md
 */

import type {
  Category,
  CharacterTemplate,
  CategoryCollection,
  Point,
  StrokePath,
  Bounds,
} from '../../types/index';

// ============================================================================
// PLACEHOLDER CHARACTER DATA
// ============================================================================
// TODO: Replace these with actual imports from JSON files
// When all 62 character JSON files are created, import them like:
// import char0 from '../../../assets/characters/numbers/0.json';
// ============================================================================

/**
 * Helper to create stroke paths for placeholder data
 */
function createStrokePath(
  id: number,
  path: string,
  startPoint: Point,
  endPoint: Point,
  guidePoints: Point[]
): StrokePath {
  return {
    id,
    path,
    startPoint,
    endPoint,
    guidePoints,
  };
}

/**
 * Common bounds for placeholder characters (100x100 viewBox)
 */
const DEFAULT_BOUNDS: Bounds = {
  width: 100,
  height: 100,
  viewBox: '0 0 100 100',
};

// ============================================================================
// NUMBER CHARACTERS (0-9) - Placeholder Samples
// ============================================================================

/**
 * Character "0" - Single oval stroke
 */
const CHARACTER_0: CharacterTemplate = {
  character: '0',
  category: 'number',
  displayName: 'Zero',
  bounds: DEFAULT_BOUNDS,
  strokes: [
    createStrokePath(
      1,
      'M 50 10 C 80 10 90 30 90 50 C 90 70 80 90 50 90 C 20 90 10 70 10 50 C 10 30 20 10 50 10',
      { x: 50, y: 10 },
      { x: 50, y: 90 },
      [
        { x: 50, y: 10 },
        { x: 65, y: 12 },
        { x: 80, y: 20 },
        { x: 88, y: 35 },
        { x: 90, y: 50 },
        { x: 88, y: 65 },
        { x: 80, y: 80 },
        { x: 65, y: 88 },
        { x: 50, y: 90 },
        { x: 35, y: 88 },
        { x: 20, y: 80 },
        { x: 12, y: 65 },
        { x: 10, y: 50 },
        { x: 12, y: 35 },
        { x: 20, y: 20 },
        { x: 35, y: 12 },
        { x: 50, y: 10 },
      ]
    ),
  ],
  totalStrokes: 1,
};

/**
 * Character "1" - Single vertical stroke
 */
const CHARACTER_1: CharacterTemplate = {
  character: '1',
  category: 'number',
  displayName: 'One',
  bounds: DEFAULT_BOUNDS,
  strokes: [
    createStrokePath(1, 'M 50 20 L 50 80', { x: 50, y: 20 }, { x: 50, y: 80 }, [
      { x: 50, y: 20 },
      { x: 50, y: 35 },
      { x: 50, y: 50 },
      { x: 50, y: 65 },
      { x: 50, y: 80 },
    ]),
  ],
  totalStrokes: 1,
};

// ============================================================================
// UPPERCASE LETTERS (A-Z) - Placeholder Samples
// ============================================================================

/**
 * Character "A" - Two diagonal strokes with crossbar
 */
const CHARACTER_A: CharacterTemplate = {
  character: 'A',
  category: 'uppercase',
  displayName: 'Ay',
  bounds: DEFAULT_BOUNDS,
  strokes: [
    // Left diagonal
    createStrokePath(1, 'M 30 80 L 50 20', { x: 30, y: 80 }, { x: 50, y: 20 }, [
      { x: 30, y: 80 },
      { x: 35, y: 65 },
      { x: 42, y: 42 },
      { x: 50, y: 20 },
    ]),
    // Right diagonal
    createStrokePath(2, 'M 50 20 L 70 80', { x: 50, y: 20 }, { x: 70, y: 80 }, [
      { x: 50, y: 20 },
      { x: 58, y: 42 },
      { x: 65, y: 65 },
      { x: 70, y: 80 },
    ]),
    // Crossbar
    createStrokePath(3, 'M 38 55 L 62 55', { x: 38, y: 55 }, { x: 62, y: 55 }, [
      { x: 38, y: 55 },
      { x: 44, y: 55 },
      { x: 50, y: 55 },
      { x: 56, y: 55 },
      { x: 62, y: 55 },
    ]),
  ],
  totalStrokes: 3,
};

// ============================================================================
// LOWERCASE LETTERS (a-z) - Placeholder Samples
// ============================================================================

/**
 * Character "a" - Circle with vertical line
 */
const CHARACTER_a: CharacterTemplate = {
  character: 'a',
  category: 'lowercase',
  displayName: 'ah',
  bounds: DEFAULT_BOUNDS,
  strokes: [
    // Circle part
    createStrokePath(
      1,
      'M 50 35 C 70 35 75 50 75 60 C 75 75 60 80 50 80 C 35 80 25 70 25 60 C 25 45 35 35 50 35',
      { x: 50, y: 35 },
      { x: 50, y: 80 },
      [
        { x: 50, y: 35 },
        { x: 58, y: 35 },
        { x: 68, y: 40 },
        { x: 75, y: 50 },
        { x: 75, y: 60 },
        { x: 70, y: 72 },
        { x: 60, y: 80 },
        { x: 50, y: 80 },
        { x: 38, y: 78 },
        { x: 28, y: 70 },
        { x: 25, y: 60 },
        { x: 28, y: 48 },
        { x: 38, y: 38 },
        { x: 50, y: 35 },
      ]
    ),
    // Vertical line
    createStrokePath(2, 'M 50 20 L 50 45', { x: 50, y: 20 }, { x: 50, y: 45 }, [
      { x: 50, y: 20 },
      { x: 50, y: 30 },
      { x: 50, y: 40 },
      { x: 50, y: 45 },
    ]),
  ],
  totalStrokes: 2,
};

// ============================================================================
// CATEGORY COLLECTIONS
// ============================================================================

/**
 * All available categories
 */
export const ALL_CATEGORIES: Category[] = ['number', 'uppercase', 'lowercase'];

/**
 * Character templates organized by category
 * TODO: Populate with all 62 characters when JSON files are created
 */
export const CHARACTERS_BY_CATEGORY: Record<Category, CharacterTemplate[]> = {
  number: [
    CHARACTER_0,
    CHARACTER_1,
    // TODO: Add characters 2-9 when JSON files are created
  ],
  uppercase: [
    CHARACTER_A,
    // TODO: Add characters B-Z when JSON files are created
  ],
  lowercase: [
    CHARACTER_a,
    // TODO: Add characters b-z when JSON files are created
  ],
};

/**
 * Category metadata with display names
 */
const CATEGORY_METADATA: Record<Category, string> = {
  number: 'Numbers',
  uppercase: 'Uppercase',
  lowercase: 'Lowercase',
};

// ============================================================================
// PUBLIC API FUNCTIONS
// ============================================================================

/**
 * Get a specific character template by character and category
 *
 * @param character - The character to retrieve (e.g., "A", "5", "a")
 * @param category - The category the character belongs to
 * @returns The character template
 * @throws Error if character is not found in the specified category
 *
 * @example
 * const template = getCharacter('A', 'uppercase');
 */
export function getCharacter(
  character: string,
  category: Category
): CharacterTemplate {
  const characters = CHARACTERS_BY_CATEGORY[category];
  const template = characters.find((c) => c.character === character);

  if (!template) {
    throw new Error(
      `Character "${character}" not found in category "${category}"`
    );
  }

  return template;
}

/**
 * Get all characters in a category with metadata
 *
 * @param category - The category to retrieve
 * @returns A category collection with display name and characters
 *
 * @example
 * const numbers = getCategory('number');
 * // { id: 'number', displayName: 'Numbers', characters: [...] }
 */
export function getCategory(category: Category): CategoryCollection {
  return {
    id: category,
    displayName: CATEGORY_METADATA[category],
    characters: CHARACTERS_BY_CATEGORY[category],
  };
}

/**
 * Get all category collections
 *
 * @returns Array of all category collections
 *
 * @example
 * const allCategories = getAllCategories();
 * // [
 * //   { id: 'number', displayName: 'Numbers', characters: [...] },
 * //   { id: 'uppercase', displayName: 'Uppercase', characters: [...] },
 * //   { id: 'lowercase', displayName: 'Lowercase', characters: [...] }
 * // ]
 */
export function getAllCategories(): CategoryCollection[] {
  return ALL_CATEGORIES.map((category) => getCategory(category));
}

/**
 * Get the total count of characters across all categories
 *
 * @returns Total number of character templates
 */
export function getTotalCharacterCount(): number {
  return ALL_CATEGORIES.reduce(
    (total, category) => total + CHARACTERS_BY_CATEGORY[category].length,
    0
  );
}

/**
 * Check if a character exists in the given category
 *
 * @param character - The character to check
 * @param category - The category to check in
 * @returns true if the character exists in the category
 */
export function hasCharacter(character: string, category: Category): boolean {
  return CHARACTERS_BY_CATEGORY[category].some(
    (c) => c.character === character
  );
}

/**
 * Get the next character in a category (with wraparound)
 *
 * @param currentCharacter - Current character identifier
 * @param category - Category to navigate within
 * @returns Next character template
 */
export function getNextCharacter(
  currentCharacter: string,
  category: Category
): CharacterTemplate {
  const characters = CHARACTERS_BY_CATEGORY[category];
  const currentIndex = characters.findIndex(
    (c) => c.character === currentCharacter
  );
  const nextIndex = (currentIndex + 1) % characters.length;
  return characters[nextIndex];
}

/**
 * Get the previous character in a category (stops at first character)
 *
 * @param currentCharacter - Current character identifier
 * @param category - Category to navigate within
 * @returns Previous character template (stops at first, no wraparound)
 */
export function getPreviousCharacter(
  currentCharacter: string,
  category: Category
): CharacterTemplate {
  const characters = CHARACTERS_BY_CATEGORY[category];
  const currentIndex = characters.findIndex(
    (c) => c.character === currentCharacter
  );
  // Stop at first character instead of wrapping around
  const prevIndex = currentIndex === 0 ? 0 : currentIndex - 1;
  return characters[prevIndex];
}
