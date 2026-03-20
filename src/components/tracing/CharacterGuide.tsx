/**
 * CharacterGuide Component
 *
 * Renders stroke guide paths as visual dotted lines with start point indicators.
 * Highlights the current stroke with a pulsing animation.
 *
 * Features:
 * - Dotted line visualization for stroke paths
 * - Pulsing animation for current stroke
 * - Start point indicators
 * - Completed stroke highlighting
 *
 * Reference: specs/001-handwriting-tracing/components/character-guide.md
 */

import React from 'react';
import { Line, Circle, Group } from 'react-konva';
import type { CharacterTemplate, Point } from '@/types';
import { COLORS, UI_CONFIG } from '@/styles/theme';

interface CharacterGuideProps {
  /** Character template with stroke guide data */
  template: CharacterTemplate;
  /** Index of the stroke user should draw next */
  currentStrokeIndex: number;
  /** Array of completed stroke indices */
  completedStrokes: number[];
  /** Scale factor for rendering */
  scale: number;
  /** X offset for centering */
  offsetX: number;
  /** Y offset for centering */
  offsetY: number;
}

/**
 * Converts Point array to Konva Line flat array format
 */
function pointsToKonvaLine(
  points: Point[],
  scale: number,
  offsetX: number,
  offsetY: number
): number[] {
  return points.flatMap((p) => [p.x * scale + offsetX, p.y * scale + offsetY]);
}

export const CharacterGuide: React.FC<CharacterGuideProps> = ({
  template,
  currentStrokeIndex,
  completedStrokes,
  scale,
  offsetX,
  offsetY,
}) => {
  // Calculate animation phase for pulsing effect
  const [pulsePhase, setPulsePhase] = React.useState(0);

  // Animate pulse for current stroke
  React.useEffect(() => {
    if (currentStrokeIndex >= template.strokes.length) return;

    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 0.05) % (Math.PI * 2));
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [currentStrokeIndex, template.strokes.length]);

  // Calculate pulse opacity (0.6 to 1.0)
  const pulseOpacity = 0.6 + Math.sin(pulsePhase) * 0.2;

  return (
    <Group listening={false}>
      {template.strokes.map((stroke, index) => {
        const isCompleted = completedStrokes.includes(index);
        const isCurrent = index === currentStrokeIndex;
        const isPending = index > currentStrokeIndex;

        // Determine stroke color
        const strokeColor = isCompleted
          ? COLORS.correct
          : isCurrent
            ? COLORS.highlight
            : COLORS.guide;

        // Determine opacity
        const opacity = isCurrent ? pulseOpacity : isPending ? 0.4 : 0.7;

        // Determine dash pattern (completed = solid, others = dotted)
        const dashPattern = isCompleted ? [] : [8, 8];

        // Get start point for indicator
        const startPoint = stroke.guidePoints[0];
        if (!startPoint) return null;

        const startX = startPoint.x * scale + offsetX;
        const startY = startPoint.y * scale + offsetY;

        return (
          <Group key={stroke.id}>
            {/* Stroke path line */}
            <Line
              points={pointsToKonvaLine(
                stroke.guidePoints,
                scale,
                offsetX,
                offsetY
              )}
              stroke={strokeColor}
              strokeWidth={UI_CONFIG.GUIDE_LINE_WIDTH}
              lineCap="round"
              lineJoin="round"
              dash={dashPattern}
              opacity={opacity}
            />

            {/* Start point indicator */}
            <Circle
              x={startX}
              y={startY}
              radius={isCurrent ? 10 : 6}
              fill={isCurrent ? COLORS.highlight : COLORS.guide}
              opacity={isCurrent ? pulseOpacity : 0.6}
            />

            {/* Outer ring for current stroke start point */}
            {isCurrent && (
              <Circle
                x={startX}
                y={startY}
                radius={14 + Math.sin(pulsePhase) * 2}
                stroke={COLORS.highlight}
                strokeWidth={2}
                opacity={pulseOpacity * 0.5}
              />
            )}
          </Group>
        );
      })}
    </Group>
  );
};
