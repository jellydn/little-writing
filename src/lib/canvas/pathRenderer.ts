/**
 * SVG Path Rendering Utilities
 *
 * Provides utilities for rendering SVG path data to HTML5 Canvas,
 * parsing SVG path commands, and extracting stroke guide data.
 */

/**
 * Point in 2D space
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Rendering options for SVG path
 */
export interface RenderOptions {
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  lineCap?: CanvasLineCap;
  lineJoin?: CanvasLineJoin;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
}

/**
 * Stroke guide path for character templates
 */
export interface GuidePath {
  id: string;
  pathData: string;
  order?: number;
}

/**
 * Character template with stroke guide data
 */
export interface CharacterTemplate {
  character: string;
  strokes: GuidePath[];
  width: number;
  height: number;
}

/**
 * SVG Path Command types
 */
type PathCommand =
  | { type: 'M'; x: number; y: number; relative: boolean }
  | { type: 'L'; x: number; y: number; relative: boolean }
  | { type: 'H'; x: number; relative: boolean }
  | { type: 'V'; y: number; relative: boolean }
  | {
      type: 'C';
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      x: number;
      y: number;
      relative: boolean;
    }
  | {
      type: 'Q';
      x1: number;
      y1: number;
      x: number;
      y: number;
      relative: boolean;
    }
  | {
      type: 'A';
      rx: number;
      ry: number;
      rotation: number;
      largeArc: boolean;
      sweep: boolean;
      x: number;
      y: number;
      relative: boolean;
    }
  | { type: 'Z' };

/**
 * Parse SVG path data string into array of commands
 */
function parsePathCommands(pathData: string): PathCommand[] {
  const commands: PathCommand[] = [];
  const commandRegex = /([MmLlHhVvCcQqAaZz])([^MmLlHhVvCcQqAaZz]*)/g;

  let match: RegExpExecArray | null;
  while ((match = commandRegex.exec(pathData)) !== null) {
    const type = match[1];
    const args = match[2]
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(parseFloat);

    const isRelative = type === type.toLowerCase();
    const upperType = type.toUpperCase();

    if (upperType === 'Z') {
      commands.push({ type: 'Z' });
    } else {
      const commandType = upperType as keyof typeof commandHandlers;
      const handler = commandHandlers[commandType];
      if (handler) {
        commands.push(...handler(args, isRelative));
      }
    }
  }

  return commands;
}

/**
 * Command handlers for different SVG path commands
 */
const commandHandlers = {
  M: (args: number[], relative: boolean): PathCommand[] => {
    const commands: PathCommand[] = [];
    for (let i = 0; i < args.length; i += 2) {
      commands.push({ type: 'M', x: args[i], y: args[i + 1], relative });
    }
    return commands;
  },
  L: (args: number[], relative: boolean): PathCommand[] => {
    const commands: PathCommand[] = [];
    for (let i = 0; i < args.length; i += 2) {
      commands.push({ type: 'L', x: args[i], y: args[i + 1], relative });
    }
    return commands;
  },
  H: (args: number[], relative: boolean): PathCommand[] => {
    return args.map((x) => ({ type: 'H' as const, x, relative }));
  },
  V: (args: number[], relative: boolean): PathCommand[] => {
    return args.map((y) => ({ type: 'V' as const, y, relative }));
  },
  C: (args: number[], relative: boolean): PathCommand[] => {
    const commands: PathCommand[] = [];
    for (let i = 0; i < args.length; i += 6) {
      commands.push({
        type: 'C',
        x1: args[i],
        y1: args[i + 1],
        x2: args[i + 2],
        y2: args[i + 3],
        x: args[i + 4],
        y: args[i + 5],
        relative,
      });
    }
    return commands;
  },
  Q: (args: number[], relative: boolean): PathCommand[] => {
    const commands: PathCommand[] = [];
    for (let i = 0; i < args.length; i += 4) {
      commands.push({
        type: 'Q',
        x1: args[i],
        y1: args[i + 1],
        x: args[i + 2],
        y: args[i + 3],
        relative,
      });
    }
    return commands;
  },
  A: (args: number[], relative: boolean): PathCommand[] => {
    const commands: PathCommand[] = [];
    for (let i = 0; i < args.length; i += 7) {
      commands.push({
        type: 'A',
        rx: args[i],
        ry: args[i + 1],
        rotation: args[i + 2],
        largeArc: args[i + 3] !== 0,
        sweep: args[i + 4] !== 0,
        x: args[i + 5],
        y: args[i + 6],
        relative,
      });
    }
    return commands;
  },
  Z: (): PathCommand[] => [{ type: 'Z' }],
};

