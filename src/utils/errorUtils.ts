/**
 * Error handling utilities
 * Common error handling functions
 */

import { PostgrestError, AuthError } from '@supabase/supabase-js';

/**
 * Get user-friendly error message from Supabase error
 */
export const getSupabaseErrorMessage = (error: PostgrestError | AuthError | Error): string => {
  // Check for specific error codes
  if ('code' in error) {
    switch (error.code) {
      case '23505':
        return 'Dieser Eintrag existiert bereits';
      case '23503':
        return 'Dieser Eintrag kann nicht gelöscht werden, da er noch verwendet wird';
      case '23502':
        return 'Erforderliche Felder fehlen';
      case 'PGRST116':
        return 'Eintrag nicht gefunden';
      case '42501':
        return 'Sie haben keine Berechtigung für diese Aktion';
      default:
        break;
    }
  }

  // Check for authentication errors
  if ('status' in error) {
    switch (error.status) {
      case 400:
        return 'Ungültige Anfrage. Bitte überprüfen Sie Ihre Eingaben';
      case 401:
        return 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Zugangsdaten';
      case 403:
        return 'Sie haben keine Berechtigung für diese Aktion';
      case 404:
        return 'Ressource nicht gefunden';
      case 422:
        return 'Die Daten konnten nicht verarbeitet werden';
      case 500:
        return 'Serverfehler. Bitte versuchen Sie es später erneut';
      default:
        break;
    }
  }

  // Return the error message if available
  if (error.message) {
    // Convert common English messages to German
    const germanMessages: Record<string, string> = {
      'Invalid login credentials': 'Ungültige Anmeldedaten',
      'Email not confirmed': 'E-Mail-Adresse wurde noch nicht bestätigt',
      'User already registered': 'Benutzer ist bereits registriert',
      'Password is too short': 'Passwort ist zu kurz',
      'Network request failed': 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung',
    };

    const germanMessage = germanMessages[error.message];
    if (germanMessage) {
      return germanMessage;
    }

    return error.message;
  }

  return 'Ein unerwarteter Fehler ist aufgetreten';
};

/**
 * Log error to console (could be extended to log to external service)
 */
export const logError = (error: Error, context?: string) => {
  console.error(
    `Error${context ? ` in ${context}` : ''}:`,
    error
  );

  // TODO: Add integration with error tracking service (e.g., Sentry)
  // Example: Sentry.captureException(error, { tags: { context } });
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: Error): boolean => {
  return (
    error.message.includes('Network') ||
    error.message.includes('fetch') ||
    error.message.includes('Failed to fetch')
  );
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null) return false;
  const err = error as { status?: number; message?: string };
  return (
    err.status === 401 ||
    err.message?.includes('auth') ||
    err.message?.includes('login') ||
    err.message?.includes('credentials') ||
    false
  );
};

/**
 * Check if error is a permission error
 */
export const isPermissionError = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null) return false;
  const err = error as { status?: number; code?: string };
  return err.status === 403 || err.code === '42501';
};

/**
 * Handle error and return user-friendly message
 */
export const handleError = (
  error: unknown,
  context?: string
): string => {
  logError(error as Error, context);

  if (error instanceof Error) {
    return getSupabaseErrorMessage(error);
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Ein unerwarteter Fehler ist aufgetreten';
};
