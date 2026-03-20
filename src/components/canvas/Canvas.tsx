/**
 * Canvas Component - Placeholder
 *
 * TODO: Implement canvas drawing functionality
 */
import React, { forwardRef } from 'react';
import type { DrawingSession, Point } from '../../types';

interface CanvasProps {
  session: DrawingSession;
  onStrokeStart: (point: Point) => void;
  onStrokeMove: (point: Point) => void;
  onStrokeEnd: () => void;
}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  (_props, ref) => {
    return (
      <canvas
        ref={ref}
        className="drawing-canvas"
        width={300}
        height={300}
        // TODO: Implement touch/mouse event handlers
      />
    );
  }
);

Canvas.displayName = 'Canvas';
