import { jsx as _jsx } from "react/jsx-runtime";
import styles from './Card.module.css';
/**
 * Reusable card component for child-friendly UI.
 *
 * Features:
 * - Minimum 88x88 touch target size (2x accessibility requirement)
 * - Bright, engaging colors for kids
 * - Press/active visual feedback
 * - Multiple variants for different contexts
 * - Selected state for category/character selection
 * - Full keyboard navigation support
 */
export const Card = ({ children, variant = 'default', selected = false, onClick, className = '', 'aria-label': ariaLabel, ...buttonProps }) => {
    const variantClass = styles[variant] || styles.default;
    const selectedClass = selected ? styles.selected : '';
    return (_jsx("button", { className: `${styles.card} ${variantClass} ${selectedClass} ${className}`.trim(), onClick: onClick, "aria-label": ariaLabel, "aria-pressed": selected, ...buttonProps, children: children }));
};
export default Card;
