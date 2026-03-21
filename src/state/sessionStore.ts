/**
 * Global app state management using Zustand
 *
 * Manages navigation, character selection, and drawing sessions
 * for the Handwriting Tracing App.
 *
 * Based on specs/001-handwriting-tracing/contracts/ui-contracts.md
 */

import { create } from 'zustand';
import { validateStroke } from '../lib/canvas/strokeValidator';
import {
  getNextCharacter,
  getPreviousCharacter,
} from '../lib/templates/characterData';
import type {
  AppStore,
  Category,
  CharacterTemplate,
  DrawingSession,
  Point,
  Screen,
  Stroke,
} from '../types';

/**
 * Creates a new drawing session for a character template
 */
function createSession(template: CharacterTemplate): DrawingSession {
  return {
    template,
    strokes: [],
    currentStrokeIndex: 0,
    isComplete: false,
    startedAt: Date.now(),
    lastActivityAt: Date.now(),
  };
}

/**
 * Creates a new stroke with an initial point
 */
function createStroke(id: number, startPoint: Point): Stroke {
  return {
    id,
    points: [startPoint],
    isComplete: false,
    isValid: null,
    accuracy: 0,
  };
}

/**
 * Global application state store
 */
export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  currentScreen: 'category-selection' as Screen,
  currentCategory: 'uppercase' as Category,
  currentCharacter: null,
  session: null,

  // Navigation actions
  navigateToCategorySelection: () =>
    set({
      currentScreen: 'category-selection' as Screen,
      currentCharacter: null,
      session: null,
    }),

  selectCategory: (category: Category) =>
    set({
      currentCategory: category,
      currentScreen: 'character-selection' as Screen,
      currentCharacter: null,
      session: null,
    }),

  selectCharacter: (character: CharacterTemplate) =>
    set({
      currentCharacter: character,
      currentScreen: 'tracing' as Screen,
      session: createSession(character),
    }),

  // Drawing actions
  startStroke: (point: Point) => {
    const { session } = get();
    if (!session) return;

    const newStroke = createStroke(session.strokes.length, point);

    set({
      session: {
        ...session,
        strokes: [...session.strokes, newStroke],
        lastActivityAt: Date.now(),
      },
    });
  },

  addStrokePoint: (point: Point) => {
    const { session } = get();
    if (!session || session.strokes.length === 0) return;

    const strokes = [...session.strokes];
    const currentStroke = strokes[strokes.length - 1];

    // Don't add points to completed strokes
    if (currentStroke.isComplete) return;

    currentStroke.points = [...currentStroke.points, point];

    set({
      session: {
        ...session,
        strokes,
        lastActivityAt: Date.now(),
      },
    });
  },

  endStroke: () => {
    const { session } = get();
    if (!session || session.strokes.length === 0) return;

    const strokes = [...session.strokes];
    const currentStroke = strokes[strokes.length - 1];

    // Mark stroke as complete
    currentStroke.isComplete = true;

    // Validate stroke against guide path
    const guideStroke = session.template.strokes[session.currentStrokeIndex];
    if (guideStroke) {
      const validation = validateStroke(currentStroke.points, guideStroke);
      currentStroke.accuracy = Math.round(validation.accuracy * 100);
      currentStroke.isValid = validation.isCorrect;
    } else {
      currentStroke.accuracy = 0;
      currentStroke.isValid = false;
    }

    // Move to next stroke
    const nextStrokeIndex = session.currentStrokeIndex + 1;
    const isComplete = nextStrokeIndex >= session.template.strokes.length;

    set({
      session: {
        ...session,
        strokes,
        currentStrokeIndex: nextStrokeIndex,
        isComplete,
        lastActivityAt: Date.now(),
      },
    });
  },

  clearSession: () => {
    const { session } = get();
    if (!session) return;

    set({
      session: createSession(session.template),
    });
  },

  // Character navigation actions
  nextCharacter: () => {
    const { currentCharacter, currentCategory } = get();
    if (!currentCharacter) return;

    const nextChar = getNextCharacter(
      currentCharacter.character,
      currentCategory
    );
    set({
      currentCharacter: nextChar,
      session: createSession(nextChar),
    });
  },

  previousCharacter: () => {
    const { currentCharacter, currentCategory } = get();
    if (!currentCharacter) return;

    const prevChar = getPreviousCharacter(
      currentCharacter.character,
      currentCategory
    );
    set({
      currentCharacter: prevChar,
      session: createSession(prevChar),
    });
  },
}));
