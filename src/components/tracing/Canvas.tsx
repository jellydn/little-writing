/**
 * Canvas Component
 *
 * Main canvas component for handwriting tracing using HTML5 Canvas.
 * Renders guide paths and user-drawn strokes with 60fps performance.
 *
 * Features:
 * - Touch and stylus support via Pointer Events
 * - Palm rejection and multi-touch handling
 * - Real-time stroke rendering
 * - Guide path visualization
 * - Device pixel ratio scaling for Retina displays
 *
 * Reference: specs/001-handwriting-tracing/components/canvas.md
 * Contract: specs/001-handwriting-tracing/contracts/ui-contracts.md
 */

import React, { useEffect, useMemo, useRef } from 'react';
import { useCanvas } from '@/hooks/useCanvas';
import { renderSVGPath } from '@/lib/canvas/pathRenderer';
import { renderStroke } from '@/lib/canvas/renderStroke';
import { createPointerHandlers } from '@/lib/canvas/touchHandler';
import { COLORS, UI_CONFIG } from '@/styles/theme';
import type { CharacterTemplate, DrawingSession, Point } from '@/types';

interface CanvasProps {
  /** Character template with stroke guide data */
  template: CharacterTemplate;
  /** Current drawing session state */
  session: DrawingSession;
  /** Canvas width in pixels */
  width: number;
  /** Canvas height in pixels */
  height: number;
  /** Callback when stroke starts */
  onStrokeStart: (point: Point) => void;
  /** Callback when stroke moves */
  onStrokeMove: (point: Point) => void;
  /** Callback when stroke ends */
  onStrokeEnd: () => void;
}

/**
 * Converts template coordinate to canvas coordinate
 */
function templateToCanvasPoint(
  point: Point,
  offsetX: number,
  offsetY: number,
  scale: number
): Point {
  return {
    x: point.x * scale + offsetX,
    y: point.y * scale + offsetY,
  };
}

/**
 * Converts canvas coordinate to template coordinate
 */
function canvasToTemplatePoint(
  point: Point,
  offsetX: number,
  offsetY: number,
  scale: number
): Point {
  return {
    x: (point.x - offsetX) / scale,
    y: (point.y - offsetY) / scale,
  };
}

/**
 * Calculates scale factor to fit template within canvas
 */
function calculateScale(
  template: CharacterTemplate,
  canvasWidth: number,
  canvasHeight: number
): number {
  const padding = UI_CONFIG.CANVAS_PADDING;
  const availableWidth = canvasWidth - padding * 2;
  const availableHeight = canvasHeight - padding * 2;

  const scaleX = availableWidth / template.bounds.width;
  const scaleY = availableHeight / template.bounds.height;

  return Math.min(scaleX, scaleY);
}

/**
 * Calculates offset to center template in canvas
 */
function calculateOffset(
  template: CharacterTemplate,
  canvasWidth: number,
  canvasHeight: number,
  scale: number
): Point {
  const scaledWidth = template.bounds.width * scale;
  const scaledHeight = template.bounds.height * scale;

  return {
    x: (canvasWidth - scaledWidth) / 2,
    y: (canvasHeight - scaledHeight) / 2,
  };
}

