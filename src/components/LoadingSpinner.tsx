/**
 * LoadingSpinner Component
 * Reusable loading spinner with customizable size and message
 */

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

export const LoadingSpinner = ({
  message = 'Laden...',
  size = 'md',
  centered = true,
}: LoadingSpinnerProps) => {
  const containerClasses = centered
    ? 'flex flex-col items-center justify-center py-12'
    : 'flex flex-col items-center';

  return (
    <div className={containerClasses}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-b-2 border-blue-600`}
      />
      {message && (
        <p className="mt-4 text-gray-600 text-center">{message}</p>
      )}
    </div>
  );
};
