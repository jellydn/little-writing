/**
 * Unit tests for strokeValidator.ts
 *
 * Tests distance calculation, accuracy scoring, and stroke validation
 */

import { describe, it, expect } from 'vitest';
import {
  pointToSegmentDistance,
  validateStroke,
  calculateAverageDeviation,
  findWorstDeviationPoint,
  type ValidationResult,
} from '@/lib/canvas/strokeValidator';
import type { Point, StrokePath } from '@/types';

describe('pointToSegmentDistance', () => {
  describe('point on segment', () => {
    it('should return 0 when point is exactly on the segment', () => {
      const point: Point = { x: 5, y: 5 };
      const start: Point = { x: 0, y: 5 };
      const end: Point = { x: 10, y: 5 };

      const distance = pointToSegmentDistance(point, start, end);
      expect(distance).toBe(0);
    });

    it('should return 0 when point equals segment start', () => {
      const point: Point = { x: 0, y: 0 };
      const start: Point = { x: 0, y: 0 };
      const end: Point = { x: 10, y: 10 };

      const distance = pointToSegmentDistance(point, start, end);
      expect(distance).toBe(0);
    });

    it('should return 0 when point equals segment end', () => {
      const point: Point = { x: 10, y: 10 };
      const start: Point = { x: 0, y: 0 };
      const end: Point = { x: 10, y: 10 };

      const distance = pointToSegmentDistance(point, start, end);
      expect(distance).toBe(0);
    });
  });

  describe('point off segment', () => {
    it('should calculate perpendicular distance to horizontal segment', () => {
      const point: Point = { x: 5, y: 10 };
      const start: Point = { x: 0, y: 0 };
      const end: Point = { x: 10, y: 0 };

      const distance = pointToSegmentDistance(point, start, end);
      expect(distance).toBe(10);
    });

    it('should calculate perpendicular distance to vertical segment', () => {
      const point: Point = { x: 10, y: 5 };
      const start: Point = { x: 0, y: 0 };
      const end: Point = { x: 0, y: 10 };

      const distance = pointToSegmentDistance(point, start, end);
      expect(distance).toBe(10);
    });

    it('should calculate distance to diagonal segment', () => {
      const point: Point = { x: 0, y: 10 };
      const start: Point = { x: 0, y: 0 };
      const end: Point = { x: 10, y: 10 };

      // Perpendicular distance from (0,10) to line y=x is about 7.07
      const distance = pointToSegmentDistance(point, start, end);
      expect(distance).toBeCloseTo(7.07, 1);
    });
  });

  describe('point projection outside segment', () => {
    it('should return distance to start when projection is before segment', () => {
      const point: Point = { x: -5, y: 5 };
      const start: Point = { x: 0, y: 5 };
      const end: Point = { x: 10, y: 5 };

      const distance = pointToSegmentDistance(point, start, end);
      expect(distance).toBe(5);
    });

    it('should return distance to end when projection is after segment', () => {
      const point: Point = { x: 15, y: 5 };
      const start: Point = { x: 0, y: 5 };
      const end: Point = { x: 10, y: 5 };

      const distance = pointToSegmentDistance(point, start, end);
      expect(distance).toBe(5);
    });
  });

  describe('degenerate segment', () => {
    it('should return distance to point when segment is zero-length', () => {
      const point: Point = { x: 10, y: 10 };
      const start: Point = { x: 5, y: 5 };
      const end: Point = { x: 5, y: 5 };

      const distance = pointToSegmentDistance(point, start, end);
      // Distance between (10,10) and (5,5) is about 7.07
      expect(distance).toBeCloseTo(7.07, 1);
    });
  });
});

