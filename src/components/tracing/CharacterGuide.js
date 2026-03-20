import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { COLORS, UI_CONFIG } from '@/styles/theme';
/**
 * Converts Point array to Konva Line flat array format
 */
function pointsToKonvaLine(points, scale, offsetX, offsetY) {
    return points.flatMap((p) => [p.x * scale + offsetX, p.y * scale + offsetY]);
}
export const CharacterGuide = ({ template, currentStrokeIndex, completedStrokes, scale, offsetX, offsetY, }) => {
    // Calculate animation phase for pulsing effect
    const [pulsePhase, setPulsePhase] = React.useState(0);
    // Animate pulse for current stroke
    React.useEffect(() => {
        if (currentStrokeIndex >= template.strokes.length)
            return;
        const interval = setInterval(() => {
            setPulsePhase((prev) => (prev + 0.05) % (Math.PI * 2));
        }, 16); // ~60fps
        return () => clearInterval(interval);
    }, [currentStrokeIndex, template.strokes.length]);
    // Calculate pulse opacity (0.6 to 1.0)
    const pulseOpacity = 0.6 + Math.sin(pulsePhase) * 0.2;
    return (_jsx(Group, { listening: false, children: template.strokes.map((stroke, index) => {
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
            if (!startPoint)
                return null;
            const startX = startPoint.x * scale + offsetX;
            const startY = startPoint.y * scale + offsetY;
            return (_jsxs(Group, { children: [_jsx(Line, { points: pointsToKonvaLine(stroke.guidePoints, scale, offsetX, offsetY), stroke: strokeColor, strokeWidth: UI_CONFIG.GUIDE_LINE_WIDTH, lineCap: "round", lineJoin: "round", dash: dashPattern, opacity: opacity }), _jsx(Circle, { x: startX, y: startY, radius: isCurrent ? 10 : 6, fill: isCurrent ? COLORS.highlight : COLORS.guide, opacity: isCurrent ? pulseOpacity : 0.6 }), isCurrent && (_jsx(Circle, { x: startX, y: startY, radius: 14 + Math.sin(pulsePhase) * 2, stroke: COLORS.highlight, strokeWidth: 2, opacity: pulseOpacity * 0.5 }))] }, stroke.id));
        }) }));
};
