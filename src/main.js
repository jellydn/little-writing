import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App';
import './styles/globals.css';
// Get the root element from the DOM
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element not found. Check index.html has a div with id="root".');
}
// Create and render the React 18 root
ReactDOM.createRoot(rootElement).render(_jsx(StrictMode, { children: _jsx(App, {}) }));
