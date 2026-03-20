/**
 * TracingScreen Component
 *
 * Main tracing interface where user draws the character.
 * Integrates canvas with navigation and success animation.
 *
 * Based on specs/001-handwriting-tracing/contracts/ui-contracts.md
 */

import React from 'react';
import type { CharacterTemplate, DrawingSession, Point } from '../../types';
import { Canvas } from '../tracing/Canvas';
import { SuccessAnimation } from '../tracing/SuccessAnimation';
import { NavButtons } from '../navigation/NavButtons';
import { getCategory } from '../../lib/templates/characterData';
import './TracingScreen.css';

interface TracingScreenProps {
  template: CharacterTemplate;
  session: DrawingSession;
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
  onStrokeStart,
  onStrokeMove,
  onStrokeEnd,
  onNext,
  onPrevious,
  onBack,
  onClear,
}) => {
  // Get category data for navigation
  const categoryData = getCategory(template.category);
  const currentIndex = categoryData.characters.findIndex(
    (c) => c.character === template.character
  );
  const hasNext = currentIndex < categoryData.characters.length - 1;
  const hasPrevious = currentIndex > 0;

  return (
    <div className="tracing-screen">
      {/* Header with back button and character display */}
      <header className="tracing-header">
        <h2 className="visually-hidden">Tracing {template.character}</h2>
        <button
          className="back-button"
          onClick={onBack}
          aria-label="Back to character selection"
          style={{ minHeight: '44px', minWidth: '44px', padding: '0 16px' }}
        >
          ← Back
        </button>
        <div className="character-display" aria-live="polite" aria-atomic="true">
          <span className="character-label">Trace:</span>
          <span className="character-value">{template.character}</span>
        </div>
      </header>

      {/* Canvas area with user drawing */}
      <main className="tracing-canvas-container">
        <Canvas
          template={template}
          session={session}
          width={500}
          height={500}
          onStrokeStart={onStrokeStart}
          onStrokeMove={onStrokeMove}
          onStrokeEnd={onStrokeEnd}
        />

        {/* Progress indicator - live region for screen readers */}
        <div
          className="progress-indicator"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>
            Stroke {session.currentStrokeIndex + 1} of {template.totalStrokes}
          </span>
        </div>

        {/* Success announcement for screen readers */}
        {session.isComplete && (
          <div role="status" aria-live="assertive" className="visually-hidden">
            Great job! You completed tracing {template.character}!
          </div>
        )}

        {/* Success animation */}
        <SuccessAnimation
          isVisible={session.isComplete}
          onComplete={() => {
            // Animation complete - can navigate to next character
          }}
        />
      </main>

      {/* Navigation buttons */}
      <nav className="tracing-controls" aria-label="Character navigation">
        <NavButtons
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          isSessionComplete={session.isComplete}
          onNext={onNext}
          onPrevious={onPrevious}
          onBack={onBack}
          onClear={onClear}
        />
      </nav>
    </div>
  );
};
