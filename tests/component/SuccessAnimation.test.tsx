import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SuccessAnimation } from '@/components/tracing/SuccessAnimation';

vi.mock('@/lib/feedback/soundPlayer', () => ({
  playSuccessSound: vi.fn(),
}));

// Import after mocking
import { playSuccessSound } from '@/lib/feedback/soundPlayer';

describe('SuccessAnimation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render null when not visible', () => {
    const { container } = render(<SuccessAnimation isVisible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render the animation container when visible', () => {
    const { container } = render(<SuccessAnimation isVisible={true} />);
    expect(container.querySelector('.success-animation')).toBeInTheDocument();
  });

  it('should render the star SVG when visible', () => {
    render(<SuccessAnimation isVisible={true} />);
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render "Great job!" text when visible', () => {
    render(<SuccessAnimation isVisible={true} />);
    expect(screen.getByText('Great job!')).toBeInTheDocument();
  });

  it('should play success sound when becoming visible', () => {
    render(<SuccessAnimation isVisible={true} />);
    expect(playSuccessSound).toHaveBeenCalledTimes(1);
  });

  it('should not play success sound when not visible', () => {
    render(<SuccessAnimation isVisible={false} />);
    expect(playSuccessSound).not.toHaveBeenCalled();
  });

  it('should not call onComplete when not visible', () => {
    const onComplete = vi.fn();
    render(<SuccessAnimation isVisible={false} onComplete={onComplete} />);

    act(() => {
      vi.runAllTimers();
    });

    expect(onComplete).not.toHaveBeenCalled();
  });

  it('should render confetti particles when visible', () => {
    const { container } = render(<SuccessAnimation isVisible={true} />);
    const successDiv = container.querySelector('.success-animation');
    expect(successDiv).toBeInTheDocument();

    // Confetti particles are rendered as div elements with absolute positioning
    // They are siblings to the star container and success text
    // We expect 12 confetti particles + 1 star container + 1 text div + 1 style tag = 15 children
    expect(successDiv?.children.length).toBe(15);
  });

  it('should not render star when not visible', () => {
    render(<SuccessAnimation isVisible={false} />);
    expect(document.querySelector('svg')).not.toBeInTheDocument();
  });
});
