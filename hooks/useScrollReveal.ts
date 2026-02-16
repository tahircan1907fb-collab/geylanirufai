import { useEffect, useRef } from 'react';

/**
 * Custom hook that reveals elements when they enter the viewport.
 * Uses IntersectionObserver for performant scroll-based animations.
 */
export function useScrollReveal<T extends HTMLElement>(
     threshold = 0.15
) {
     const ref = useRef<T>(null);

     useEffect(() => {
          const element = ref.current;
          if (!element) return;

          const observer = new IntersectionObserver(
               ([entry]) => {
                    if (entry.isIntersecting) {
                         element.classList.add('revealed');
                         observer.unobserve(element);
                    }
               },
               { threshold }
          );

          observer.observe(element);
          return () => observer.disconnect();
     }, [threshold]);

     return ref;
}
