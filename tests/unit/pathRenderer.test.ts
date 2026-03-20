/**
 * Unit tests for pathRenderer.ts
 *
 * Tests SVG path parsing, canvas rendering, and path utilities
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  type CharacterTemplate,
  type Point,
  parseSVGPath,
  pointsToPath,
  type RenderOptions,
  renderSVGPath,
  strokeGuidePaths,
} from '@/lib/canvas/pathRenderer';

// Helper to create a mock canvas element
const createMockCanvas = () => {
  const mockCtx = {
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    bezierCurveTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    arc: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    beginPath: vi.fn(),
  };

  const canvas = document.createElement('canvas');
  canvas.getContext = vi.fn(
    () => mockCtx
  ) as unknown as typeof canvas.getContext;

  return { canvas, mockCtx };
};

describe('renderSVGPath', () => {
  let mockCtx: CanvasRenderingContext2D;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let canvasMock: any;

  beforeEach(() => {
    // Setup canvas mock
    const canvasData = createMockCanvas();
    canvasMock = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(canvasData.canvas);
    mockCtx = canvasData.mockCtx as unknown as CanvasRenderingContext2D;
  });

  afterEach(() => {
    canvasMock.mockRestore();
  });

  it('should render a simple line path', () => {
    const pathData = 'M 0 0 L 100 100';
    const options: RenderOptions = {
      strokeColor: '#000000',
      strokeWidth: 2,
    };

    renderSVGPath(mockCtx, pathData, options);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(100, 100);
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('should apply default options when none provided', () => {
    const pathData = 'M 0 0 L 100 0';

    renderSVGPath(mockCtx, pathData);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('should apply custom stroke color and width', () => {
    const pathData = 'M 0 0 L 100 0';
    const options: RenderOptions = {
      strokeColor: '#FF0000',
      strokeWidth: 5,
      lineCap: 'square',
      lineJoin: 'miter',
    };

    renderSVGPath(mockCtx, pathData, options);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('should apply fill when fillColor is provided', () => {
    const pathData = 'M 0 0 L 100 0 L 100 100 Z';
    const options: RenderOptions = {
      strokeColor: '#000000',
      fillColor: '#FF0000',
    };

    renderSVGPath(mockCtx, pathData, options);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.fill).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('should apply scale and offset transformations', () => {
    const pathData = 'M 0 0 L 100 0';
    const options: RenderOptions = {
      scale: 2,
      offsetX: 10,
      offsetY: 20,
    };

    renderSVGPath(mockCtx, pathData, options);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.translate).toHaveBeenCalledWith(10, 20);
    expect(mockCtx.scale).toHaveBeenCalledWith(2, 2);
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('should render horizontal line (H command)', () => {
    const pathData = 'M 0 0 H 100';

    renderSVGPath(mockCtx, pathData);

    expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(100, 0);
  });

  it('should render vertical line (V command)', () => {
    const pathData = 'M 0 0 V 100';

    renderSVGPath(mockCtx, pathData);

    expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(0, 100);
  });

  it('should render cubic bezier curve (C command)', () => {
    const pathData = 'M 0 0 C 50 50, 100 50, 150 0';

    renderSVGPath(mockCtx, pathData);

    expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(mockCtx.bezierCurveTo).toHaveBeenCalledWith(50, 50, 100, 50, 150, 0);
  });

  it('should render quadratic curve (Q command)', () => {
    const pathData = 'M 0 0 Q 75 100, 150 0';

    renderSVGPath(mockCtx, pathData);

    expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(mockCtx.quadraticCurveTo).toHaveBeenCalledWith(75, 100, 150, 0);
  });

  it('should close path with Z command', () => {
    const pathData = 'M 0 0 L 100 0 L 100 100 Z';

    renderSVGPath(mockCtx, pathData);

    expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(mockCtx.closePath).toHaveBeenCalled();
  });

  it('should handle relative commands (lowercase)', () => {
    const pathData = 'm 0 0 l 100 0 l 0 100';

    renderSVGPath(mockCtx, pathData);

    expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(100, 0);
    expect(mockCtx.lineTo).toHaveBeenCalledWith(100, 100);
  });

  it('should handle multiple move commands in sequence', () => {
    const pathData = 'M 0 0 L 50 50 M 100 0 L 150 50';

    renderSVGPath(mockCtx, pathData);

    expect(mockCtx.moveTo).toHaveBeenCalledWith(0, 0);
    expect(mockCtx.moveTo).toHaveBeenCalledWith(100, 0);
  });
});

describe('parseSVGPath', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let canvasMock: any;

  beforeEach(() => {
    // Setup canvas mock for parseSVGPath
    const canvasData = createMockCanvas();
    canvasMock = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(canvasData.canvas);
  });

  afterEach(() => {
    canvasMock.mockRestore();
  });

  it('should parse empty path string', () => {
    const points = parseSVGPath('');
    expect(points).toEqual([]);
  });

  it('should parse single point from move command', () => {
    const points = parseSVGPath('M 100 100');

    expect(points).toHaveLength(1);
    expect(points[0]).toEqual({ x: 100, y: 100 });
  });

  it('should parse line and sample points', () => {
    const points = parseSVGPath('M 0 0 L 100 0', 1);

    expect(points.length).toBeGreaterThan(1);
    expect(points[0]).toEqual({ x: 0, y: 0 });
    expect(points[points.length - 1]).toEqual({ x: 100, y: 0 });
  });

  it('should parse horizontal line', () => {
    const points = parseSVGPath('M 0 0 H 100', 1);

    expect(points.length).toBeGreaterThan(1);
    expect(points[0]).toEqual({ x: 0, y: 0 });
    expect(points[points.length - 1].x).toBe(100);
    expect(points[points.length - 1].y).toBe(0);
  });

  it('should parse vertical line', () => {
    const points = parseSVGPath('M 0 0 V 100', 1);

    expect(points.length).toBeGreaterThan(1);
    expect(points[0]).toEqual({ x: 0, y: 0 });
    expect(points[points.length - 1].x).toBe(0);
    expect(points[points.length - 1].y).toBe(100);
  });

  it('should close path with Z command', () => {
    const points = parseSVGPath('M 0 0 L 100 0 L 100 100 Z', 1);

    // Should return to start
    const lastPoint = points[points.length - 1];
    expect(lastPoint.x).toBe(0);
    expect(lastPoint.y).toBe(0);
  });

  it('should handle relative move command', () => {
    const points = parseSVGPath('m 50 50 l 20 0', 1);

    expect(points[0]).toEqual({ x: 50, y: 50 });
    expect(points[points.length - 1].x).toBe(70);
    expect(points[points.length - 1].y).toBe(50);
  });

  it('should sample more points with higher sample rate', () => {
    const lowSample = parseSVGPath('M 0 0 L 100 0', 1);
    const highSample = parseSVGPath('M 0 0 L 100 0', 10);

    expect(highSample.length).toBeGreaterThan(lowSample.length);
  });

  it('should parse quadratic curve', () => {
    const points = parseSVGPath('M 0 0 Q 50 50 100 0', 1);

    expect(points.length).toBeGreaterThan(1);
    expect(points[0]).toEqual({ x: 0, y: 0 });
  });

  it('should parse cubic bezier curve', () => {
    const points = parseSVGPath('M 0 0 C 25 25, 75 25, 100 0', 1);

    expect(points.length).toBeGreaterThan(1);
    expect(points[0]).toEqual({ x: 0, y: 0 });
  });
});

describe('strokeGuidePaths', () => {
  it('should extract stroke guide paths from template', () => {
    const template: CharacterTemplate = {
      character: 'A',
      strokes: [
        { id: 'stroke-1', pathData: 'M 10 90 L 50 10', order: 0 },
        { id: 'stroke-2', pathData: 'M 50 10 L 90 90', order: 1 },
        { id: 'stroke-3', pathData: 'M 30 50 L 70 50', order: 2 },
      ],
      width: 100,
      height: 100,
    };

    const guides = strokeGuidePaths(template);

    expect(guides).toHaveLength(3);
    expect(guides[0].id).toBe('stroke-1');
    expect(guides[0].pathData).toBe('M 10 90 L 50 10');
    expect(guides[0].order).toBe(0);
  });

  it('should generate default IDs for strokes without IDs', () => {
    const template: CharacterTemplate = {
      character: 'A',
      strokes: [
        { id: '', pathData: 'M 10 90 L 50 10', order: 0 },
        { id: '', pathData: 'M 50 10 L 90 90', order: 1 },
      ],
      width: 100,
      height: 100,
    };

    const guides = strokeGuidePaths(template);

    expect(guides).toHaveLength(2);
    expect(guides[0].id).toBe('stroke-0');
    expect(guides[1].id).toBe('stroke-1');
  });

  it('should generate default order values when not provided', () => {
    const template: CharacterTemplate = {
      character: 'A',
      strokes: [
        { id: 's1', pathData: 'M 10 90 L 50 10' },
        { id: 's2', pathData: 'M 50 10 L 90 90' },
      ],
      width: 100,
      height: 100,
    };

    const guides = strokeGuidePaths(template);

    expect(guides[0].order).toBe(0);
    expect(guides[1].order).toBe(1);
  });

  it('should handle empty strokes array', () => {
    const template: CharacterTemplate = {
      character: 'A',
      strokes: [],
      width: 100,
      height: 100,
    };

    const guides = strokeGuidePaths(template);

    expect(guides).toEqual([]);
  });
});

describe('pointsToPath', () => {
  it('should return empty string for empty points', () => {
    const path = pointsToPath([]);
    expect(path).toBe('');
  });

  it('should return move command for single point', () => {
    const points: Point[] = [{ x: 100, y: 100 }];
    const path = pointsToPath(points);

    expect(path).toBe('M 100 100');
  });

  it('should create linear path by default', () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 50 },
      { x: 0, y: 50 },
    ];
    const path = pointsToPath(points, false);

    expect(path).toBe('M 0 0 L 50 0 L 50 50 L 0 50');
  });

  it('should create smooth path with quadratic curves', () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 25, y: 0 },
      { x: 50, y: 0 },
      { x: 75, y: 0 },
      { x: 100, y: 0 },
    ];
    const path = pointsToPath(points, true);

    expect(path).toContain('M 0 0');
    expect(path).toContain('Q');
    expect(path).toContain('L 100 0');
  });

  it('should handle two points correctly', () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 100, y: 100 },
    ];
    const path = pointsToPath(points);

    expect(path).toBe('M 0 0 L 100 100');
  });

  it('should create smooth path for three points', () => {
    const points: Point[] = [
      { x: 0, y: 0 },
      { x: 50, y: 50 },
      { x: 100, y: 0 },
    ];
    const path = pointsToPath(points, true);

    // With 3 points and smooth=true, should use Q command
    expect(path).toContain('Q');
  });
});
