import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('should render children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    render(<Button onClick={mockOnClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    render(
      <Button onClick={mockOnClick} disabled>
        Click me
      </Button>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should have disabled attribute when disabled', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should render with aria-label', () => {
    render(<Button aria-label="Test button">Click me</Button>);
    expect(
      screen.getByRole('button', { name: 'Test button' })
    ).toBeInTheDocument();
  });

  it('should render primary variant by default', () => {
    render(<Button>Primary</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render action variant', () => {
    render(<Button variant="action">Action</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should not be disabled by default', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });
});
