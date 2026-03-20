import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ErrorBoundary Component
 *
 * React error boundary that catches JavaScript errors in child component tree,
 * logs them, and displays a fallback UI.
 *
 * Task: T054
 */
import { Component } from 'react';
import './ErrorBoundary.css';
/**
 * Error boundary component for graceful error handling
 */
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.handleReset = () => {
            this.setState({ hasError: false, error: null });
        };
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        // Log error to console for development
        console.error('ErrorBoundary caught an error:', error);
        console.error('Error info:', errorInfo);
        // In production, you might want to send this to an error reporting service
        if (process.env.NODE_ENV === 'production') {
            // Example: sendToErrorService(error, errorInfo);
        }
    }
    render() {
        if (this.state.hasError) {
            return (_jsx("div", { className: "error-boundary", children: _jsxs("div", { className: "error-boundary__content", children: [_jsx("h1", { className: "error-boundary__title", children: "Oops!" }), _jsx("p", { className: "error-boundary__message", children: "Something went wrong. Let's try again!" }), process.env.NODE_ENV === 'development' && this.state.error && (_jsxs("details", { className: "error-boundary__details", children: [_jsx("summary", { children: "Error details" }), _jsx("pre", { children: this.state.error.toString() })] })), _jsx("button", { className: "error-boundary__button", onClick: this.handleReset, children: "Try Again" })] }) }));
        }
        return this.props.children;
    }
}
