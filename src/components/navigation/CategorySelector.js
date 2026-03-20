import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { COLORS, UI_CONFIG } from '../../styles/theme';
const CATEGORIES = [
    {
        id: 'number',
        label: 'Numbers',
        backgroundColor: '#E3F2FD',
        icon: '123',
    },
    {
        id: 'uppercase',
        label: 'Letters',
        backgroundColor: '#F3E5F5',
        icon: 'ABC',
    },
];
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    padding: '40px 20px',
    minHeight: '100vh',
    backgroundColor: COLORS.background,
};
const cardStyle = {
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
const cardHoverStyle = {
    ...cardStyle,
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
};
const cardActiveStyle = {
    ...cardStyle,
    transform: 'translateY(-2px) scale(0.98)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};
const iconStyle = {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '16px',
    opacity: 0.7,
};
const labelStyle = {
    fontSize: '28px',
    fontWeight: '600',
    color: COLORS.textDark,
    margin: 0,
};
export const CategorySelector = ({ onSelectCategory, }) => {
    const [hoveredCategory, setHoveredCategory] = React.useState(null);
    const [activeCategory, setActiveCategory] = React.useState(null);
    const handleCategoryClick = (category) => {
        onSelectCategory(category);
    };
    const handleMouseEnter = (category) => {
        setHoveredCategory(category);
    };
    const handleMouseLeave = () => {
        setHoveredCategory(null);
    };
    const handleMouseDown = (category) => {
        setActiveCategory(category);
    };
    const handleMouseUp = () => {
        setActiveCategory(null);
    };
    return (_jsxs("div", { style: containerStyle, children: [_jsx("h1", { className: "visually-hidden", children: "Choose a category" }), CATEGORIES.map((category) => {
                const isHovered = hoveredCategory === category.id;
                const isActive = activeCategory === category.id;
                let cardStyles = cardStyle;
                if (isActive) {
                    cardStyles = cardActiveStyle;
                }
                else if (isHovered) {
                    cardStyles = cardHoverStyle;
                }
                return (_jsxs("div", { style: {
                        ...cardStyles,
                        backgroundColor: category.backgroundColor,
                    }, onClick: () => handleCategoryClick(category.id), onMouseEnter: () => handleMouseEnter(category.id), onMouseLeave: handleMouseLeave, onMouseDown: () => handleMouseDown(category.id), onMouseUp: handleMouseUp, onKeyDown: (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleCategoryClick(category.id);
                        }
                    }, role: "button", tabIndex: 0, "aria-label": `Select ${category.label.toLowerCase()}`, children: [_jsx("div", { style: iconStyle, children: category.icon }), _jsx("p", { style: labelStyle, children: category.label })] }, category.id));
            })] }));
};
