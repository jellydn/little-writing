import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Canvas Component - Placeholder
 *
 * TODO: Implement canvas drawing functionality
 */
import { forwardRef } from 'react';
export const Canvas = forwardRef((_props, ref) => {
    return (_jsx("canvas", { ref: ref, className: "drawing-canvas", width: 300, height: 300 }));
});
Canvas.displayName = 'Canvas';