/**
 * Render SVG path data to canvas context
 *
 * @param ctx - Canvas rendering context
 * @param pathData - SVG path d attribute string
 * @param options - Rendering options
 */
export function renderSVGPath(
  ctx: CanvasRenderingContext2D,
  pathData: string,
  options: RenderOptions = {}
): void {
  const {
    strokeColor = '#000000',
    strokeWidth = 1,
    fillColor,
    lineCap = 'round',
    lineJoin = 'round',
    scale = 1,
    offsetX = 0,
    offsetY = 0,
  } = options;

  // Save context state
  ctx.save();

  // Apply transformations
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  // Set styles
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = lineCap;
  ctx.lineJoin = lineJoin;

  if (fillColor) {
    ctx.fillStyle = fillColor;
  }

  // Parse and execute commands
  const commands = parsePathCommands(pathData);
  executePathCommands(ctx, commands);

  // Render
  if (fillColor) {
    ctx.fill();
  }
  ctx.stroke();

  // Restore context state
  ctx.restore();
}

/**
 * Execute parsed path commands on canvas context
 */
function executePathCommands(
  ctx: CanvasRenderingContext2D,
  commands: PathCommand[]
): void {
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;

  for (const cmd of commands) {
    switch (cmd.type) {
      case 'M': {
        const x = cmd.relative ? currentX + cmd.x : cmd.x;
        const y = cmd.relative ? currentY + cmd.y : cmd.y;
        ctx.moveTo(x, y);
        currentX = x;
        currentY = y;
        startX = x;
        startY = y;
        break;
      }
      case 'L': {
        const x = cmd.relative ? currentX + cmd.x : cmd.x;
        const y = cmd.relative ? currentY + cmd.y : cmd.y;
        ctx.lineTo(x, y);
        currentX = x;
        currentY = y;
        break;
      }
      case 'H': {
        const x = cmd.relative ? currentX + cmd.x : cmd.x;
        ctx.lineTo(x, currentY);
        currentX = x;
        break;
      }
      case 'V': {
        const y = cmd.relative ? currentY + cmd.y : cmd.y;
        ctx.lineTo(currentX, y);
        currentY = y;
        break;
      }
      case 'C': {
        const x1 = cmd.relative ? currentX + cmd.x1 : cmd.x1;
        const y1 = cmd.relative ? currentY + cmd.y1 : cmd.y1;
        const x2 = cmd.relative ? currentX + cmd.x2 : cmd.x2;
        const y2 = cmd.relative ? currentY + cmd.y2 : cmd.y2;
        const x = cmd.relative ? currentX + cmd.x : cmd.x;
        const y = cmd.relative ? currentY + cmd.y : cmd.y;
        ctx.bezierCurveTo(x1, y1, x2, y2, x, y);
        currentX = x;
        currentY = y;
        break;
      }
      case 'Q': {
        const x1 = cmd.relative ? currentX + cmd.x1 : cmd.x1;
        const y1 = cmd.relative ? currentY + cmd.y1 : cmd.y1;
        const x = cmd.relative ? currentX + cmd.x : cmd.x;
        const y = cmd.relative ? currentY + cmd.y : cmd.y;
        ctx.quadraticCurveTo(x1, y1, x, y);
        currentX = x;
        currentY = y;
        break;
      }
      case 'A': {
        const x = cmd.relative ? currentX + cmd.x : cmd.x;
        const y = cmd.relative ? currentY + cmd.y : cmd.y;
        drawArc(ctx, currentX, currentY, x, y, cmd);
        currentX = x;
        currentY = y;
        break;
      }
      case 'Z': {
        ctx.closePath();
        currentX = startX;
        currentY = startY;
        break;
      }
    }
  }
}

