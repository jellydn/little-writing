import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { COLORS, UI_CONFIG } from '../../styles/theme';
const getCategoryDisplayName = (category) => {
    switch (category) {
        case 'number':
            return 'Numbers';
        case 'uppercase':
            return 'Uppercase Letters';
        case 'lowercase':
            return 'Lowercase Letters';
    }
};
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: COLORS.background,
};
const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    backgroundColor: '#ffffff',
    borderBottom: `1px solid ${COLORS.outlineBorder}`,
    minHeight: `${UI_CONFIG.MIN_TOUCH_TARGET + 16}px`,
};
const backButtonStyle = {
    minWidth: `${UI_CONFIG.MIN_TOUCH_TARGET * 2}px`,
    minHeight: `${UI_CONFIG.MIN_TOUCH_TARGET}px`,
    fontSize: '18px',
    fontWeight: '600',
    color: COLORS.highlight,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    padding: '8px 0',
    transition: 'opacity 0.2s',
};
const titleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    margin: 0,
};
const scrollContainerStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
};
const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '16px',
    justifyContent: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
};
const getCardStyle = (isPressed) => ({
    width: '120px',
    height: '120px',
    minWidth: `${UI_CONFIG.MIN_TOUCH_TARGET * 2}px`,
    minHeight: `${UI_CONFIG.MIN_TOUCH_TARGET * 2}px`,
    backgroundColor: COLORS.outline,
    borderRadius: '16px',
    padding: '20px',
    cursor: 'pointer',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.15s, box-shadow 0.15s',
    transform: isPressed ? 'scale(0.95)' : 'translateY(0)',
    boxShadow: isPressed
        ? '0 2px 4px rgba(0, 0, 0, 0.1)'
        : '0 4px 8px rgba(0, 0, 0, 0.1)',
    outline: 'none',
});
const characterTextStyle = {
    fontSize: '48px',
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
    userSelect: 'none',
};
export const CharacterGrid = ({ category, characters, onSelectCharacter, onBack, }) => {
    const [pressedCharacter, setPressedCharacter] = React.useState(null);
    const handleCharacterSelect = (character) => {
        onSelectCharacter(character);
    };
    const handlePointerDown = (char) => {
        setPressedCharacter(char);
    };
    const handlePointerUp = () => {
        setPressedCharacter(null);
    };
    const handlePointerLeave = () => {
        setPressedCharacter(null);
    };
    const handleKeyDown = (e, character) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCharacterSelect(character);
        }
    };
    return (_jsxs("div", { style: containerStyle, children: [_jsxs("header", { style: headerStyle, children: [_jsx("h2", { className: "visually-hidden", children: getCategoryDisplayName(category) }), _jsx("button", { style: backButtonStyle, onClick: onBack, "aria-label": "Go back to category selection", children: "\u2190 Back" }), _jsx("h1", { style: titleStyle, children: getCategoryDisplayName(category) }), _jsx("div", { style: { minWidth: `${UI_CONFIG.MIN_TOUCH_TARGET * 2}px` } })] }), _jsx("div", { style: scrollContainerStyle, children: _jsx("div", { style: gridStyle, role: "list", "aria-label": `${getCategoryDisplayName(category)} grid`, children: characters.map((character) => {
                        const isPressed = pressedCharacter === character.character;
                        return (_jsx("button", { style: getCardStyle(isPressed), onClick: () => handleCharacterSelect(character), onPointerDown: () => handlePointerDown(character.character), onPointerUp: handlePointerUp, onPointerLeave: handlePointerLeave, onKeyDown: (e) => handleKeyDown(e, character), "aria-label": `Select ${character.displayName || character.character}`, role: "listitem", children: _jsx("span", { style: characterTextStyle, children: character.character }) }, character.character));
                    }) }) })] }));
};
