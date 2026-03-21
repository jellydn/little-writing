/**
 * useCanvasSize Hook
 *
 * Computes a responsive square canvas size that fills at least 60%
 * of the viewport height, capped by available space. Keeps the
 * canvas kid-friendly large on phones and tablets.
 */

import { useEffect, useState } from 'react';

/** Minimum canvas size as a fraction of viewport height */
const MIN_VH_FRACTION = 0.6;

/** Padding subtracted from each side of the viewport */
const VIEWPORT_PADDING = 32;

/** Header + footer approximate height */
const CHROME_HEIGHT = 140;

/**
 * Returns a square canvas side length (px) that is responsive to
 * the viewport while guaranteeing at least 60vh.
 */
export function useCanvasSize(): number {
  const [size, setSize] = useState<number>(() => computeSize());

  useEffect(() => {
    const onResize = (): void => setSize(computeSize());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
}

function computeSize(): number {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const minSize = Math.round(vh * MIN_VH_FRACTION);
  const maxByWidth = vw - VIEWPORT_PADDING * 2;
  const maxByHeight = vh - CHROME_HEIGHT;

  // At least 60vh, but don't exceed available width or height
  return Math.max(minSize, Math.min(maxByWidth, maxByHeight));
}
