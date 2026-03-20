import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Canvas } from '@/components/canvas/Canvas';
import type { DrawingSession } from '@/types';

describe('Canvas', () => {
  const mockSession: DrawingSession = {
    template: {
      character: 'A',
      category: 'uppercase',
      displayName: 'Letter A',
      bounds: { width: 100, height: 100, viewBox: '0 0 100 100' },
      strokes: [],
      totalStrokes: 3,
    },
    strokes: [],
    currentStrokeIndex: 0,
    isComplete: false,
    startedAt: Date.now(),
    lastActivityAt: Date.now(),
  };

  const mockOnStrokeStart = vi.fn();
  const mockOnStrokeMove = vi.fn();
  const mockOnStrokeEnd = vi.fn();

  beforeEach(() => {
    mockOnStrokeStart.mockClear();
    mockOnStrokeMove.mockClear();
    mockOnStrokeEnd.mockClear();
  });

  it('should render canvas element', () => {
    render(
      <Canvas
        session={mockSession}
        onStrokeStart={mockOnStrokeStart}
        onStrokeMove={mockOnStrokeMove}
        onStrokeEnd={mockOnStrokeEnd}
      />
    );

    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should have correct width and height attributes', () => {
    render(
      <Canvas
        session={mockSession}
        onStrokeStart={mockOnStrokeStart}
        onStrokeMove={mockOnStrokeMove}
        onStrokeEnd={mockOnStrokeEnd}
      />
    );

    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas).toHaveAttribute('width', '300');
    expect(canvas).toHaveAttribute('height', '300');
  });

  it('should have drawing-canvas class', () => {
    render(
      <Canvas
        session={mockSession}
        onStrokeStart={mockOnStrokeStart}
        onStrokeMove={mockOnStrokeMove}
        onStrokeEnd={mockOnStrokeEnd}
      />
    );

    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas).toHaveClass('drawing-canvas');
  });

  it('should accept forwarded ref', () => {
    const ref = React.createRef<HTMLCanvasElement>();

    render(
      <Canvas
        session={mockSession}
        onStrokeStart={mockOnStrokeStart}
        onStrokeMove={mockOnStrokeMove}
        onStrokeEnd={mockOnStrokeEnd}
        ref={ref}
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLCanvasElement);
  });

  it('should have correct display name', () => {
    expect(Canvas.displayName).toBe('Canvas');
  });

  it('should render with different session data', () => {
    const differentSession: DrawingSession = {
      ...mockSession,
      template: {
        character: 'B',
        category: 'uppercase',
        displayName: 'Letter B',
        bounds: { width: 150, height: 150, viewBox: '0 0 150 150' },
        strokes: [],
        totalStrokes: 2,
      },
    };

    render(
      <Canvas
        session={differentSession}
        onStrokeStart={mockOnStrokeStart}
        onStrokeMove={mockOnStrokeMove}
        onStrokeEnd={mockOnStrokeEnd}
      />
    );

    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should render when session is complete', () => {
    const completeSession: DrawingSession = {
      ...mockSession,
      isComplete: true,
    };

    render(
      <Canvas
        session={completeSession}
        onStrokeStart={mockOnStrokeStart}
        onStrokeMove={mockOnStrokeMove}
        onStrokeEnd={mockOnStrokeEnd}
      />
    );

    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});
