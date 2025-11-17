/**
 * Card Component
 * Reusable card container with consistent styling
 */

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
}: CardProps) => {
  const hoverClasses = hover
    ? 'hover:shadow-lg transition-shadow duration-200'
    : '';

  return (
    <div
      className={`bg-white rounded-lg shadow-md ${paddingClasses[padding]} ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
};
