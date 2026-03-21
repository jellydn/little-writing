/**
 * useCanvas Hook
 *
 * Manages canvas rendering lifecycle with proper device pixel ratio scaling
 * and 60fps rendering support using requestAnimationFrame.
 *
 * Based on specs/001-handwriting-tracing/research.md section 3
 * Contract: specs/001-handwriting-tracing/contracts/ui-contracts.md
 */

import { useEffect, useRef, useState } from 'react';
import { renderSVGPath, type RenderOptions } from '../lib/canvas/pathRenderer';
import { renderStroke } from '../lib/canvas/renderStroke';

/**
 * Renderable element types for the canvas
 */
export type RenderableElement =
  | { type: 'path'; pathData: string; options?: RenderOptions }
  | {
      type: 'stroke';
      points: { x: number; y: number }[];
      options?: RenderOptions;
    }
  | { type: 'clear' };

/**
 * Hook return value matching the UI contract
 */
export interface UseCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  clear: () => void;
  render: (elements: RenderableElement[]) => void;
}

/**
 * Props for useCanvas hook
 */
export interface UseCanvasProps {
  width: number;
  height: number;
}

/**
 * Canvas rendering hook with device pixel ratio support
 *
 * @param props - Canvas dimensions
 * @returns Canvas control interface
 */
export function useCanvas(props: UseCanvasProps): UseCanvasReturn {
  const { width, height } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [scaledWidth, setScaledWidth] = useState(width);
  const [scaledHeight, setScaledHeight] = useState(height);

  /**
   * Initialize canvas with proper device pixel ratio scaling
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    // Set actual canvas size (scaled for Retina displays)
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Set CSS display size
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Get and configure context
    const context = canvas.getContext('2d');
    if (!context) return;

    // Scale context to match device pixel ratio
    context.scale(dpr, dpr);

    // Set default rendering settings for smooth lines
    context.lineCap = 'round';
    context.lineJoin = 'round';

    setCtx(context);
    setScaledWidth(width);
    setScaledHeight(height);

    // Cleanup function
    return () => {
      setCtx(null);
    };
  }, [width, height]);

  /**
   * Clear the entire canvas
   */
  const clear = (): void => {
    if (!ctx) return;
    ctx.clearRect(0, 0, scaledWidth, scaledHeight);
  };

  /**
   * Render elements to the canvas
   * Supports rendering in order with requestAnimationFrame for 60fps
   */
  const render = (elements: RenderableElement[]): void => {
    if (!ctx) return;

    // Use requestAnimationFrame for smooth 60fps rendering
    requestAnimationFrame(() => {
      for (const element of elements) {
        if (element.type === 'clear') {
          clear();
        } else if (element.type === 'path') {
          renderSVGPath(ctx, element.pathData, element.options);
        } else if (element.type === 'stroke') {
          renderStroke(ctx, element.points, {
            color: element.options?.strokeColor,
            lineWidth: element.options?.strokeWidth,
            lineCap: element.options?.lineCap,
            lineJoin: element.options?.lineJoin,
          });
        }
      }
    });
  };

  return {
    canvasRef,
    ctx,
    width: scaledWidth,
    height: scaledHeight,
    clear,
    render,
  };
}
