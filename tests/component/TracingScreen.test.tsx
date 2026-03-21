import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TracingScreen } from '@/components/screens/TracingScreen';
import type { CharacterTemplate, DrawingSession } from '@/types';

// Mock sound player to avoid audio issues in tests
vi.mock('@/lib/feedback/soundPlayer', () => ({
  playSuccessSound: vi.fn(),
}));

// Mock useCanvas hook to avoid canvas context issues in jsdom
vi.mock('@/hooks/useCanvas', () => ({
  useCanvas: vi.fn(() => ({
    canvasRef: { current: document.createElement('canvas') },
    ctx: null,
    clear: vi.fn(),
    render: vi.fn(),
    width: 300,
    height: 300,
  })),
}));

// Mock useCanvasSize to return a fixed size
vi.mock('@/hooks/useCanvasSize', () => ({
  useCanvasSize: vi.fn(() => 300),
}));

const mockTemplate: CharacterTemplate = {
  character: 'A',
  category: 'uppercase',
  displayName: 'Letter A',
  bounds: { width: 100, height: 100, viewBox: '0 0 100 100' },
  strokes: [
    {
      id: 1,
      path: 'M 10 90 L 50 10',
      startPoint: { x: 10, y: 90 },
      endPoint: { x: 50, y: 10 },
      guidePoints: [
        { x: 10, y: 90 },
        { x: 50, y: 10 },
      ],
    },
    {
      id: 2,
      path: 'M 30 50 L 70 50',
      startPoint: { x: 30, y: 50 },
      endPoint: { x: 70, y: 50 },
      guidePoints: [
        { x: 30, y: 50 },
        { x: 70, y: 50 },
      ],
    },
  ],
  totalStrokes: 2,
};

const mockSession: DrawingSession = {
  template: mockTemplate,
  strokes: [],
  currentStrokeIndex: 0,
  isComplete: false,
  startedAt: Date.now(),
  lastActivityAt: Date.now(),
};

const mockCategoryCharacters: CharacterTemplate[] = [
  { ...mockTemplate, character: 'A' },
  { ...mockTemplate, character: 'B' },
  { ...mockTemplate, character: 'C' },
];

describe('TracingScreen', () => {
  const mockHandlers = {
    onStrokeStart: vi.fn(),
    onStrokeMove: vi.fn(),
    onStrokeEnd: vi.fn(),
    onNext: vi.fn(),
    onPrevious: vi.fn(),
    onBack: vi.fn(),
    onClear: vi.fn(),
  };

  beforeEach(() => {
    Object.values(mockHandlers).forEach((fn) => fn.mockClear());
  });

  const defaultProps = {
    template: mockTemplate,
    session: mockSession,
    categoryCharacters: mockCategoryCharacters,
    ...mockHandlers,
  };

  it('should render the character being traced', () => {
    render(<TracingScreen {...defaultProps} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('should render a back button', () => {
    render(<TracingScreen {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: /Back to character selection/i })
    ).toBeInTheDocument();
  });

  it('should call onBack when back button is clicked', () => {
    render(<TracingScreen {...defaultProps} />);
    fireEvent.click(
      screen.getByRole('button', { name: /Back to character selection/i })
    );
    expect(mockHandlers.onBack).toHaveBeenCalledTimes(1);
  });

  it('should render a clear button', () => {
    render(<TracingScreen {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: /Clear drawing/i })
    ).toBeInTheDocument();
  });

  it('should call onClear when clear button is clicked', () => {
    render(<TracingScreen {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /Clear drawing/i }));
    expect(mockHandlers.onClear).toHaveBeenCalledTimes(1);
  });

  it('should show initial stroke prompt when no strokes started', () => {
    render(<TracingScreen {...defaultProps} />);
    expect(screen.getByText(/Start with stroke 1 of 2/i)).toBeInTheDocument();
  });

  it('should show stroke progress when session is in progress', () => {
    const sessionInProgress: DrawingSession = {
      ...mockSession,
      currentStrokeIndex: 1,
      strokes: [
        {
          id: 1,
          points: [{ x: 10, y: 90 }],
          isComplete: true,
          isValid: true,
          accuracy: 0.9,
        },
      ],
    };
    render(<TracingScreen {...defaultProps} session={sessionInProgress} />);
    expect(screen.getByText(/Stroke 2 of 2/i)).toBeInTheDocument();
  });

  it('should show completed status when session is complete', () => {
    const completedSession: DrawingSession = {
      ...mockSession,
      isComplete: true,
      currentStrokeIndex: 2,
    };
    render(<TracingScreen {...defaultProps} session={completedSession} />);
    expect(screen.getByText(/Completed 2 of 2 strokes/i)).toBeInTheDocument();
  });

  it('should show success animation when session is complete', () => {
    const completedSession: DrawingSession = {
      ...mockSession,
      isComplete: true,
    };
    render(<TracingScreen {...defaultProps} session={completedSession} />);
    expect(screen.getByText('Great job!')).toBeInTheDocument();
  });

  it('should not show success animation when session is not complete', () => {
    render(<TracingScreen {...defaultProps} />);
    expect(screen.queryByText('Great job!')).not.toBeInTheDocument();
  });

  it('should enable next button when not at last character', () => {
    render(<TracingScreen {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: /Next character/i })
    ).not.toBeDisabled();
  });

  it('should disable next button when at last character', () => {
    const lastTemplate: CharacterTemplate = { ...mockTemplate, character: 'C' };
    render(<TracingScreen {...defaultProps} template={lastTemplate} />);
    expect(
      screen.getByRole('button', { name: /Next character/i })
    ).toBeDisabled();
  });

  it('should disable previous button when at first character', () => {
    render(<TracingScreen {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: /Previous character/i })
    ).toBeDisabled();
  });

  it('should enable previous button when not at first character', () => {
    const middleTemplate: CharacterTemplate = {
      ...mockTemplate,
      character: 'B',
    };
    render(<TracingScreen {...defaultProps} template={middleTemplate} />);
    expect(
      screen.getByRole('button', { name: /Previous character/i })
    ).not.toBeDisabled();
  });

  it('should render canvas with correct template character', () => {
    render(<TracingScreen {...defaultProps} />);
    const canvas = screen.getByRole('img', {
      name: /Drawing canvas for tracing Letter A/i,
    });
    expect(canvas).toBeInTheDocument();
  });

  it('should have character navigation landmark', () => {
    render(<TracingScreen {...defaultProps} />);
    expect(
      screen.getByRole('navigation', { name: /Character navigation/i })
    ).toBeInTheDocument();
  });
});
