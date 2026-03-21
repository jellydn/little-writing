/**
 * Integration Tests: Navigation Flow
 *
 * Tests the complete user flow for navigating between characters
 * and handling back/next/previous navigation.
 *
 * User flows:
 * 1. Complete character -> Tap Next -> Next character loads
 * 2. Previous/Next button availability based on position
 * 3. Back button returns to character selection
 * 4. Category navigation from character selection
 */

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppStore } from '@/state/sessionStore';

// Mock the sound player
vi.mock('@/lib/feedback/soundPlayer', () => ({
  playSuccessSound: vi.fn(),
}));

// Mock useCanvas hook
vi.mock('@/hooks/useCanvas', () => ({
  useCanvas: vi.fn(() => ({
    canvasRef: { current: document.createElement('canvas') },
    ctx: {
      save: vi.fn(),
      restore: vi.fn(),
      fillStyle: '',
      fillRect: vi.fn(),
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
      clip: vi.fn(),
      bezierCurveTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      arc: vi.fn(),
    } as unknown as CanvasRenderingContext2D,
    clear: vi.fn(),
  })),
}));

describe('Navigation Flow Integration', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useAppStore.setState({
        currentScreen: 'category-selection',
        currentCategory: 'number',
        currentCharacter: null,
        session: null,
      });
    });
  });

  it("should enable Next button when there's a next character", async () => {
    render(<AppLayout />);

    act(() => {
      useAppStore.getState().selectCategory('number');
    });

    await waitFor(() => {
      expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
    });

    const characterButton = screen.getByText('0');
    fireEvent.click(characterButton);

    await waitFor(() => {
      expect(screen.getByText(/Trace:/i)).toBeInTheDocument();
    });

    // Next button should be enabled if there's a next character
    const nextButton = screen.getByLabelText('Next character');
    expect(nextButton).not.toBeDisabled();
  });

  it('should navigate to next character when Next is clicked', async () => {
    render(<AppLayout />);

    // Navigate to character "0"
    act(() => {
      useAppStore.getState().selectCategory('number');
    });

    await waitFor(() => {
      expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
    });

    const characterButton = screen.getByText('0');
    fireEvent.click(characterButton);

    await waitFor(() => {
      expect(screen.getByText(/Trace:/i)).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    // Complete the stroke
    act(() => {
      const store = useAppStore.getState();
      store.startStroke({ x: 50, y: 10 });
      store.endStroke();
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Next character')).not.toBeDisabled();
    });

    // Click Next button
    const nextButton = screen.getByLabelText('Next character');
    fireEvent.click(nextButton);

    // Should navigate to character '1'
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it('should disable Previous button on first character', async () => {
    render(<AppLayout />);

    act(() => {
      useAppStore.getState().selectCategory('number');
    });

    await waitFor(() => {
      expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
    });

    const characterButton = screen.getByText('0');
    fireEvent.click(characterButton);

    await waitFor(() => {
      expect(screen.getByText(/Trace:/i)).toBeInTheDocument();
    });

    // Previous button should be disabled on first character
    const previousButton = screen.getByLabelText('Previous character');
    expect(previousButton).toBeDisabled();
  });

  it('should enable Previous button on second character', async () => {
    render(<AppLayout />);

    // Navigate to second character directly
    act(() => {
      useAppStore.getState().selectCategory('number');
      const store = useAppStore.getState();
      // Manually navigate to character '1'
      store.selectCharacter({
        character: '1',
        category: 'number',
        displayName: 'One',
        bounds: { width: 100, height: 100, viewBox: '0 0 100 100' },
        strokes: [
          {
            id: 1,
            path: 'M 50 20 L 50 80',
            startPoint: { x: 50, y: 20 },
            endPoint: { x: 50, y: 80 },
            guidePoints: [
              { x: 50, y: 20 },
              { x: 50, y: 80 },
            ],
          },
        ],
        totalStrokes: 1,
      });
    });

    await waitFor(() => {
      expect(screen.getByText(/Trace:/i)).toBeInTheDocument();
    });

    // Previous button should be enabled on second character
    const previousButton = screen.getByLabelText('Previous character');
    expect(previousButton).not.toBeDisabled();
  });

  it('should navigate to previous character when Previous is clicked', async () => {
    render(<AppLayout />);

    // Navigate to second character directly
    act(() => {
      useAppStore.getState().selectCategory('number');
      const store = useAppStore.getState();
      store.selectCharacter({
        character: '1',
        category: 'number',
        displayName: 'One',
        bounds: { width: 100, height: 100, viewBox: '0 0 100 100' },
        strokes: [
          {
            id: 1,
            path: 'M 50 20 L 50 80',
            startPoint: { x: 50, y: 20 },
            endPoint: { x: 50, y: 80 },
            guidePoints: [
              { x: 50, y: 20 },
              { x: 50, y: 80 },
            ],
          },
        ],
        totalStrokes: 1,
      });
    });

    await waitFor(() => {
      expect(screen.getByText(/Trace:/i)).toBeInTheDocument();
    });

    // Click Previous button
    const previousButton = screen.getByLabelText('Previous character');
    fireEvent.click(previousButton);

    // Should navigate to character '0'
    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  it('should navigate back to character selection when Back is clicked', async () => {
    render(<AppLayout />);

    // Navigate to tracing screen
    act(() => {
      useAppStore.getState().selectCategory('number');
    });

    await waitFor(() => {
      expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
    });

    const characterButton = screen.getByText('0');
    fireEvent.click(characterButton);

    await waitFor(() => {
      expect(screen.getByText(/Trace:/i)).toBeInTheDocument();
    });

    // Click Back button in tracing header
    const backButton = screen.getAllByText('← Back')[0];
    fireEvent.click(backButton);

    // Should navigate back to category selection
    await waitFor(() => {
      expect(screen.getByText('Select a Category')).toBeInTheDocument();
    });
  });

  it('should navigate back to category selection from character selection', async () => {
    render(<AppLayout />);

    // Navigate to character selection
    const numbersButton = screen.getByText('Numbers');
    fireEvent.click(numbersButton);

    await waitFor(() => {
      expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
    });

    // Click Back button
    const backButton = screen.getByText('← Back');
    fireEvent.click(backButton);

    // Should return to category selection
    await waitFor(() => {
      expect(screen.getByText('Select a Category')).toBeInTheDocument();
    });
  });

  it('should maintain category when navigating between characters', async () => {
    render(<AppLayout />);

    // Select uppercase category
    const uppercaseButton = screen.getByText('Uppercase');
    fireEvent.click(uppercaseButton);

    await waitFor(() => {
      expect(screen.getByText(/Select Letter/i)).toBeInTheDocument();
    });

    // Select character 'A' via aria-label
    const characterA = screen.getByLabelText('Select A');
    fireEvent.click(characterA);

    await waitFor(() => {
      expect(screen.getByText(/Trace:/i)).toBeInTheDocument();
    });

    // Verify category is preserved
    expect(useAppStore.getState().currentCategory).toBe('uppercase');
  });

  it('should complete character and navigate to next', async () => {
    render(<AppLayout />);

    // Navigate to first character
    act(() => {
      useAppStore.getState().selectCategory('number');
    });

    await waitFor(() => {
      expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
    });

    const characterButton = screen.getByText('0');
    fireEvent.click(characterButton);

    await waitFor(() => {
      expect(screen.getByText(/Trace:/i)).toBeInTheDocument();
    });

    // Complete the stroke
    act(() => {
      const store = useAppStore.getState();
      store.startStroke({ x: 50, y: 10 });
      store.endStroke();
    });

    // Wait for success
    await waitFor(() => {
      expect(screen.getByText('Great job!')).toBeInTheDocument();
    });

    // Click Next
    const nextButton = screen.getByLabelText('Next character');
    fireEvent.click(nextButton);

    // Should load next character
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      // Success message should be gone
      expect(screen.queryByText('Great job!')).not.toBeInTheDocument();
    });
  });
});
