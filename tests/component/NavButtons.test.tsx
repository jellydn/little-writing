import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NavButtons } from '@/components/navigation/NavButtons';

describe('NavButtons', () => {
  const mockOnNext = vi.fn();
  const mockOnPrevious = vi.fn();

  beforeEach(() => {
    mockOnNext.mockClear();
    mockOnPrevious.mockClear();
  });

  it('should render previous and next buttons', () => {
    render(
      <NavButtons
        hasNext={true}
        hasPrevious={true}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />
    );
    expect(
      screen.getByRole('button', { name: 'Previous character' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Next character' })
    ).toBeInTheDocument();
  });

  it('should disable previous button when hasPrevious is false', () => {
    render(
      <NavButtons
        hasNext={true}
        hasPrevious={false}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />
    );
    expect(
      screen.getByRole('button', { name: 'Previous character' })
    ).toBeDisabled();
  });

  it('should disable next button when hasNext is false', () => {
    render(
      <NavButtons
        hasNext={false}
        hasPrevious={true}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />
    );
    expect(
      screen.getByRole('button', { name: 'Next character' })
    ).toBeDisabled();
  });

  it('should call onPrevious when previous button is clicked', () => {
    render(
      <NavButtons
        hasNext={true}
        hasPrevious={true}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Previous character' }));
    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it('should call onNext when next button is clicked', () => {
    render(
      <NavButtons
        hasNext={true}
        hasPrevious={true}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next character' }));
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('should have both buttons disabled when both hasNext and hasPrevious are false', () => {
    render(
      <NavButtons
        hasNext={false}
        hasPrevious={false}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />
    );
    expect(
      screen.getByRole('button', { name: 'Previous character' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Next character' })
    ).toBeDisabled();
  });

  it('should have both buttons enabled when both hasNext and hasPrevious are true', () => {
    render(
      <NavButtons
        hasNext={true}
        hasPrevious={true}
        onNext={mockOnNext}
        onPrevious={mockOnPrevious}
      />
    );
    expect(
      screen.getByRole('button', { name: 'Previous character' })
    ).not.toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Next character' })
    ).not.toBeDisabled();
  });
});
