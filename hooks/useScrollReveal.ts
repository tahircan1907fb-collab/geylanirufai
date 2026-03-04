import { useEffect, useRef } from 'react';

const OBSERVER_OPTIONS: IntersectionObserverInit = {
     threshold: 0.15,
     rootMargin: '0px 0px -40px 0px',
};

/**
 * Activates scroll-reveal animations on elements within the ref container.
 * Elements with `.scroll-reveal`, `.scroll-reveal-left`, or `.scroll-reveal-right`
 * classes will be observed and get `.visible` added when they enter the viewport.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>() {
     const ref = useRef<T>(null);

     useEffect(() => {
          const container = ref.current;
          if (!container) return;

          const observer = new IntersectionObserver((entries) => {
               entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                         entry.target.classList.add('visible');
                         observer.unobserve(entry.target);
                    }
               });
          }, OBSERVER_OPTIONS);

          const targets = container.querySelectorAll(
               '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right'
          );
          targets.forEach((el) => observer.observe(el));

          return () => observer.disconnect();
     }, []);

     return ref;
}

export default useScrollReveal;
