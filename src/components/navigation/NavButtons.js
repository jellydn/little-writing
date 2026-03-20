import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '../ui/Button';
import './NavButtons.css';
export const NavButtons = ({ hasNext, hasPrevious, isSessionComplete, onNext, onPrevious, onBack, onClear, }) => {
    const isNextEnabled = hasNext && isSessionComplete;
    const isPreviousEnabled = hasPrevious;
    return (_jsxs("div", { className: "nav-buttons", children: [_jsx(Button, { variant: "secondary", onClick: onBack, "aria-label": "Go back to character selection", children: "Back" }), _jsxs("div", { className: "nav-buttons__center", children: [_jsx(Button, { variant: "primary", onClick: onPrevious, disabled: !isPreviousEnabled, "aria-label": "Previous character", children: "Previous" }), _jsx(Button, { variant: "action", onClick: onNext, disabled: !isNextEnabled, "aria-label": "Next character", children: "Next" })] }), _jsx(Button, { variant: "action", onClick: onClear, "aria-label": "Clear drawing and start over", children: "Clear" })] }));
};
