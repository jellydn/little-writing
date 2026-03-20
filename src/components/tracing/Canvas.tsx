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

import React, { useEffect, useRef } from 'react';
import type { CharacterTemplate, DrawingSession, Point } from '@/types';
import { COLORS, UI_CONFIG } from '@/styles/theme';
import { useCanvas } from '@/hooks/useCanvas';
import { createPointerHandlers } from '@/lib/canvas/touchHandler';
import { renderSVGPath } from '@/lib/canvas/pathRenderer';

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

  return Math.min(scaleX, scaleY, 1); // Don't upscale, only downscale
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

/**
 * Renders a freehand stroke from point array
 */
function renderStroke(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  color: string,
  lineWidth: number
): void {
  if (points.length === 0) return;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.stroke();
  ctx.restore();
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
  const { canvasRef, ctx, clear } = useCanvas({ width, height });
  const renderFrameRef = useRef<number | null>(null);

  // Calculate scale and offset for template
  const scale = calculateScale(template, width, height);
  const offset = calculateOffset(template, width, height, scale);

  /**
   * Main render function - draws all canvas layers
   */
  const renderCanvas = React.useCallback(() => {
    if (!ctx) return;

    // Clear canvas
    clear();

    // 1. Draw white background
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, width, height);

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

      ctx.save();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = UI_CONFIG.GUIDE_LINE_WIDTH;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (isDashed) {
        ctx.setLineDash([10, 10]);
      }

      // Render SVG path with proper scaling
      renderSVGPath(ctx, stroke.path, {
        strokeColor,
        strokeWidth: UI_CONFIG.GUIDE_LINE_WIDTH,
        scale,
        offsetX: offset.x,
        offsetY: offset.y,
      });

      ctx.restore();
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

      // Convert template points to canvas coordinates
      const canvasPoints = stroke.points.map((p) =>
        templateToCanvasPoint(p, offset.x, offset.y, scale)
      );

      renderStroke(
        ctx,
        canvasPoints,
        strokeColor,
        UI_CONFIG.USER_STROKE_WIDTH
      );
    });

    // 5. Draw stroke feedback (green/red overlay)
    // This is handled by the stroke color above based on isValid
  }, [
    ctx,
    clear,
    template,
    session,
    width,
    height,
    scale,
    offset,
  ]);

  /**
   * Schedule render at 60fps using requestAnimationFrame
   */
  const scheduleRender = React.useCallback(() => {
    if (renderFrameRef.current !== null) {
      return; // Already scheduled
    }

    renderFrameRef.current = requestAnimationFrame(() => {
      renderCanvas();
      renderFrameRef.current = null;
    });
  }, [renderCanvas]);

  // Render on every state change
  useEffect(() => {
    scheduleRender();
  }, [scheduleRender, template, session]);

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
  }, []);

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
      <span id={`canvas-instructions-${template.character}`} className="visually-hidden">
        Use your finger or stylus to trace the {template.displayName || template.character} character
        on the screen. Follow the guide lines from start to finish.
      </span>
    </canvas>
  );
};
