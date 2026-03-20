/**
 * NavButtons Component
 *
 * Navigation buttons for the tracing screen.
 * Provides Back, Previous, Clear, and Next actions with child-friendly styling.
 *
 * Based on specs/001-handwriting-tracing/contracts/ui-contracts.md
 * Task: T042
 */

import React from 'react';
import { Button } from '../ui/Button';
import './NavButtons.css';

export interface NavButtonsProps {
  /** Whether there is a next character available */
  hasNext: boolean;
  /** Whether there is a previous character available */
  hasPrevious: boolean;
  /** Whether the current tracing session is complete */
  isSessionComplete: boolean;
  /** Callback for Next button */
  onNext: () => void;
  /** Callback for Previous button */
  onPrevious: () => void;
  /** Callback for Back button */
  onBack: () => void;
  /** Callback for Clear button */
  onClear: () => void;
}

export const NavButtons: React.FC<NavButtonsProps> = ({
  hasNext,
  hasPrevious,
  isSessionComplete,
  onNext,
  onPrevious,
  onBack,
  onClear,
}) => {
  const isNextEnabled = hasNext && isSessionComplete;
  const isPreviousEnabled = hasPrevious;

  return (
    <div className="nav-buttons">
      {/* Back button - left side */}
      <Button
        variant="secondary"
        onClick={onBack}
        aria-label="Go back to character selection"
      >
        Back
      </Button>

      {/* Center section: Previous and Next */}
      <div className="nav-buttons__center">
        <Button
          variant="primary"
          onClick={onPrevious}
          disabled={!isPreviousEnabled}
          aria-label="Previous character"
        >
          Previous
        </Button>

        <Button
          variant="action"
          onClick={onNext}
          disabled={!isNextEnabled}
          aria-label="Next character"
        >
          Next
        </Button>
      </div>

      {/* Clear button - right side */}
      <Button
        variant="action"
        onClick={onClear}
        aria-label="Clear drawing and start over"
      >
        Clear
      </Button>
    </div>
  );
};
