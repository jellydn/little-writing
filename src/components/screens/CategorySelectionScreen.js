import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const CategorySelectionScreen = ({ onSelectCategory }) => {
    return (_jsxs("div", { className: "category-selection-screen", children: [_jsx("h1", { children: "Select a Category" }), _jsxs("div", { className: "category-grid", children: [_jsx("button", { onClick: () => onSelectCategory('number'), children: "Numbers" }), _jsx("button", { onClick: () => onSelectCategory('uppercase'), children: "Letters" })] })] }));
};
