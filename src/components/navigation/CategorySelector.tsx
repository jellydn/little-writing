import React from 'react';
import { COLORS, UI_CONFIG } from '../../styles/theme';
import type { Category } from '../../types';

interface CategorySelectorProps {
  onSelectCategory: (category: Category) => void;
}

interface CategoryCard {
  id: Category;
  label: string;
  backgroundColor: string;
  icon: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    id: 'number',
    label: 'Numbers',
    backgroundColor: '#FF6B6B',
    icon: '1',
  },
  {
    id: 'uppercase',
    label: 'Uppercase',
    backgroundColor: '#4ECDC4',
    icon: 'A',
  },
  {
    id: 'lowercase',
    label: 'Lowercase',
    backgroundColor: '#9B59B6',
    icon: 'a',
  },
];

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '24px',
  padding: '40px 20px',
  minHeight: '100vh',
  backgroundColor: COLORS.background,
};

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: `${UI_CONFIG.MIN_TOUCH_TARGET * 4}px`,
  minHeight: `${UI_CONFIG.MIN_TOUCH_TARGET * 4}px`,
  padding: '32px 48px',
  borderRadius: '24px',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const cardHoverStyle: React.CSSProperties = {
  ...cardStyle,
  transform: 'translateY(-4px)',
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
};

const cardActiveStyle: React.CSSProperties = {
  ...cardStyle,
  transform: 'translateY(-2px) scale(0.98)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const iconStyle: React.CSSProperties = {
  fontSize: '48px',
  fontWeight: 'bold',
  marginBottom: '16px',
  opacity: 0.7,
};

const labelStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: '600',
  color: COLORS.textDark,
  margin: 0,
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  onSelectCategory,
}) => {
  const [hoveredCategory, setHoveredCategory] = React.useState<Category | null>(
    null
  );
  const [activeCategory, setActiveCategory] = React.useState<Category | null>(
    null
  );

  const handleCategoryClick = (category: Category) => {
    onSelectCategory(category);
  };

  const handleMouseEnter = (category: Category) => {
    setHoveredCategory(category);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  const handleMouseDown = (category: Category) => {
    setActiveCategory(category);
  };

  const handleMouseUp = () => {
    setActiveCategory(null);
  };

  return (
    <div style={containerStyle}>
      <h1 className="visually-hidden">Choose a category</h1>
      {CATEGORIES.map((category) => {
        const isHovered = hoveredCategory === category.id;
        const isActive = activeCategory === category.id;

        let cardStyles = cardStyle;
        if (isActive) {
          cardStyles = cardActiveStyle;
        } else if (isHovered) {
          cardStyles = cardHoverStyle;
        }

        return (
          <button
            key={category.id}
            type="button"
            style={{
              ...cardStyles,
              backgroundColor: category.backgroundColor,
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() => handleCategoryClick(category.id)}
            onMouseEnter={() => handleMouseEnter(category.id)}
            onMouseLeave={handleMouseLeave}
            onMouseDown={() => handleMouseDown(category.id)}
            onMouseUp={handleMouseUp}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCategoryClick(category.id);
              }
            }}
            aria-label={`Select ${category.label}`}
          >
            <span style={iconStyle}>{category.icon}</span>
            <span style={labelStyle}>{category.label}</span>
          </button>
        );
      })}
    </div>
  );
};
