import { useEffect } from 'react';

interface PerformanceMonitorProps {
  routeName: string;
}

/**
 * Development-only performance monitoring component
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ routeName }) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const startTime = performance.now();
    
    // Measure route load time
    const measureRouteLoad = () => {
      const loadTime = performance.now() - startTime;
      console.log(`🚀 Route "${routeName}" loaded in ${loadTime.toFixed(2)}ms`);
      
      // Log performance metrics
      if (performance.getEntriesByType) {
        const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navEntries.length > 0) {
          const nav = navEntries[0];
          console.log(`📊 Navigation timing for "${routeName}":`, {
            domContentLoaded: (nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart).toFixed(2) + 'ms',
            loadComplete: (nav.loadEventEnd - nav.loadEventStart).toFixed(2) + 'ms',
            totalLoadTime: (nav.loadEventEnd - nav.fetchStart).toFixed(2) + 'ms'
          });
        }
      }
    };

    // Use requestIdleCallback for non-blocking measurement
    if (window.requestIdleCallback) {
      window.requestIdleCallback(measureRouteLoad);
    } else {
      setTimeout(measureRouteLoad, 0);
    }
  }, [routeName]);

  return null;
};
