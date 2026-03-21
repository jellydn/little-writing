/**
 * App Component
 *
 * Main application entry point that initializes and wraps the app layout.
 *
 * Touch event prevention is handled at the canvas level via CSS (touch-action: none)
 * to avoid accessibility issues with document-level event blocking.
 *
 * Based on specs/001-handwriting-tracing/contracts/ui-contracts.md
 * Task: T034
 */

import type React from 'react';
import { AppLayout } from './components/layout/AppLayout';

/**
 * Main App component
 */
export const App: React.FC = () => {
  return <AppLayout />;
};

export default App;
