import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CategorySelector } from '@/components/navigation/CategorySelector';

describe('CategorySelector', () => {
  const mockOnSelectCategory = vi.fn();

  beforeEach(() => {
    mockOnSelectCategory.mockClear();
  });

  it('should render all category cards', () => {
    render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

    expect(screen.getByText('Numbers')).toBeInTheDocument();
    expect(screen.getByText('Letters')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('ABC')).toBeInTheDocument();
  });

  it('should call onSelectCategory when Numbers card is clicked', () => {
    render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

    const numbersCard = screen.getByLabelText('Select numbers');
    fireEvent.click(numbersCard);

    expect(mockOnSelectCategory).toHaveBeenCalledTimes(1);
    expect(mockOnSelectCategory).toHaveBeenCalledWith('number');
  });

  it('should call onSelectCategory when Letters card is clicked', () => {
    render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

    const lettersCard = screen.getByLabelText('Select letters');
    fireEvent.click(lettersCard);

    expect(mockOnSelectCategory).toHaveBeenCalledTimes(1);
    expect(mockOnSelectCategory).toHaveBeenCalledWith('uppercase');
  });

  it('should handle keyboard navigation with Enter key', () => {
    render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

    const numbersCard = screen.getByLabelText('Select numbers');
    fireEvent.keyDown(numbersCard, { key: 'Enter' });

    expect(mockOnSelectCategory).toHaveBeenCalledWith('number');
  });

  it('should handle keyboard navigation with Space key', () => {
    render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

    const lettersCard = screen.getByLabelText('Select letters');
    fireEvent.keyDown(lettersCard, { key: ' ' });

    expect(mockOnSelectCategory).toHaveBeenCalledWith('uppercase');
  });

  it('should not call onSelectCategory for other keys', () => {
    render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

    const numbersCard = screen.getByLabelText('Select numbers');
    fireEvent.keyDown(numbersCard, { key: 'a' });

    expect(mockOnSelectCategory).not.toHaveBeenCalled();
  });

  it('should apply hover styles on mouse enter', () => {
    render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

    const numbersCard = screen.getByLabelText('Select numbers');
    fireEvent.mouseEnter(numbersCard);

    expect(numbersCard).toHaveStyle({
      transform: 'translateY(-4px)',
    });
  });

  it('should apply active styles on mouse down', () => {
    render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

    const numbersCard = screen.getByLabelText('Select numbers');
    fireEvent.mouseDown(numbersCard);

    expect(numbersCard).toHaveStyle({
      transform: 'translateY(-2px) scale(0.98)',
    });
  });

  it('should reset hover state on mouse leave', () => {
    render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

    const numbersCard = screen.getByLabelText('Select numbers');
    fireEvent.mouseEnter(numbersCard);
    fireEvent.mouseLeave(numbersCard);

    expect(numbersCard).not.toHaveStyle({
      transform: 'translateY(-4px)',
    });
  });

  it('should reset active state on mouse up', () => {
    render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

    const numbersCard = screen.getByLabelText('Select numbers');
    fireEvent.mouseDown(numbersCard);
    fireEvent.mouseUp(numbersCard);

    expect(numbersCard).not.toHaveStyle({
      transform: 'translateY(-2px) scale(0.98)',
    });
  });

  it('should have accessible role and tabIndex', () => {
    render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

    const numbersCard = screen.getByLabelText('Select numbers');
    expect(numbersCard).toHaveAttribute('role', 'button');
    expect(numbersCard).toHaveAttribute('tabIndex', '0');
  });

  it('should have hidden heading for screen readers', () => {
    render(<CategorySelector onSelectCategory={mockOnSelectCategory} />);

    const heading = screen.getByText('Choose a category');
    expect(heading).toHaveClass('visually-hidden');
  });
});
