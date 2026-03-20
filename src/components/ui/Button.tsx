import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'action';
  /** Click handler */
  onClick?: () => void;
  /** Button content */
  children: React.ReactNode;
}

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
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  onClick,
  children,
  className = '',
  disabled = false,
  'aria-label': ariaLabel,
  ...props
}) => {
  const buttonClass = [
    styles.button,
    styles[variant],
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
