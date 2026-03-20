import { jsx as _jsx } from "react/jsx-runtime";
import styles from './Button.module.css';
/**
 * Reusable button component with child-friendly design.
 *
 * Features:
 * - Minimum 44x44 touch target size for accessibility (per constitution)
 * - Bright, engaging colors from theme.ts
 * - Press/active visual feedback with scale animations
 * - Three variants: primary (corral), secondary (teal), action (yellow)
 * - Full accessibility support with aria-label and focus states
 */
export const Button = ({ variant = 'primary', onClick, children, className = '', disabled = false, 'aria-label': ariaLabel, ...props }) => {
    const buttonClass = [
        styles.button,
        styles[variant],
        disabled ? styles.disabled : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');
    return (_jsx("button", { className: buttonClass, onClick: onClick, disabled: disabled, "aria-label": ariaLabel, ...props, children: children }));
};
export default Button;
