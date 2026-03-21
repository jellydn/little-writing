import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppStore } from '@/state/sessionStore';

// Mock the sound player to avoid audio issues in tests
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

describe('AppLayout', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.setState({
        currentScreen: 'category-selection',
        currentCategory: 'uppercase',
        currentCharacter: null,
        session: null,
      });
    });
  });

  it('should render category selection screen by default', () => {
    render(<AppLayout />);
    expect(screen.getByText('Select a Category')).toBeInTheDocument();
  });

  it('should render skip link for accessibility', () => {
    render(<AppLayout />);
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
  });

  it('should have a main content area with id', () => {
    render(<AppLayout />);
    expect(document.getElementById('main-content')).toBeInTheDocument();
  });

  it('should render character selection screen when state is character-selection', () => {
    act(() => {
      useAppStore.setState({
        currentScreen: 'character-selection',
        currentCategory: 'uppercase',
        currentCharacter: null,
        session: null,
      });
    });
    render(<AppLayout />);
    expect(screen.getByText(/Select Letter/i)).toBeInTheDocument();
  });

  it('should navigate to category selection when selectCategory is called', () => {
    render(<AppLayout />);

    act(() => {
      useAppStore.getState().selectCategory('number');
    });

    expect(screen.getByText(/Select Number/i)).toBeInTheDocument();
  });

  it('should fall back to category selection when tracing screen has no character', () => {
    act(() => {
      useAppStore.setState({
        currentScreen: 'tracing',
        currentCategory: 'uppercase',
        currentCharacter: null,
        session: null,
      });
    });
    render(<AppLayout />);
    // Should fall back to category selection
    expect(screen.getByText('Select a Category')).toBeInTheDocument();
  });
});
