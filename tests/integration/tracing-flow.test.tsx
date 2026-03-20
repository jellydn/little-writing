/**
 * Integration Tests: Tracing Flow
 *
 * Tests the complete user flow from selecting a category to tracing a character
 * and seeing the success animation.
 *
 * User flow:
 * 1. App starts on category selection screen
 * 2. User selects "Numbers" category
 * 3. User selects character "0"
 * 4. User traces the character
 * 5. Success animation appears
 */

import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppStore } from '@/state/sessionStore';

// Mock the sound player to avoid audio issues in tests
vi.mock('@/lib/feedback/soundPlayer', () => ({
  playSuccessSound: vi.fn(),
}));

// Mock useCanvas hook to avoid canvas context issues
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

describe('Tracing Flow Integration', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useAppStore.setState({
        currentScreen: 'category-selection',
        currentCategory: 'uppercase',
        currentCharacter: null,
        session: null,
      });
    });
  });

  it('should start on category selection screen', () => {
    render(<AppLayout />);

    expect(screen.getByText('Select a Category')).toBeInTheDocument();
    expect(screen.getByText('Numbers')).toBeInTheDocument();
    expect(screen.getByText('Letters')).toBeInTheDocument();
  });

  it('should navigate from category selection to character selection', async () => {
    render(<AppLayout />);

    // Click on Numbers category
    const numbersButton = screen.getByText('Numbers');
    fireEvent.click(numbersButton);

    // Should navigate to character selection
    await waitFor(() => {
      expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
    });
  });

  it('should navigate from character selection to tracing screen', async () => {
    render(<AppLayout />);

    // First navigate to character selection
    const numbersButton = screen.getByText('Numbers');
    fireEvent.click(numbersButton);

    await waitFor(() => {
      expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
    });

    // Select character "0"
    const characterButton = screen.getByText('0');
    fireEvent.click(characterButton);

    // Should navigate to tracing screen
    await waitFor(() => {
      expect(screen.getByText(/Trace:/i)).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  it('should display progress indicator when tracing', async () => {
    render(<AppLayout />);

    // Navigate to tracing screen
    act(() => {
      useAppStore.getState().selectCategory('number');
    });

    await waitFor(() => {
      expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
    });

    // Select character "1" (single stroke)
    const characterButton = screen.getByText('1');
    fireEvent.click(characterButton);

    // Check for progress indicator
    await waitFor(() => {
      expect(screen.getByText(/Stroke 1 of 1/i)).toBeInTheDocument();
    });
  });

  it('should show success animation when all strokes are complete', async () => {
    render(<AppLayout />);

    // Navigate to tracing screen
    act(() => {
      useAppStore.getState().selectCategory('number');
    });

    await waitFor(() => {
      expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
    });

    // Select character "1" (single stroke)
    const characterButton = screen.getByText('1');
    fireEvent.click(characterButton);

    await waitFor(() => {
      expect(screen.getByText(/Stroke 1 of 1/i)).toBeInTheDocument();
    });

    // Complete the stroke
    act(() => {
      const store = useAppStore.getState();
      store.startStroke({ x: 50, y: 20 });
      store.addStrokePoint({ x: 50, y: 50 });
      store.endStroke();
    });

    // Success should appear
    await waitFor(() => {
      expect(useAppStore.getState().session?.isComplete).toBe(true);
      expect(screen.getByText('Great job!')).toBeInTheDocument();
    });
  });

  it('should complete full flow: category -> character -> trace -> success', async () => {
    render(<AppLayout />);

    // Step 1: Select Numbers category
    const numbersButton = screen.getByText('Numbers');
    fireEvent.click(numbersButton);

    await waitFor(() => {
      expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
    });

    // Step 2: Select character "0"
    const characterButton = screen.getByText('0');
    fireEvent.click(characterButton);

    await waitFor(() => {
      expect(screen.getByText(/Trace:/i)).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    // Step 3: Complete the stroke
    act(() => {
      const store = useAppStore.getState();
      store.startStroke({ x: 50, y: 10 });
      store.addStrokePoint({ x: 50, y: 50 });
      store.endStroke();
    });

    // Step 4: Verify success
    await waitFor(() => {
      expect(useAppStore.getState().session?.isComplete).toBe(true);
      expect(screen.getByText('Great job!')).toBeInTheDocument();
    });
  });

  it('should update stroke count as user traces', async () => {
    render(<AppLayout />);

    // Navigate to tracing screen
    act(() => {
      useAppStore.getState().selectCategory('number');
    });

    await waitFor(() => {
      expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
    });

    // Select character "1"
    const characterButton = screen.getByText('1');
    fireEvent.click(characterButton);

    // Initial state: Stroke 1 of 1
    await waitFor(() => {
      expect(screen.getByText(/Stroke 1 of 1/i)).toBeInTheDocument();
    });

    // Complete the stroke
    act(() => {
      const store = useAppStore.getState();
      store.startStroke({ x: 50, y: 20 });
      store.endStroke();
    });

    // Verify completion
    await waitFor(() => {
      expect(useAppStore.getState().session?.isComplete).toBe(true);
    });
  });
});
