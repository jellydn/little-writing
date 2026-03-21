/**
 * StrokeFeedback Component
 *
 * Visual feedback overlay for stroke validation results.
 * Shows green overlay for correct strokes and red with shake animation for incorrect.
 *
 * Features:
 * - Green overlay for correct strokes
 * - Red overlay with shake animation for incorrect strokes
 * - Only shows for most recent completed stroke
 * - Auto-dismisses after animation
 *
 * Reference: specs/001-handwriting-tracing/components/stroke-feedback.md
 */

import React, { useEffect, useState } from 'react';
import type { Stroke } from '@/types';
import { COLORS } from '@/styles/theme';
import { errorAnimation, getAnimationObject } from '@/styles/animations';

interface StrokeFeedbackProps {
  /** The stroke to show feedback for */
  stroke: Stroke | null;
  /** Whether feedback is currently visible */
  isVisible: boolean;
  /** Callback when feedback animation completes */
  onComplete?: () => void;
}

/**
 * Generates CSS class for feedback animation
 */
function getFeedbackClass(isValid: boolean, isVisible: boolean): string {
  if (!isVisible) return '';

  return isValid ? 'feedback-correct' : 'feedback-incorrect';
}

export const StrokeFeedback: React.FC<StrokeFeedbackProps> = ({
  stroke,
  isVisible,
  onComplete,
}) => {
  const [showShake, setShowShake] = useState(false);

  // Trigger shake animation for incorrect strokes
  useEffect(() => {
    if (isVisible && stroke && stroke.isValid === false) {
      setShowShake(true);

      // Reset shake after animation completes
      const timer = setTimeout(() => {
        setShowShake(false);
        onComplete?.();
      }, 500); // Matches errorAnimation.duration

      return () => clearTimeout(timer);
    }

    if (isVisible && stroke && stroke.isValid === true) {
      // For correct strokes, complete after shorter delay
      const timer = setTimeout(() => {
        onComplete?.();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isVisible, stroke, onComplete]);

  if (!isVisible || !stroke || stroke.isValid === null) {
    return null;
  }

  const isCorrect = stroke.isValid;
  const feedbackColor = isCorrect ? COLORS.correct : COLORS.incorrect;
  const feedbackClass = getFeedbackClass(isCorrect, isVisible);
  const animationStyle = isCorrect
    ? {}
    : getAnimationObject('errorShake', {
        duration: errorAnimation.duration,
        timing: errorAnimation.timing,
      });

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`stroke-feedback ${feedbackClass} ${showShake ? 'shake' : ''}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        backgroundColor: isCorrect
          ? `${feedbackColor}15`
          : `${feedbackColor}20`,
        border: `4px solid ${feedbackColor}`,
        borderRadius: '12px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 200ms ease-out',
        ...animationStyle,
      }}
    >
      {/* Screen reader announcement — visually-hidden is defined in src/styles/globals.css */}
      <span className="visually-hidden">
        {isCorrect
          ? 'Correct! Stroke complete.'
          : 'Try again. Stroke was off track.'}
      </span>

      {/* Feedback icon */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '48px',
          color: feedbackColor,
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        {isCorrect ? '✓' : '✕'}
      </div>

      {/* CSS injection for animations */}
      <style>{`
        .stroke-feedback.feedback-correct {
          animation: fadeInOut 300ms ease-out;
        }

        @keyframes fadeInOut {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 1; }
        }

        .stroke-feedback.shake {
          animation: errorShake 500ms ease-in-out;
        }

        @keyframes errorShake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-8px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(8px);
          }
        }
      `}</style>
    </div>
  );
};
