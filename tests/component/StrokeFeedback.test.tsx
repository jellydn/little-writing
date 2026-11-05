import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { StrokeFeedback } from '@/components/tracing/StrokeFeedback';
import type { Stroke } from '@/types';

const validStroke: Stroke = {
  id: 1,
  points: [
    { x: 0, y: 0 },
    { x: 100, y: 100 },
  ],
  isComplete: true,
  isValid: true,
  accuracy: 0.9,
};

const invalidStroke: Stroke = {
  id: 2,
  points: [
    { x: 0, y: 0 },
    { x: 100, y: 100 },
  ],
  isComplete: true,
  isValid: false,
  accuracy: 0.3,
};

describe('StrokeFeedback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should hide the visual overlay when not visible', () => {
    const { container } = render(
      <StrokeFeedback stroke={validStroke} isVisible={false} />
    );
    expect(container.querySelector('.stroke-feedback')).toBeNull();
  });

  it('should hide the visual overlay when stroke is null', () => {
    const { container } = render(
      <StrokeFeedback stroke={null} isVisible={true} />
    );
    expect(container.querySelector('.stroke-feedback')).toBeNull();
  });

  it('should hide the visual overlay when stroke isValid is null', () => {
    const pendingStroke: Stroke = { ...validStroke, isValid: null };
    const { container } = render(
      <StrokeFeedback stroke={pendingStroke} isVisible={true} />
    );
    expect(container.querySelector('.stroke-feedback')).toBeNull();
  });

  it('keeps an existing live region through feedback and dismissal', () => {
    const { rerender } = render(
      <StrokeFeedback stroke={null} isVisible={false} />
    );
    const status = screen.getByRole('status');
    expect(status).toBeEmptyDOMElement();

    rerender(<StrokeFeedback stroke={validStroke} isVisible={true} />);
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('Correct! Stroke complete.');
    expect(
      screen.getByText('✓').closest('[aria-hidden="true"]')
    ).not.toBeNull();

    rerender(<StrokeFeedback stroke={validStroke} isVisible={false} />);
    expect(status).toHaveTextContent('Correct! Stroke complete.');

    rerender(<StrokeFeedback stroke={invalidStroke} isVisible={true} />);
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('Try again. Stroke was off track.');

    rerender(<StrokeFeedback stroke={null} isVisible={false} />);
    expect(status).toBeEmptyDOMElement();
  });

  it('should render checkmark for valid stroke', () => {
    render(<StrokeFeedback stroke={validStroke} isVisible={true} />);
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('should render X mark for invalid stroke', () => {
    render(<StrokeFeedback stroke={invalidStroke} isVisible={true} />);
    expect(screen.getByText('✕')).toBeInTheDocument();
  });

  it('should call onComplete after 300ms for correct stroke', () => {
    const onComplete = vi.fn();
    render(
      <StrokeFeedback
        stroke={validStroke}
        isVisible={true}
        onComplete={onComplete}
      />
    );

    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should call onComplete after 500ms for incorrect stroke', () => {
    const onComplete = vi.fn();
    render(
      <StrokeFeedback
        stroke={invalidStroke}
        isVisible={true}
        onComplete={onComplete}
      />
    );

    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should apply feedback-correct class for valid stroke', () => {
    const { container } = render(
      <StrokeFeedback stroke={validStroke} isVisible={true} />
    );
    expect(container.querySelector('.feedback-correct')).toBeInTheDocument();
  });

  it('should apply feedback-incorrect class for invalid stroke', () => {
    const { container } = render(
      <StrokeFeedback stroke={invalidStroke} isVisible={true} />
    );
    expect(container.querySelector('.feedback-incorrect')).toBeInTheDocument();
  });
});
