'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/app/hooks/useResponsive';

export const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 300,
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { prefersReducedMotion } = useAccessibility();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (prefersReducedMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <div
      className={cn(
        'transition-all ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className
      )}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const SlideIn = ({ 
  children, 
  direction = 'left',
  delay = 0,
  duration = 300,
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { prefersReducedMotion } = useAccessibility();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getTransform = () => {
    if (prefersReducedMotion) return '';
    
    const transforms = {
      left: isVisible ? 'translateX(0)' : 'translateX(-100%)',
      right: isVisible ? 'translateX(0)' : 'translateX(100%)',
      up: isVisible ? 'translateY(0)' : 'translateY(-100%)',
      down: isVisible ? 'translateY(0)' : 'translateY(100%)'
    };
    
    return transforms[direction] || transforms.left;
  };

  return (
    <div
      className={cn(
        'transition-all ease-out',
        className
      )}
      style={{ 
        transform: getTransform(),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const ScaleIn = ({ 
  children, 
  delay = 0,
  duration = 300,
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { prefersReducedMotion } = useAccessibility();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (prefersReducedMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <div
      className={cn(
        'transition-all ease-out',
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
        className
      )}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const Bounce = ({ 
  children,
  trigger = false,
  className = '',
  ...props 
}) => {
  const { prefersReducedMotion } = useAccessibility();

  if (prefersReducedMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <div
      className={cn(
        'transition-transform duration-300',
        trigger && 'animate-bounce',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const Pulse = ({ 
  children,
  active = false,
  className = '',
  ...props 
}) => {
  const { prefersReducedMotion } = useAccessibility();

  if (prefersReducedMotion) {
    return <div className={className} {...props}>{children}</div>;
  }

  return (
    <div
      className={cn(
        'transition-all duration-1000',
        active && 'animate-pulse',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const Stagger = ({ 
  children, 
  staggerDelay = 100,
  className = ''
}) => {
  const { prefersReducedMotion } = useAccessibility();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <FadeIn key={index} delay={index * staggerDelay}>
              {child}
            </FadeIn>
          ))
        : children
      }
    </div>
  );
};

export const FloatingActionButton = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'default',
  ...props
}) => {
  const { prefersReducedMotion } = useAccessibility();

  const variants = {
    primary: 'bg-green-600 hover:bg-green-700 text-white shadow-green-200',
    secondary: 'bg-white hover:bg-gray-50 text-gray-900 shadow-gray-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'
  };

  const sizes = {
    sm: 'h-12 w-12',
    default: 'h-14 w-14',
    lg: 'h-16 w-16'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-50 rounded-full shadow-lg',
        'flex items-center justify-center',
        'transition-all duration-200 ease-out',
        'transform hover:scale-105 active:scale-95',
        'focus:outline-none focus:ring-4 focus:ring-opacity-50',
        !prefersReducedMotion && 'hover:shadow-xl',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const ProgressiveBlur = ({ 
  children, 
  isBlurred = false,
  className = ''
}) => {
  return (
    <div
      className={cn(
        'transition-all duration-300',
        isBlurred && 'blur-sm opacity-60 pointer-events-none',
        className
      )}
    >
      {children}
    </div>
  );
};
