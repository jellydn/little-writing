import { jsx as _jsx } from "react/jsx-runtime";
/**
 * App Component
 *
 * Main application entry point that initializes and wraps the app layout.
 * Handles app initialization on mount.
 *
 * Based on specs/001-handwriting-tracing/contracts/ui-contracts.md
 * Task: T034
 */
import { useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
/**
 * Main App component
 *
 * Initializes the app and renders the layout which manages screen routing.
 */
export const App = () => {
    // Initialize app on mount
    useEffect(() => {
        // Prevent default touch behaviors that interfere with drawing
        const preventDefaultTouch = (e) => {
            if (e.target instanceof HTMLElement) {
                // Allow button clicks
                if (e.target.tagName === 'BUTTON') {
                    return;
                }
            }
            e.preventDefault();
        };
        // Add touch event listeners to prevent scrolling/zooming while drawing
        document.addEventListener('touchmove', preventDefaultTouch, {
            passive: false,
        });
        document.addEventListener('touchstart', preventDefaultTouch, {
            passive: false,
        });
        return () => {
            document.removeEventListener('touchmove', preventDefaultTouch);
            document.removeEventListener('touchstart', preventDefaultTouch);
        };
    }, []);
    return _jsx(AppLayout, {});
};
export default App;
