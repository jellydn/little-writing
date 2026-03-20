/**
 * Vitest Test Setup
 *
 * Configures testing-library and global test utilities.
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as unknown as typeof IntersectionObserver;

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) =>
  setTimeout(callback, 0) as unknown as number;

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

// Mock pointer events for canvas
class MockPointerEvent extends MouseEvent {
  public pointerId: number;
  public pointerType: string;
  public pressure: number;

  constructor(
    type: string,
    eventInitDict: PointerEventInit & {
      width?: number;
      height?: number;
    } = {}
  ) {
    super(type, eventInitDict);
    this.pointerId = eventInitDict.pointerId ?? 0;
    this.pointerType = eventInitDict.pointerType ?? 'mouse';
    this.pressure = eventInitDict.pressure ?? 0.5;

    // Define read-only properties but configurable for tests
    Object.defineProperty(this, 'offsetX', {
      value: eventInitDict.clientX ?? 0,
      writable: false,
      configurable: true,
    });
    Object.defineProperty(this, 'offsetY', {
      value: eventInitDict.clientY ?? 0,
      writable: false,
      configurable: true,
    });
    Object.defineProperty(this, 'width', {
      value: eventInitDict.width ?? 10,
      writable: false,
      configurable: true,
    });
    Object.defineProperty(this, 'height', {
      value: eventInitDict.height ?? 10,
      writable: false,
      configurable: true,
    });
  }

  preventDefault() {
    // Mock preventDefault
  }
}

global.PointerEvent = MockPointerEvent as typeof PointerEvent;
