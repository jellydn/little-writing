import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Card } from '@/components/ui/Card';

describe('Card', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('should render children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    render(<Card onClick={mockOnClick}>Click me</Card>);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should have aria-pressed false when not selected', () => {
    render(<Card>Card</Card>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('should have aria-pressed true when selected', () => {
    render(<Card selected>Card</Card>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('should render with aria-label', () => {
    render(<Card aria-label="Card label">Card</Card>);
    expect(
      screen.getByRole('button', { name: 'Card label' })
    ).toBeInTheDocument();
  });

  it('should render with default variant', () => {
    render(<Card>Default</Card>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render with category variant', () => {
    render(<Card variant="category">Category</Card>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render with character variant', () => {
    render(<Card variant="character">Character</Card>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should be not selected by default', () => {
    render(<Card>Card</Card>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });
});
