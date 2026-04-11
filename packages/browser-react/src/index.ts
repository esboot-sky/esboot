// Performance Monitoring
export { monitorPerformance } from './aop/performance';

// React Error Boundary
export * from './error-boundary/default-fallback-render';
export * from './error-boundary/error-boundary';
export * from './mount';

export { type FallbackProps, useErrorBoundary, withErrorBoundary } from 'react-error-boundary';
