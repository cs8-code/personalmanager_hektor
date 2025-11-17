/**
 * PageHeader Component
 * Standardized page header with title, description, and actions
 */

import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  action,
  className = '',
}: PageHeaderProps) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-gray-600 max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};
