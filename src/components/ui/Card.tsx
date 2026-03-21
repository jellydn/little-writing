import React from 'react';
import styles from './Card.module.css';

export interface CardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Card content */
  children: React.ReactNode;
  /** Visual variant of the card */
  variant?: 'default' | 'category' | 'character';
  /** Whether the card is selected */
  selected?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Accessibility label */
  'aria-label'?: string;
}

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
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  selected = false,
  onClick,
  className = '',
  'aria-label': ariaLabel,
  ...buttonProps
}) => {
  const variantClass = styles[variant] || styles.default;
  const selectedClass = selected ? styles.selected : '';

  return (
    <button
      className={`${styles.card} ${variantClass} ${selectedClass} ${className}`.trim()}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={selected}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default Card;
