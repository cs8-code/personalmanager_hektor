/**
 * Custom hook for toast notifications
 * Wraps react-hot-toast with German messages and custom styling
 */

import toast from 'react-hot-toast';

export const useToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#10b981',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981',
      },
    });
  };

  const showError = (message: string) => {
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#ef4444',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#ef4444',
      },
    });
  };

  const showWarning = (message: string) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  };

  const showInfo = (message: string) => {
    toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  };

  const showLoading = (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#6b7280',
        color: '#fff',
        padding: '16px',
        borderRadius: '8px',
      },
    });
  };

  const dismissToast = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  const promise = <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        position: 'top-right',
        style: {
          padding: '16px',
          borderRadius: '8px',
        },
      }
    );
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismissToast,
    promise,
  };
};

// Common German messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    SAVED: 'Erfolgreich gespeichert',
    CREATED: 'Erfolgreich erstellt',
    UPDATED: 'Erfolgreich aktualisiert',
    DELETED: 'Erfolgreich gelöscht',
    SENT: 'Erfolgreich gesendet',
    UPLOADED: 'Erfolgreich hochgeladen',
    LOGIN: 'Erfolgreich angemeldet',
    LOGOUT: 'Erfolgreich abgemeldet',
    REGISTERED: 'Erfolgreich registriert',
  },
  ERROR: {
    GENERIC: 'Ein Fehler ist aufgetreten',
    NETWORK: 'Netzwerkfehler. Bitte versuchen Sie es erneut',
    UNAUTHORIZED: 'Sie sind nicht berechtigt, diese Aktion durchzuführen',
    NOT_FOUND: 'Ressource nicht gefunden',
    VALIDATION: 'Bitte überprüfen Sie Ihre Eingaben',
    UPLOAD: 'Fehler beim Hochladen der Datei',
    SAVE: 'Fehler beim Speichern',
    DELETE: 'Fehler beim Löschen',
    LOGIN: 'Anmeldung fehlgeschlagen',
    REGISTRATION: 'Registrierung fehlgeschlagen',
  },
  WARNING: {
    UNSAVED_CHANGES: 'Sie haben ungespeicherte Änderungen',
    CONFIRMATION_REQUIRED: 'Bitte bestätigen Sie diese Aktion',
  },
  INFO: {
    LOADING: 'Wird geladen...',
    PROCESSING: 'Wird verarbeitet...',
    SAVING: 'Wird gespeichert...',
  },
};