export const Canvas: React.FC<CanvasProps> = ({
  template,
  session,
  width,
  height,
  onStrokeStart,
  onStrokeMove,
  onStrokeEnd,
}) => {
  const { canvasRef } = useCanvas({ width, height });
  const renderFrameRef = useRef<number | null>(null);

  // Calculate scale and offset for template
  const scale = useMemo(
    () => calculateScale(template, width, height),
    [template.bounds.width, template.bounds.height, width, height]
  );
  const offset = useMemo(
    () => calculateOffset(template, width, height, scale),
    [template.bounds.width, template.bounds.height, width, height, scale]
  );

  // Render on session/template change
  useEffect(() => {
    const canvasCtx = canvasRef.current?.getContext('2d');
    if (!canvasCtx) return;

    const render = () => {
      // Clear canvas
      canvasCtx.clearRect(0, 0, width, height);

      // 1. Draw white background
      canvasCtx.fillStyle = COLORS.background;
      canvasCtx.fillRect(0, 0, width, height);

      // 2. Draw character guide lines (gray, dotted)
      template.strokes.forEach((stroke, index) => {
        const isCurrentStroke = index === session.currentStrokeIndex;
        const isCompleted = index < session.currentStrokeIndex;

        const strokeColor = isCompleted
          ? COLORS.correct
          : isCurrentStroke
            ? COLORS.highlight
            : COLORS.guide;

        const isDashed = !isCompleted;

        canvasCtx.save();
        canvasCtx.strokeStyle = strokeColor;
        canvasCtx.lineWidth = UI_CONFIG.GUIDE_LINE_WIDTH;
        canvasCtx.lineCap = 'round';
        canvasCtx.lineJoin = 'round';

        if (isDashed) {
          canvasCtx.setLineDash([10, 10]);
        }

        renderSVGPath(canvasCtx, stroke.path, {
          strokeColor,
          strokeWidth: UI_CONFIG.GUIDE_LINE_WIDTH,
          scale,
          offsetX: offset.x,
          offsetY: offset.y,
        });

        canvasCtx.restore();
      });

      // 3. Draw completed strokes (green)
      // 4. Draw current stroke (in progress)
      session.strokes.forEach((stroke) => {
        const strokeColor =
          stroke.isValid === null
            ? COLORS.highlight
            : stroke.isValid
              ? COLORS.correct
              : COLORS.incorrect;

        const canvasPoints = stroke.points.map((p) =>
          templateToCanvasPoint(p, offset.x, offset.y, scale)
        );

        renderStroke(canvasCtx, canvasPoints, {
          color: strokeColor,
          lineWidth: UI_CONFIG.USER_STROKE_WIDTH,
        });
      });

      renderFrameRef.current = null;
    };

    if (renderFrameRef.current !== null) {
      cancelAnimationFrame(renderFrameRef.current);
    }
    renderFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (renderFrameRef.current !== null) {
        cancelAnimationFrame(renderFrameRef.current);
        renderFrameRef.current = null;
      }
    };
  }, [canvasRef, template, session, width, height, scale, offset]);

  // Create pointer handlers with coordinate conversion
  const pointerHandlersRef = useRef<ReturnType<
    typeof createPointerHandlers
  > | null>(null);

  const adjustedCallbacks = React.useMemo(
    () => ({
      onStrokeStart: (point: Point) => {
        const adjustedPoint = canvasToTemplatePoint(
          point,
          offset.x,
          offset.y,
          scale
        );
        onStrokeStart(adjustedPoint);
      },
      onStrokeMove: (point: Point) => {
        const adjustedPoint = canvasToTemplatePoint(
          point,
          offset.x,
          offset.y,
          scale
        );
        onStrokeMove(adjustedPoint);
      },
      onStrokeEnd: () => {
        onStrokeEnd();
      },
    }),
    [offset, scale, onStrokeStart, onStrokeMove, onStrokeEnd]
  );

  // Create pointer handlers once
  useEffect(() => {
    pointerHandlersRef.current = createPointerHandlers(adjustedCallbacks);
  }, [adjustedCallbacks]);

  // Attach pointer event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    const handlers = pointerHandlersRef.current;

    if (!canvas || !handlers) return;

    canvas.addEventListener('pointerdown', handlers.onPointerDown);
    canvas.addEventListener('pointermove', handlers.onPointerMove);
    canvas.addEventListener('pointerup', handlers.onPointerUp);
    canvas.addEventListener('pointercancel', handlers.onPointerCancel);

    return () => {
      canvas.removeEventListener('pointerdown', handlers.onPointerDown);
      canvas.removeEventListener('pointermove', handlers.onPointerMove);
      canvas.removeEventListener('pointerup', handlers.onPointerUp);
      canvas.removeEventListener('pointercancel', handlers.onPointerCancel);
    };
  }, [canvasRef]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (renderFrameRef.current !== null) {
        cancelAnimationFrame(renderFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      aria-label={`Drawing canvas for tracing ${template.displayName || template.character}`}
      role="img"
      aria-describedby={`canvas-instructions-${template.character}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: COLORS.background,
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        touchAction: 'none', // Prevent scrolling while drawing
        display: 'block',
      }}
    >
      <span
        id={`canvas-instructions-${template.character}`}
        className="visually-hidden"
      >
        Use your finger or stylus to trace the{' '}
        {template.displayName || template.character} character on the screen.
        Follow the guide lines from start to finish.
      </span>
    </canvas>
  );
};
