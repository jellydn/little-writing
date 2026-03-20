import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CharacterGuide } from '@/components/canvas/CharacterGuide';
import type { CharacterTemplate } from '@/types';

describe('CharacterGuide', () => {
  const mockTemplate: CharacterTemplate = {
    character: 'A',
    category: 'uppercase',
    displayName: 'Letter A',
    bounds: { width: 100, height: 100, viewBox: '0 0 100 100' },
    strokes: [
      {
        id: 1,
        path: 'M 50 20 L 50 80',
        startPoint: { x: 50, y: 20 },
        endPoint: { x: 50, y: 80 },
        guidePoints: [
          { x: 50, y: 20 },
          { x: 50, y: 50 },
          { x: 50, y: 80 },
        ],
      },
      {
        id: 2,
        path: 'M 50 50 L 80 30',
        startPoint: { x: 50, y: 50 },
        endPoint: { x: 80, y: 30 },
        guidePoints: [
          { x: 50, y: 50 },
          { x: 65, y: 40 },
          { x: 80, y: 30 },
        ],
      },
      {
        id: 3,
        path: 'M 50 50 L 20 30',
        startPoint: { x: 50, y: 50 },
        endPoint: { x: 20, y: 30 },
        guidePoints: [
          { x: 50, y: 50 },
          { x: 35, y: 40 },
          { x: 20, y: 30 },
        ],
      },
    ],
    totalStrokes: 3,
  };

  it('should render character guide container', () => {
    render(<CharacterGuide template={mockTemplate} currentStrokeIndex={0} />);

    const guide = screen.getByText('A');
    expect(guide).toBeInTheDocument();
  });

  it('should render the character from template', () => {
    render(<CharacterGuide template={mockTemplate} currentStrokeIndex={0} />);

    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('should render different character', () => {
    const differentTemplate: CharacterTemplate = {
      ...mockTemplate,
      character: 'B',
      displayName: 'Letter B',
    };

    render(<CharacterGuide template={differentTemplate} currentStrokeIndex={0} />);

    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('should render number character', () => {
    const numberTemplate: CharacterTemplate = {
      ...mockTemplate,
      character: '1',
      category: 'number',
      displayName: 'Number 1',
    };

    render(<CharacterGuide template={numberTemplate} currentStrokeIndex={0} />);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should have character-guide class', () => {
    const { container } = render(
      <CharacterGuide template={mockTemplate} currentStrokeIndex={0} />
    );

    const guideElement = container.querySelector('.character-guide');
    expect(guideElement).toBeInTheDocument();
  });

  it('should accept currentStrokeIndex prop', () => {
    render(<CharacterGuide template={mockTemplate} currentStrokeIndex={1} />);

    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('should render with zero stroke index', () => {
    render(<CharacterGuide template={mockTemplate} currentStrokeIndex={0} />);

    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('should render with last stroke index', () => {
    render(
      <CharacterGuide template={mockTemplate} currentStrokeIndex={2} />
    );

    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('should handle template without displayName', () => {
    const templateWithoutDisplayName: CharacterTemplate = {
      ...mockTemplate,
      displayName: undefined,
    };

    render(
      <CharacterGuide template={templateWithoutDisplayName} currentStrokeIndex={0} />
    );

    expect(screen.getByText('A')).toBeInTheDocument();
  });
});
