import { CheckCircle2, Clock } from 'lucide-react';

/**
 * Get Tailwind CSS classes for availability status badge styling
 * @param status - The availability status string
 * @returns CSS class string for badge styling
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Sofort verfügbar':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'Demnächst verfügbar':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Nicht verfügbar':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'Zurzeit beschäftigt':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

/**
 * Get icon component for availability status
 * @param status - The availability status string
 * @param size - Icon size in Tailwind (e.g., 'w-4 h-4' or 'w-5 h-5'), defaults to 'w-5 h-5'
 * @returns React component for the status icon
 */
export const getStatusIcon = (status: string, size: string = 'w-5 h-5') => {
  if (status === 'Sofort verfügbar') {
    return <CheckCircle2 className={size} />;
  }
  return <Clock className={size} />;
};