describe('validateStroke', () => {
  const createGuidePath = (points: Point[]): StrokePath => ({
    id: 1,
    path: 'M 0 0 L 100 0',
    startPoint: points[0],
    endPoint: points[points.length - 1],
    guidePoints: points,
  });

  describe('edge cases', () => {
    it('should return incorrect for empty user points', () => {
      const userPoints: Point[] = [];
      const guidePath = createGuidePath([
        { x: 0, y: 0 },
        { x: 100, y: 0 },
      ]);

      const result: ValidationResult = validateStroke(userPoints, guidePath);

      expect(result.isCorrect).toBe(false);
      expect(result.accuracy).toBe(0);
      expect(result.feedbackColor).toBe('#FF5252');
    });

    it('should return correct for empty guide path', () => {
      const userPoints: Point[] = [{ x: 50, y: 50 }];
      const guidePath: StrokePath = {
        id: 1,
        path: '',
        startPoint: { x: 0, y: 0 },
        endPoint: { x: 0, y: 0 },
        guidePoints: [],
      };

      const result: ValidationResult = validateStroke(userPoints, guidePath);

      expect(result.isCorrect).toBe(true);
      expect(result.accuracy).toBe(1);
      expect(result.feedbackColor).toBe('#4CAF50');
    });

    it('should handle single guide point', () => {
      const userPoints: Point[] = [{ x: 25, y: 25 }];
      const guidePath = createGuidePath([{ x: 0, y: 0 }]);

      const result: ValidationResult = validateStroke(userPoints, guidePath);

      expect(result.accuracy).toBeLessThan(1);
      expect(result.isCorrect).toBe(false);
    });
  });

  describe('perfect match', () => {
    it('should return perfect accuracy for points on the guide path', () => {
      const userPoints: Point[] = [
        { x: 0, y: 0 },
        { x: 25, y: 0 },
        { x: 50, y: 0 },
        { x: 75, y: 0 },
        { x: 100, y: 0 },
      ];
      const guidePath = createGuidePath([
        { x: 0, y: 0 },
        { x: 100, y: 0 },
      ]);

      const result: ValidationResult = validateStroke(userPoints, guidePath);

      expect(result.isCorrect).toBe(true);
      expect(result.accuracy).toBe(1);
      expect(result.feedbackColor).toBe('#4CAF50');
    });
  });

  describe('within tolerance', () => {
    it('should accept points within tolerance distance', () => {
      const userPoints: Point[] = [
        { x: 0, y: 0 },
        { x: 25, y: 20 }, // 20px off, within 25px tolerance
        { x: 50, y: 0 },
        { x: 75, y: 20 },
        { x: 100, y: 0 },
      ];
      const guidePath = createGuidePath([
        { x: 0, y: 0 },
        { x: 100, y: 0 },
      ]);

      const result: ValidationResult = validateStroke(userPoints, guidePath);

      expect(result.isCorrect).toBe(true);
      expect(result.accuracy).toBeGreaterThan(0.7);
      expect(result.feedbackColor).toBe('#4CAF50');
    });
  });

  describe('outside tolerance', () => {
    it('should reject points outside tolerance distance', () => {
      const userPoints: Point[] = [
        { x: 0, y: 0 },
        { x: 25, y: 30 }, // 30px off, outside 25px tolerance
        { x: 50, y: 0 },
        { x: 75, y: 30 },
        { x: 100, y: 0 },
      ];
      const guidePath = createGuidePath([
        { x: 0, y: 0 },
        { x: 100, y: 0 },
      ]);

      const result: ValidationResult = validateStroke(userPoints, guidePath);

      expect(result.isCorrect).toBe(false);
      expect(result.accuracy).toBeLessThan(0.7);
      expect(result.feedbackColor).toBe('#FF5252');
    });
  });

  describe('partial accuracy', () => {
    it('should calculate correct accuracy percentage', () => {
      // 2 out of 4 points within tolerance = 50% accuracy
      const userPoints: Point[] = [
        { x: 0, y: 0 }, // on path
        { x: 25, y: 30 }, // off path
        { x: 50, y: 0 }, // on path
        { x: 75, y: 30 }, // off path
      ];
      const guidePath = createGuidePath([
        { x: 0, y: 0 },
        { x: 100, y: 0 },
      ]);

      const result: ValidationResult = validateStroke(userPoints, guidePath);

      expect(result.accuracy).toBe(0.5);
      expect(result.isCorrect).toBe(false);
    });
  });

  describe('multi-segment guide path', () => {
    it('should validate against L-shaped guide path', () => {
      const userPoints: Point[] = [
        { x: 0, y: 0 },
        { x: 50, y: 0 },
        { x: 50, y: 50 },
      ];
      const guidePath = createGuidePath([
        { x: 0, y: 0 },
        { x: 50, y: 0 },
        { x: 50, y: 50 },
      ]);

      const result: ValidationResult = validateStroke(userPoints, guidePath);

      expect(result.isCorrect).toBe(true);
      expect(result.accuracy).toBe(1);
    });
  });
});

