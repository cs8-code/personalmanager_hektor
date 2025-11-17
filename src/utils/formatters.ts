/**
 * Formatting utilities
 * Common formatting functions for display
 */

/**
 * Format date to German locale
 */
export const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Format date and time to German locale
 */
export const formatDateTime = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleString('de-DE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format relative time (e.g., "vor 2 Stunden")
 */
export const formatRelativeTime = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return 'gerade eben';
  } else if (diffMins < 60) {
    return `vor ${diffMins} ${diffMins === 1 ? 'Minute' : 'Minuten'}`;
  } else if (diffHours < 24) {
    return `vor ${diffHours} ${diffHours === 1 ? 'Stunde' : 'Stunden'}`;
  } else if (diffDays < 30) {
    return `vor ${diffDays} ${diffDays === 1 ? 'Tag' : 'Tagen'}`;
  } else {
    return formatDate(date);
  }
};

/**
 * Format phone number
 */
export const formatPhone = (phone: string): string => {
  // Remove all non-digit characters except '+'
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Format German phone numbers
  if (cleaned.startsWith('+49')) {
    // +49 xxx xxxxxxx
    return cleaned.replace(/(\+\d{2})(\d{3})(\d+)/, '$1 $2 $3');
  }

  return cleaned;
};

/**
 * Format currency (Euro)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

/**
 * Format number with thousands separator
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('de-DE').format(num);
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Format array to comma-separated string
 */
export const formatList = (items: string[], maxItems?: number): string => {
  if (maxItems && items.length > maxItems) {
    const visible = items.slice(0, maxItems);
    const remaining = items.length - maxItems;
    return `${visible.join(', ')} +${remaining} weitere`;
  }
  return items.join(', ');
};

/**
 * Format full name from first and last name
 */
export const formatFullName = (firstName?: string, lastName?: string, name?: string): string => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (name) {
    return name;
  }
  if (firstName) {
    return firstName;
  }
  if (lastName) {
    return lastName;
  }
  return 'Unbekannt';
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
