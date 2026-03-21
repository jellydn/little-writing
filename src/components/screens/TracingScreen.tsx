/**
 * TracingScreen Component
 *
 * Main tracing interface where user draws the character.
 * Integrates canvas with navigation and success animation.
 *
 * Based on specs/001-handwriting-tracing/contracts/ui-contracts.md
 */

import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NavButtons } from '@/components/navigation/NavButtons';
import { Canvas } from '@/components/tracing/Canvas';
import { StrokeFeedback } from '@/components/tracing/StrokeFeedback';
import { SuccessAnimation } from '@/components/tracing/SuccessAnimation';
import { useCanvasSize } from '@/hooks/useCanvasSize';
import type { CharacterTemplate, DrawingSession, Point, Stroke } from '@/types';
import './TracingScreen.css';

interface TracingScreenProps {
  template: CharacterTemplate;
  session: DrawingSession;
  categoryCharacters: CharacterTemplate[];
  onStrokeStart: (point: Point) => void;
  onStrokeMove: (point: Point) => void;
  onStrokeEnd: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onBack: () => void;
  onClear: () => void;
}

export const TracingScreen: React.FC<TracingScreenProps> = ({
  template,
  session,
  categoryCharacters,
  onStrokeStart,
  onStrokeMove,
  onStrokeEnd,
  onNext,
  onPrevious,
  onBack,
  onClear,
}) => {
  const canvasSize = useCanvasSize();
  const currentIndex = categoryCharacters.findIndex(
    (c) => c.character === template.character
  );
  const hasNext = currentIndex < categoryCharacters.length - 1;
  const hasPrevious = currentIndex > 0;

  // Stroke feedback state
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackStroke, setFeedbackStroke] = useState<Stroke | null>(null);
  const lastStrokeCountRef = useRef(0);

  // Show stroke feedback when a new stroke is completed
  useEffect(() => {
    const currentCount = session.strokes.length;
    const prevCount = lastStrokeCountRef.current;

    if (currentCount > prevCount) {
      const lastStroke = session.strokes[currentCount - 1];
      if (lastStroke.isComplete && lastStroke.isValid !== null) {
        setFeedbackStroke(lastStroke);
        setFeedbackVisible(true);
      }
    } else if (currentCount < prevCount) {
      // Strokes cleared — hide any visible feedback
      setFeedbackVisible(false);
      setFeedbackStroke(null);
    }

    lastStrokeCountRef.current = currentCount;
  }, [session.strokes]);

  // Reset feedback tracking when a new session starts
  useEffect(() => {
    lastStrokeCountRef.current = 0;
    setFeedbackVisible(false);
    setFeedbackStroke(null);
  }, [session.startedAt]);

  // Ref to store timeout ID for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount to prevent race conditions
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Memoized callback to prevent re-render instability in SuccessAnimation
  const handleAnimationComplete = useCallback(() => {
    if (hasNext) {
      timeoutRef.current = setTimeout(onNext, 500);
    }
  }, [hasNext, onNext]);

  // Memoized callback for stroke feedback dismissal
  const handleFeedbackComplete = useCallback(() => {
    setFeedbackVisible(false);
  }, []);

  return (
    <div className="tracing-screen">
      <header className="tracing-header">
        <h2 className="visually-hidden">Tracing {template.character}</h2>
        <button
          type="button"
          className="back-button"
          onClick={onBack}
          aria-label="Back to character selection"
        >
          ← Back
        </button>
        <div
          className="character-display"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="character-label">Trace:</span>
          <span className="character-value">{template.character}</span>
        </div>
      </header>

      <main className="tracing-canvas-container">
        <div className="canvas-wrapper">
          <Canvas
            key={`${template.character}-${session.startedAt}`}
            template={template}
            session={session}
            width={canvasSize}
            height={canvasSize}
            onStrokeStart={onStrokeStart}
            onStrokeMove={onStrokeMove}
            onStrokeEnd={onStrokeEnd}
          />
          <StrokeFeedback
            stroke={feedbackStroke}
            isVisible={feedbackVisible}
            onComplete={handleFeedbackComplete}
          />
        </div>

        <div
          className="progress-indicator"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>
            {session.isComplete
              ? `Completed ${template.totalStrokes} of ${template.totalStrokes} strokes`
              : session.strokes.length === 0 && session.currentStrokeIndex === 0
                ? `Start with stroke 1 of ${template.totalStrokes}`
                : `Stroke ${Math.min(session.currentStrokeIndex + 1, template.totalStrokes)} of ${template.totalStrokes}`}
          </span>
          <button
            type="button"
            className="clear-button"
            onClick={onClear}
            aria-label="Clear drawing"
          >
            Clear
          </button>
        </div>

        {session.isComplete && (
          <div role="status" aria-live="assertive" className="visually-hidden">
            Great job! You completed tracing {template.character}!
          </div>
        )}

        <SuccessAnimation
          isVisible={session.isComplete}
          onComplete={handleAnimationComplete}
        />
      </main>

      <nav className="tracing-controls" aria-label="Character navigation">
        <NavButtons
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      </nav>
    </div>
  );
};