describe('calculateAverageDeviation', () => {
  const createGuidePath = (points: Point[]): StrokePath => ({
    id: 1,
    path: 'M 0 0 L 100 0',
    startPoint: points[0],
    endPoint: points[points.length - 1],
    guidePoints: points,
  });

  it('should return 0 for empty input', () => {
    const guidePath = createGuidePath([{ x: 0, y: 0 }]);
    const deviation = calculateAverageDeviation([], guidePath);
    expect(deviation).toBe(0);
  });

  it('should return 0 for empty guide path', () => {
    const userPoints: Point[] = [{ x: 50, y: 50 }];
    const guidePath: StrokePath = {
      id: 1,
      path: '',
      startPoint: { x: 0, y: 0 },
      endPoint: { x: 0, y: 0 },
      guidePoints: [],
    };
    const deviation = calculateAverageDeviation(userPoints, guidePath);
    expect(deviation).toBe(0);
  });

  it('should calculate average deviation correctly', () => {
    const userPoints: Point[] = [
      { x: 0, y: 0 },
      { x: 50, y: 10 }, // 10px off
      { x: 100, y: 0 },
    ];
    const guidePath = createGuidePath([
      { x: 0, y: 0 },
      { x: 100, y: 0 },
    ]);

    const deviation = calculateAverageDeviation(userPoints, guidePath);
    expect(deviation).toBeCloseTo(3.33, 1);
  });

  it('should return 0 for perfect match', () => {
    const userPoints: Point[] = [
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 100, y: 0 },
    ];
    const guidePath = createGuidePath([
      { x: 0, y: 0 },
      { x: 100, y: 0 },
    ]);

    const deviation = calculateAverageDeviation(userPoints, guidePath);
    expect(deviation).toBe(0);
  });
});

describe('findWorstDeviationPoint', () => {
  const createGuidePath = (points: Point[]): StrokePath => ({
    id: 1,
    path: 'M 0 0 L 100 0',
    startPoint: points[0],
    endPoint: points[points.length - 1],
    guidePoints: points,
  });

  it('should return null for empty input', () => {
    const guidePath = createGuidePath([{ x: 0, y: 0 }]);
    const result = findWorstDeviationPoint([], guidePath);
    expect(result).toBeNull();
  });

  it('should return null for empty guide path', () => {
    const userPoints: Point[] = [{ x: 50, y: 50 }];
    const guidePath: StrokePath = {
      id: 1,
      path: '',
      startPoint: { x: 0, y: 0 },
      endPoint: { x: 0, y: 0 },
      guidePoints: [],
    };
    const result = findWorstDeviationPoint(userPoints, guidePath);
    expect(result).toBeNull();
  });

  it('should find point with maximum deviation', () => {
    const userPoints: Point[] = [
      { x: 0, y: 0 },
      { x: 25, y: 5 },
      { x: 50, y: 30 }, // worst point
      { x: 75, y: 10 },
      { x: 100, y: 0 },
    ];
    const guidePath = createGuidePath([
      { x: 0, y: 0 },
      { x: 100, y: 0 },
    ]);

    const result = findWorstDeviationPoint(userPoints, guidePath);

    expect(result).not.toBeNull();
    expect(result?.point).toEqual({ x: 50, y: 30 });
    expect(result?.distance).toBeCloseTo(30, 0);
  });

  it('should handle multiple points with same deviation', () => {
    const userPoints: Point[] = [
      { x: 0, y: 0 },
      { x: 50, y: 20 },
      { x: 100, y: 0 },
    ];
    const guidePath = createGuidePath([
      { x: 0, y: 0 },
      { x: 100, y: 0 },
    ]);

    const result = findWorstDeviationPoint(userPoints, guidePath);

    expect(result).not.toBeNull();
    expect(result?.distance).toBeCloseTo(20, 0);
  });
});
