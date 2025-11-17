/**
 * Custom hook for form management
 * Provides form state, validation, and submission handling
 */

import { useState, useCallback, ChangeEvent } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean;
  message: string;
}

type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule[];
};

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema?: ValidationSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

interface FormErrors {
  [key: string]: string;
}

export const useForm = <T extends Record<string, unknown>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (name: keyof T, value: unknown): string | null => {
      if (!validationSchema || !validationSchema[name]) return null;

      const rules = validationSchema[name];
      if (!rules) return null;

      for (const rule of rules) {
        // Required validation
        if (rule.required && !value) {
          return rule.message;
        }

        // Min length validation
        if (rule.minLength && value && value.length < rule.minLength) {
          return rule.message;
        }

        // Max length validation
        if (rule.maxLength && value && value.length > rule.maxLength) {
          return rule.message;
        }

        // Pattern validation
        if (rule.pattern && value && !rule.pattern.test(value)) {
          return rule.message;
        }

        // Custom validation
        if (rule.custom && value && !rule.custom(value)) {
          return rule.message;
        }
      }

      return null;
    },
    [validationSchema]
  );

  /**
   * Validate all fields
   */
  const validateForm = useCallback((): boolean => {
    if (!validationSchema) return true;

    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach((key) => {
      const error = validateField(key as keyof T, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationSchema, validateField]);

  /**
   * Handle input change
   */
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = event.target;

      // Handle checkbox
      const inputValue = type === 'checkbox'
        ? (event.target as HTMLInputElement).checked
        : value;

      setValues((prev) => ({
        ...prev,
        [name]: inputValue,
      }));

      // Clear error for this field
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  /**
   * Set a specific field value
   */
  const setValue = useCallback((name: keyof T, value: unknown) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as string];
        return newErrors;
      });
    }
  }, [errors]);

  /**
   * Set multiple values at once
   */
  const setMultipleValues = useCallback((newValues: Partial<T>) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  /**
   * Handle field blur
   */
  const handleBlur = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = event.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // Validate on blur
      const error = validateField(name as keyof T, values[name as keyof T]);
      if (error) {
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [values, validateField]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (event?: React.FormEvent) => {
      if (event) {
        event.preventDefault();
      }

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

      // Validate form
      const isValid = validateForm();
      if (!isValid) return;

      // Submit form
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateForm, onSubmit]
  );

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Set form errors manually
   */
  const setFormErrors = useCallback((newErrors: FormErrors) => {
    setErrors(newErrors);
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    setMultipleValues,
    validateField,
    validateForm,
    resetForm,
    setErrors: setFormErrors,
  };
};
