/**
 * CSS Animations for the Kids Handwriting Tracing App
 *
 * Provides keyframe animations and utility classes for visual feedback:
 * - Success animations (star scale and bounce)
 * - Error animations (gentle shake)
 * - Stroke complete transitions (green color transition)
 *
 * Uses CSS-in-JS approach for React integration with full TypeScript support.
 */
/**
 * Animation keyframes for success feedback
 * Combines scaling and bouncing for celebratory effect
 */
export const successAnimation = {
    keyframes: `
    @keyframes successBounce {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      70% {
        transform: scale(0.9);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,
    className: 'animate-success',
    duration: '600ms',
    timing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};
/**
 * Animation keyframes for error feedback
 * Gentle horizontal shake to indicate incorrect stroke
 */
export const errorAnimation = {
    keyframes: `
    @keyframes errorShake {
      0%, 100% {
        transform: translateX(0);
      }
      10%, 30%, 50%, 70%, 90% {
        transform: translateX(-8px);
      }
      20%, 40%, 60%, 80% {
        transform: translateX(8px);
      }
    }
  `,
    className: 'animate-error',
    duration: '500ms',
    timing: 'ease-in-out',
};
/**
 * Animation keyframes for stroke completion
 * Smooth color transition to green when stroke is validated
 */
export const strokeCompleteAnimation = {
    keyframes: `
    @keyframes strokeComplete {
      0% {
        stroke: #2196F3;
      }
      100% {
        stroke: #4CAF50;
      }
    }
  `,
    className: 'animate-stroke-complete',
    duration: '200ms',
    timing: 'ease-in-out',
};
/**
 * Animation keyframes for pulse effect
 * Subtle pulsing for attention-grabbing elements
 */
export const pulseAnimation = {
    keyframes: `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.05);
      }
    }
  `,
    className: 'animate-pulse',
    duration: '2s',
    timing: 'ease-in-out',
    iterationCount: 'infinite',
};
/**
 * Animation keyframes for bounce effect
 * Upward bouncing motion for interactive elements
 */
export const bounceAnimation = {
    keyframes: `
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
  `,
    className: 'animate-bounce',
    duration: '1s',
    timing: 'ease-in-out',
    iterationCount: 'infinite',
};
/**
 * Generate CSS animation style string
 *
 * @param animation - Animation keyframe name
 * @param options - Animation options (duration, timing, etc.)
 * @returns CSS animation style string
 *
 * @example
 * ```tsx
 * const style = getAnimationStyle('successBounce', {
 *   duration: '600ms',
 *   timing: 'ease-out'
 * });
 * // Returns: "successBounce 600ms ease-out"
 * ```
 */
export function getAnimationStyle(animation, options = {}) {
    const { duration = '300ms', delay = '0ms', timing = 'ease-in-out', iterationCount = '1', direction = 'normal', fillMode = 'both', } = options;
    return `${animation} ${duration} ${timing} ${delay} ${iterationCount} ${direction} ${fillMode}`;
}
/**
 * Generate complete style object for React inline styles
 *
 * @param animation - Animation keyframe name
 * @param options - Animation options
 * @returns React CSSProperties object
 *
 * @example
 * ```tsx
 * const style = getAnimationObject('errorShake', {
 *   duration: '500ms'
 * });
 * // Apply to element: <div style={style}>...</div>
 * ```
 */
export function getAnimationObject(animation, options = {}) {
    return {
        animation: getAnimationStyle(animation, options),
    };
}
/**
 * Pre-configured animation styles for common use cases
 */
export const animationStyles = {
    success: getAnimationObject('successBounce', {
        duration: successAnimation.duration,
        timing: successAnimation.timing,
    }),
    error: getAnimationObject('errorShake', {
        duration: errorAnimation.duration,
        timing: errorAnimation.timing,
    }),
    strokeComplete: getAnimationObject('strokeComplete', {
        duration: strokeCompleteAnimation.duration,
        timing: strokeCompleteAnimation.timing,
    }),
    pulse: getAnimationObject('pulse', {
        duration: pulseAnimation.duration,
        timing: pulseAnimation.timing,
        iterationCount: pulseAnimation.iterationCount,
    }),
    bounce: getAnimationObject('bounce', {
        duration: bounceAnimation.duration,
        timing: bounceAnimation.timing,
        iterationCount: bounceAnimation.iterationCount,
    }),
};
/**
 * Inject animation keyframes into the document
 * Call this once during app initialization to make keyframes available
 *
 * @example
 * ```tsx
 * // In App.tsx or main entry point
 * useEffect(() => {
 *   injectKeyframes();
 * }, []);
 * ```
 */
export function injectKeyframes() {
    if (typeof document === 'undefined')
        return;
    const styleId = 'handwriting-animations';
    const existingStyle = document.getElementById(styleId);
    if (existingStyle)
        return;
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
    ${successAnimation.keyframes}
    ${errorAnimation.keyframes}
    ${strokeCompleteAnimation.keyframes}
    ${pulseAnimation.keyframes}
    ${bounceAnimation.keyframes}
  `;
    document.head.appendChild(style);
}
/**
 * CSS class names for applying animations via className prop
 * Requires keyframes to be injected first via injectKeyframes()
 */
export const animationClasses = {
    success: successAnimation.className,
    error: errorAnimation.className,
    strokeComplete: strokeCompleteAnimation.className,
    pulse: pulseAnimation.className,
    bounce: bounceAnimation.className,
};
/**
 * Apply animation to an element programmatically
 *
 * @param element - DOM element to animate
 * @param animationName - Name of the animation to apply
 * @param options - Animation options
 * @returns Function to remove the animation
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 *
 * const triggerError = () => {
 *   if (ref.current) {
 *     const cleanup = applyAnimation(ref.current, 'errorShake', {
 *       duration: '500ms'
 *     });
 *     // Animation will be cleaned up after completion
 *   }
 * };
 * ```
 */
export function applyAnimation(element, animationName, options = {}) {
    const animation = getAnimationStyle(animationName, options);
    element.style.animation = animation;
    const cleanup = () => {
        element.style.animation = '';
    };
    // Auto-cleanup after animation completes
    const duration = parseInt(options.duration || '300', 10);
    setTimeout(cleanup, duration + 50);
    return cleanup;
}
