import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const CharacterSelectionScreen = ({ category, characters, onSelectCharacter, onBack }) => {
    const categoryLabel = category === 'number' ? 'Number' : 'Letter';
    return (_jsxs("div", { className: "character-selection-screen", children: [_jsx("button", { onClick: onBack, "aria-label": "Go back to category selection", className: "back-button", children: "\u2190 Back" }), _jsxs("h1", { children: ["Select ", categoryLabel] }), _jsx("div", { className: "character-grid", role: "list", "aria-label": `${categoryLabel} characters`, children: characters.map((char) => (_jsx("button", { onClick: () => onSelectCharacter(char), "aria-label": `Select ${char.displayName || char.character}`, role: "listitem", className: "character-card", children: char.character }, char.character))) })] }));
};
