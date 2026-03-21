/**
 * Render a freehand stroke from point array
 *
 * Shared rendering utility used by both Canvas component and useCanvas hook.
 *
 * @param ctx - Canvas rendering context
 * @param points - Array of points to render
 * @param options - Stroke rendering options
 */

export interface RenderStrokeOptions {
  color?: string;
  lineWidth?: number;
  lineCap?: CanvasLineCap;
  lineJoin?: CanvasLineJoin;
}

export function renderStroke(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  options: RenderStrokeOptions = {}
): void {
  if (points.length === 0) return;

  const {
    color = '#000000',
    lineWidth = 2,
    lineCap = 'round',
    lineJoin = 'round',
  } = options;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = lineCap;
  ctx.lineJoin = lineJoin;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }

  ctx.stroke();
  ctx.restore();
}
