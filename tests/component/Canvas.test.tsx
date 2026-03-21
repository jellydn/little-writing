import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Canvas } from '@/components/tracing/Canvas';
import type { CharacterTemplate, DrawingSession } from '@/types';

// Mock the useCanvas hook to avoid canvas context issues in jsdom
vi.mock('@/hooks/useCanvas', () => ({
  useCanvas: vi.fn(() => ({
    canvasRef: { current: document.createElement('canvas') },
    ctx: {
      save: vi.fn(),
      restore: vi.fn(),
      fillStyle: '',
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      strokeStyle: '',
      lineWidth: 0,
      lineCap: '',
      lineJoin: '',
      setLineDash: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      bezierCurveTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      arc: vi.fn(),
    } as unknown as CanvasRenderingContext2D,
    clear: vi.fn(),
    render: vi.fn(),
    width: 300,
    height: 300,
  })),
}));

const mockTemplate: CharacterTemplate = {
  character: 'A',
  category: 'uppercase',
  displayName: 'Letter A',
  bounds: { width: 100, height: 100, viewBox: '0 0 100 100' },
  strokes: [
    {
      id: 1,
      path: 'M 10 90 L 50 10 L 90 90',
      startPoint: { x: 10, y: 90 },
      endPoint: { x: 90, y: 90 },
      guidePoints: [
        { x: 10, y: 90 },
        { x: 50, y: 10 },
        { x: 90, y: 90 },
      ],
    },
  ],
  totalStrokes: 1,
};

const mockSession: DrawingSession = {
  template: mockTemplate,
  strokes: [],
  currentStrokeIndex: 0,
  isComplete: false,
  startedAt: Date.now(),
  lastActivityAt: Date.now(),
};

describe('Canvas', () => {
  const defaultProps = {
    template: mockTemplate,
    session: mockSession,
    width: 300,
    height: 300,
    onStrokeStart: vi.fn(),
    onStrokeMove: vi.fn(),
    onStrokeEnd: vi.fn(),
  };

  it('should render a canvas element', () => {
    render(<Canvas {...defaultProps} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should have correct width and height attributes', () => {
    render(<Canvas {...defaultProps} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toHaveAttribute('width', '300');
    expect(canvas).toHaveAttribute('height', '300');
  });

  it('should have aria-label with template displayName', () => {
    render(<Canvas {...defaultProps} />);
    const canvas = screen.getByRole('img', {
      name: /Drawing canvas for tracing Letter A/i,
    });
    expect(canvas).toBeInTheDocument();
  });

  it('should use character when displayName is not provided', () => {
    const templateWithoutDisplayName: CharacterTemplate = {
      ...mockTemplate,
      displayName: undefined,
    };
    render(<Canvas {...defaultProps} template={templateWithoutDisplayName} />);
    const canvas = screen.getByRole('img', {
      name: /Drawing canvas for tracing A/i,
    });
    expect(canvas).toBeInTheDocument();
  });

  it('should render visually hidden instructions', () => {
    render(<Canvas {...defaultProps} />);
    const instructions = document.querySelector('.visually-hidden');
    expect(instructions).toBeInTheDocument();
    expect(instructions?.textContent).toMatch(/Letter A/i);
  });

  it('should have role="img"', () => {
    render(<Canvas {...defaultProps} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toHaveAttribute('role', 'img');
  });

  it('should have aria-describedby pointing to instructions', () => {
    render(<Canvas {...defaultProps} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toHaveAttribute(
      'aria-describedby',
      `canvas-instructions-${mockTemplate.character}`
    );
  });

  it('should have touchAction: none on the canvas element', () => {
    render(<Canvas {...defaultProps} />);
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas.style.touchAction).toBe('none');
  });

  it('should render with a completed stroke in session', () => {
    const sessionWithStroke: DrawingSession = {
      ...mockSession,
      strokes: [
        {
          id: 1,
          points: [
            { x: 10, y: 10 },
            { x: 50, y: 50 },
          ],
          isComplete: true,
          isValid: true,
          accuracy: 0.95,
        },
      ],
      currentStrokeIndex: 1,
    };
    render(<Canvas {...defaultProps} session={sessionWithStroke} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should update when template changes', () => {
    const { rerender } = render(<Canvas {...defaultProps} />);
    const templateB: CharacterTemplate = {
      ...mockTemplate,
      character: 'B',
      displayName: 'Letter B',
    };
    rerender(<Canvas {...defaultProps} template={templateB} />);
    const canvas = screen.getByRole('img', {
      name: /Drawing canvas for tracing Letter B/i,
    });
    expect(canvas).toBeInTheDocument();
  });
});