/**
 * Draw elliptical arc (A command)
 * Approximates arc using bezier curves
 */
function drawArc(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  arc: {
    rx: number;
    ry: number;
    rotation: number;
    largeArc: boolean;
    sweep: boolean;
  }
): void {
  const { rx, ry, largeArc, sweep } = arc;

  // For simplicity, use a circular arc if rx == ry
  // Otherwise, approximate with line
  if (Math.abs(rx - ry) < 0.001) {
    const radius = rx;
    const centerX = findArcCenter(x1, y1, x2, y2, radius, largeArc, sweep);
    if (centerX) {
      const { cx, cy, startAngle, endAngle } = centerX;
      ctx.arc(cx, cy, radius, startAngle, endAngle, !sweep);
    } else {
      // Fallback to line if arc cannot be computed
      ctx.lineTo(x2, y2);
    }
  } else {
    // Approximate elliptical arc with quadratic curves
    // Simple approximation: use line if elliptical
    ctx.lineTo(x2, y2);
  }
}

/**
 * Find center and angles for circular arc
 */
function findArcCenter(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  radius: number,
  largeArc: boolean,
  sweep: boolean
): { cx: number; cy: number; startAngle: number; endAngle: number } | null {
  const dx = (x2 - x1) / 2;
  const dy = (y2 - y1) / 2;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > radius || distance === 0) {
    return null;
  }

  const angle = Math.atan2(dy, dx);
  const offset = Math.acos(distance / radius);

  const midAngle = angle + (sweep ? Math.PI / 2 : -Math.PI / 2);
  const centerAngle = largeArc ? midAngle + Math.PI : midAngle;

  const cx = (x1 + x2) / 2 + radius * Math.cos(centerAngle) * Math.sin(offset);
  const cy = (y1 + y2) / 2 + radius * Math.sin(centerAngle) * Math.sin(offset);

  const startAngle = Math.atan2(y1 - cy, x1 - cx);
  let endAngle = Math.atan2(y2 - cy, x2 - cx);

  // Adjust end angle based on sweep flag
  if (!sweep && endAngle > startAngle) {
    endAngle -= 2 * Math.PI;
  } else if (sweep && endAngle < startAngle) {
    endAngle += 2 * Math.PI;
  }

  return { cx, cy, startAngle, endAngle };
}

/**
 * Parse SVG path data into array of points
 * Samples points along the path at regular intervals
 *
 * @param pathData - SVG path d attribute string
 * @param sampleRate - Number of samples per unit length (default: 10)
 * @returns Array of points along the path
 */
export function parseSVGPath(
  pathData: string,
  sampleRate: number = 10
): Point[] {
  const commands = parsePathCommands(pathData);
  const points: Point[] = [];

  // Create a temporary canvas to measure path lengths
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return points;

  // First pass: execute commands to get the path
  executePathCommands(ctx, commands);

  // Sample points along the path
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;

  for (const cmd of commands) {
    switch (cmd.type) {
      case 'M': {
        const x = cmd.relative ? currentX + cmd.x : cmd.x;
        const y = cmd.relative ? currentY + cmd.y : cmd.y;
        points.push({ x, y });
        currentX = x;
        currentY = y;
        startX = x;
        startY = y;
        break;
      }
      case 'L': {
        const x = cmd.relative ? currentX + cmd.x : cmd.x;
        const y = cmd.relative ? currentY + cmd.y : cmd.y;
        sampleLine(points, currentX, currentY, x, y, sampleRate);
        currentX = x;
        currentY = y;
        break;
      }
      case 'H': {
        const x = cmd.relative ? currentX + cmd.x : cmd.x;
        sampleLine(points, currentX, currentY, x, currentY, sampleRate);
        currentX = x;
        break;
      }
      case 'V': {
        const y = cmd.relative ? currentY + cmd.y : cmd.y;
        sampleLine(points, currentX, currentY, currentX, y, sampleRate);
        currentY = y;
        break;
      }
      case 'C': {
        const x1 = cmd.relative ? currentX + cmd.x1 : cmd.x1;
        const y1 = cmd.relative ? currentY + cmd.y1 : cmd.y1;
        const x2 = cmd.relative ? currentX + cmd.x2 : cmd.x2;
        const y2 = cmd.relative ? currentY + cmd.y2 : cmd.y2;
        const x = cmd.relative ? currentX + cmd.x : cmd.x;
        const y = cmd.relative ? currentY + cmd.y : cmd.y;
        sampleBezier(
          points,
          currentX,
          currentY,
          x1,
          y1,
          x2,
          y2,
          x,
          y,
          sampleRate
        );
        currentX = x;
        currentY = y;
        break;
      }
      case 'Q': {
        const x1 = cmd.relative ? currentX + cmd.x1 : cmd.x1;
        const y1 = cmd.relative ? currentY + cmd.y1 : cmd.y1;
        const x = cmd.relative ? currentX + cmd.x : cmd.x;
        const y = cmd.relative ? currentY + cmd.y : cmd.y;
        sampleQuadratic(points, currentX, currentY, x1, y1, x, y, sampleRate);
        currentX = x;
        currentY = y;
        break;
      }
      case 'Z': {
        if (currentX !== startX || currentY !== startY) {
          sampleLine(points, currentX, currentY, startX, startY, sampleRate);
        }
        currentX = startX;
        currentY = startY;
        break;
      }
    }
  }

  return points;
}

