/**
 * React Entry Point
 *
 * Mounts the React application to the DOM using React 18's createRoot API.
 * Imports global styles and initializes the app.
 *
 * Based on specs/001-handwriting-tracing/contracts/ui-contracts.md
 * Task: T035
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App';
import './styles/globals.css';

// Get the root element from the DOM
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Root element not found. Check index.html has a div with id="root".'
  );
}

// Create and render the React 18 root
ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
