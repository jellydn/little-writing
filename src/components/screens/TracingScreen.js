import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Canvas } from '../tracing/Canvas';
import { SuccessAnimation } from '../tracing/SuccessAnimation';
import { NavButtons } from '../navigation/NavButtons';
import { getCategory } from '../../lib/templates/characterData';
import './TracingScreen.css';
export const TracingScreen = ({ template, session, onStrokeStart, onStrokeMove, onStrokeEnd, onNext, onPrevious, onBack, onClear, }) => {
    // Get category data for navigation
    const categoryData = getCategory(template.category);
    const currentIndex = categoryData.characters.findIndex((c) => c.character === template.character);
    const hasNext = currentIndex < categoryData.characters.length - 1;
    const hasPrevious = currentIndex > 0;
    return (_jsxs("div", { className: "tracing-screen", children: [_jsxs("header", { className: "tracing-header", children: [_jsxs("h2", { className: "visually-hidden", children: ["Tracing ", template.character] }), _jsx("button", { className: "back-button", onClick: onBack, "aria-label": "Back to character selection", style: { minHeight: '44px', minWidth: '44px', padding: '0 16px' }, children: "\u2190 Back" }), _jsxs("div", { className: "character-display", "aria-live": "polite", "aria-atomic": "true", children: [_jsx("span", { className: "character-label", children: "Trace:" }), _jsx("span", { className: "character-value", children: template.character })] })] }), _jsxs("main", { className: "tracing-canvas-container", children: [_jsx(Canvas, { template: template, session: session, width: 500, height: 500, onStrokeStart: onStrokeStart, onStrokeMove: onStrokeMove, onStrokeEnd: onStrokeEnd }), _jsx("div", { className: "progress-indicator", role: "status", "aria-live": "polite", "aria-atomic": "true", children: _jsxs("span", { children: ["Stroke ", session.currentStrokeIndex + 1, " of ", template.totalStrokes] }) }), session.isComplete && (_jsxs("div", { role: "status", "aria-live": "assertive", className: "visually-hidden", children: ["Great job! You completed tracing ", template.character, "!"] })), _jsx(SuccessAnimation, { isVisible: session.isComplete, onComplete: () => {
                            // Animation complete - can navigate to next character
                        } })] }), _jsx("nav", { className: "tracing-controls", "aria-label": "Character navigation", children: _jsx(NavButtons, { hasNext: hasNext, hasPrevious: hasPrevious, isSessionComplete: session.isComplete, onNext: onNext, onPrevious: onPrevious, onBack: onBack, onClear: onClear }) })] }));
};
