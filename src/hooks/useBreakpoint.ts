import { useState, useEffect } from 'react';

// Tailwind의 theme.screens 값과 동일하게 유지
const screens = {
  'sm': "360px",
  'md': "768px",
  'lg': "1280px",
  'xl': "1600px",
  '2xl': "1920px",
} as const;

type Breakpoint = keyof typeof screens;

export const useBreakpoint = (breakpoint: Breakpoint): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const breakpointValue = screens[breakpoint];
    const query = window.matchMedia(`(min-width: ${breakpointValue})`);
    setMatches(query.matches);

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, [breakpoint]);

  return matches;
};

export default useBreakpoint; 