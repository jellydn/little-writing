/**
 * useTracing hook - Manages tracing session state and logic
 *
 * Handles the complete lifecycle of a tracing session including:
 * - Session creation when template changes
 * - Stroke management (start, add points, end)
 * - Stroke validation using strokeValidator
 * - Accuracy calculation and completion tracking
 *
 * Reference: specs/001-handwriting-tracing/contracts/ui-contracts.md
 */

import { useMemo, useCallback, useRef } from 'react';
import type {
  Point,
  CharacterTemplate,
  DrawingSession,
  Stroke,
} from '../types';
import { validateStroke } from '../lib/canvas/strokeValidator';

export interface UseTracingReturn {
  /** Current drawing session state */
  session: DrawingSession | null;
  /** Start a new stroke at the given point */
  startStroke: (point: Point) => void;
  /** Add a point to the current stroke */
  addStrokePoint: (point: Point) => void;
  /** End the current stroke and validate it */
  endStroke: () => void;
  /** Clear all strokes from the current session */
  clearSession: () => void;
  /** Index of the stroke the user should be drawing next */
  currentStrokeIndex: number;
  /** Whether all required strokes have been completed correctly */
  isComplete: boolean;
  /** Overall accuracy score (0-1) across all completed strokes */
  accuracy: number;
}

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
 * Hook for managing tracing session state
 *
 * @param template - Character template to trace
 * @returns Tracing session state and actions
 */
export function useTracing(template: CharacterTemplate): UseTracingReturn {
  // Track current stroke being drawn
  const currentStrokeRef = useRef<Stroke | null>(null);

  // Create new session when template changes
  const session = useMemo<DrawingSession>(() => {
    return createSession(template);
  }, [template]);

  // Start a new stroke
  const startStroke = useCallback(
    (point: Point) => {
      const newStroke: Stroke = {
        id: session.currentStrokeIndex,
        points: [point],
        isComplete: false,
        isValid: null,
        accuracy: 0,
      };
      currentStrokeRef.current = newStroke;
      session.lastActivityAt = Date.now();
    },
    [session]
  );

  // Add a point to the current stroke
  const addStrokePoint = useCallback(
    (point: Point) => {
      if (currentStrokeRef.current) {
        currentStrokeRef.current.points.push(point);
        session.lastActivityAt = Date.now();
      }
    },
    [session]
  );

  // End the current stroke and validate it
  const endStroke = useCallback(() => {
    if (!currentStrokeRef.current) {
      return;
    }

    const stroke = currentStrokeRef.current;
    stroke.isComplete = true;

    // Get the guide path for this stroke
    const guidePath = template.strokes[session.currentStrokeIndex];
    if (guidePath) {
      // Validate the stroke against the guide path
      const validationResult = validateStroke(stroke.points, guidePath);
      stroke.isValid = validationResult.isCorrect;
      stroke.accuracy = validationResult.accuracy;
    }

    // Add stroke to session
    session.strokes.push(stroke);
    currentStrokeRef.current = null;

    // Check if stroke was valid and we should move to next stroke
    if (stroke.isValid) {
      session.currentStrokeIndex += 1;

      // Check if session is complete
      if (session.currentStrokeIndex >= template.strokes.length) {
        session.isComplete = true;
      }
    }

    session.lastActivityAt = Date.now();
  }, [session, template.strokes]);

  // Clear all strokes from the session
  const clearSession = useCallback(() => {
    session.strokes = [];
    session.currentStrokeIndex = 0;
    session.isComplete = false;
    session.lastActivityAt = Date.now();
    currentStrokeRef.current = null;
  }, [session]);

  // Calculate overall accuracy across all completed strokes
  const accuracy = useMemo(() => {
    if (session.strokes.length === 0) {
      return 0;
    }

    // Average accuracy of all strokes
    const totalAccuracy = session.strokes.reduce((sum, stroke) => {
      return sum + stroke.accuracy;
    }, 0);

    return totalAccuracy / session.strokes.length;
  }, [session.strokes]);

  return {
    session,
    startStroke,
    addStrokePoint,
    endStroke,
    clearSession,
    currentStrokeIndex: session.currentStrokeIndex,
    isComplete: session.isComplete,
    accuracy,
  };
}