/**
 * Sample points along a line segment
 */
function sampleLine(
  points: Point[],
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  sampleRate: number
): void {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const numSamples = Math.max(1, Math.floor(length * sampleRate));

  for (let i = 1; i <= numSamples; i++) {
    const t = i / numSamples;
    points.push({
      x: x1 + dx * t,
      y: y1 + dy * t,
    });
  }
}

/**
 * Sample points along a cubic bezier curve
 */
function sampleBezier(
  points: Point[],
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  sampleRate: number
): void {
  // Estimate curve length
  const roughLength =
    Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2) +
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) +
    Math.sqrt((x3 - x2) ** 2 + (y3 - y2) ** 2);

  const numSamples = Math.max(1, Math.floor(roughLength * sampleRate));

  for (let i = 1; i <= numSamples; i++) {
    const t = i / numSamples;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    points.push({
      x: mt3 * x0 + 3 * mt2 * t * x1 + 3 * mt * t2 * x2 + t3 * x3,
      y: mt3 * y0 + 3 * mt2 * t * y1 + 3 * mt * t2 * y2 + t3 * y3,
    });
  }
}

/**
 * Sample points along a quadratic bezier curve
 */
function sampleQuadratic(
  points: Point[],
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  sampleRate: number
): void {
  // Estimate curve length
  const roughLength =
    Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2) +
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const numSamples = Math.max(1, Math.floor(roughLength * sampleRate));

  for (let i = 1; i <= numSamples; i++) {
    const t = i / numSamples;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const t2 = t * t;

    points.push({
      x: mt2 * x0 + 2 * mt * t * x1 + t2 * x2,
      y: mt2 * y0 + 2 * mt * t * y1 + t2 * y2,
    });
  }
}

/**
 * Extract stroke guide data from character template
 *
 * @param template - Character template containing stroke data
 * @returns Array of guide paths with stroke order
 */
export function strokeGuidePaths(template: CharacterTemplate): GuidePath[] {
  return template.strokes.map((stroke, index) => ({
    id: stroke.id || `stroke-${index}`,
    pathData: stroke.pathData,
    order: stroke.order !== undefined ? stroke.order : index,
  }));
}

/**
 * Create a path string from array of points
 * Useful for creating simplified path data
 *
 * @param points - Array of points
 * @param smooth - Whether to use smooth curves (quadratic bezier)
 * @returns SVG path d attribute string
 */
export function pointsToPath(points: Point[], smooth: boolean = false): string {
  if (points.length === 0) return '';

  let path = `M ${points[0].x} ${points[0].y}`;

  if (smooth && points.length > 2) {
    // Use quadratic curves for smooth paths
    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      path += ` Q ${points[i].x} ${points[i].y} ${xc} ${yc}`;
    }
    path += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
  } else {
    // Use straight lines
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
  }

  return path;
}
