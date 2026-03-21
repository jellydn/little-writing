/**
 * SuccessAnimation Component
 *
 * Celebratory star animation displayed when all strokes are completed correctly.
 * Plays a success sound and provides visual feedback with scaling and bouncing.
 *
 * Task: T032
 */

import React, { useEffect, useState } from 'react';
import { playSuccessSound } from '../../lib/feedback/soundPlayer';
import { COLORS } from '../../styles/theme';

interface SuccessAnimationProps {
  /** Whether the animation should be visible */
  isVisible: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
}

/**
 * Star SVG path data
 */
const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

interface ConfettiParticle {
  id: number;
  color: string;
  x: number;
  y: number;
  rotation: number;
  delay: number;
}

/**
 * Creates confetti particle elements
 */
function createConfetti(count: number): ConfettiParticle[] {
  const colors = [COLORS.correct, COLORS.highlight, COLORS.primary, '#FFD700'];

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    x: Math.random() * 100,
    y: -20 - Math.random() * 40,
    rotation: Math.random() * 360,
    delay: i * 30,
  }));
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  isVisible,
  onComplete,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);

  // Start animation when isVisible becomes true
  useEffect(() => {
    if (isVisible && !isAnimating) {
      setIsAnimating(true);
      setConfetti(createConfetti(12));

      // Play success sound
      playSuccessSound();

      // Call onComplete after animation
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setConfetti([]);
        onComplete?.();
      }, 1500);

      return () => clearTimeout(timer);
    }

    if (!isVisible) {
      setIsAnimating(false);
      setConfetti([]);
    }
  }, [isVisible, isAnimating, onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="success-animation"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      {/* Star icon */}
      <div
        style={{
          animation: 'successBounce 0.8s ease-out forwards',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill={COLORS.correct}
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
          }}
        >
          <path d={STAR_PATH} />
        </svg>
      </div>

      {/* Confetti particles */}
      {confetti.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            backgroundColor: particle.color,
            borderRadius: '2px',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `rotate(${particle.rotation}deg)`,
            animation: 'confettiFall 1.5s ease-in forwards',
            animationDelay: `${particle.delay}ms`,
          }}
        />
      ))}

      {/* Success text */}
      <div
        style={{
          position: 'absolute',
          top: '65%',
          fontSize: '28px',
          fontWeight: 'bold',
          color: COLORS.correct,
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          animation: 'fadeInUp 0.6s ease-out 0.2s forwards',
          opacity: 0,
        }}
      >
        Great job!
      </div>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes confettiFall {
          0% {
            top: -20px;
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            top: 120%;
            opacity: 0;
          }
        }

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

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
