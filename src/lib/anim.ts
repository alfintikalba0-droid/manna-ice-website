import type React from 'react';

// Brand palette (mirrors tailwind.config.js)
export const TEXT_COLOR = '#0B1B45'; // navy
export const BG_ICE = '#D6ECFB'; // pale ice blue
export const BG_ROYAL = '#1F3FB0'; // royal blue from the logo
export const ACCENT = '#3FD0F2'; // bright cyan for buttons
export const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function anim(visible: boolean, delay: number, opts: { y?: number; x?: number; duration?: number } = {}) {
  const { y = 20, x = 0, duration = 1600 } = opts;
  const translateFrom = y !== 0 ? `translateY(${y}px)` : x !== 0 ? `translateX(${x}px)` : 'none';
  return {
    style: {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translate(0,0)' : translateFrom,
      transition: `opacity ${duration}ms ${EASE} ${delay}ms, transform ${duration}ms ${EASE} ${delay}ms`,
    } as React.CSSProperties,
  };
}
