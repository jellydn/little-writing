/**
 * StrokeFeedback Component - Placeholder
 *
 * TODO: Implement stroke feedback overlay
 */
import React from 'react';
import type { DrawingSession } from '../../types';

interface StrokeFeedbackProps {
  session: DrawingSession;
}

export const StrokeFeedback: React.FC<StrokeFeedbackProps> = ({
  session: _session,
}) => {
  return (
    <div className="stroke-feedback">
      {/* TODO: Render validation feedback overlay */}
    </div>
  );
};
