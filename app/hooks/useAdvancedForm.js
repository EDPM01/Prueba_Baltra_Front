'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useNotifications } from './useNotifications';

export const useAdvancedForm = (config) => {
  const {
    initialValues = {},
    validationSchema = null,
    onSubmit = null,
    autosave = false,
    autosaveDelay = 2000,
    resetOnSubmit = true,
    showSuccessNotification = true
  } = config;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isValid, setIsValid] = useState(true);
  
  const notifications = useNotifications();
  const autosaveTimeoutRef = useRef(null);
  const initialValuesRef = useRef(initialValues);

  // Validar un campo específico
  const validateField = useCallback((fieldName, value) => {
    if (!validationSchema) return null;

    try {
      validationSchema.shape[fieldName]?.parse(value);
      return null;
    } catch (error) {
      return error.errors?.[0]?.message || 'Error de validación';
    }
  }, [validationSchema]);

  // Validar todo el formulario
  const validateForm = useCallback(() => {
    if (!validationSchema) return {};

    try {
      validationSchema.parse(values);
      return {};
    } catch (error) {
      const fieldErrors = {};
      error.errors?.forEach(err => {
        if (err.path?.length > 0) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      return fieldErrors;
    }
  }, [values, validationSchema]);

  // Actualizar valor de campo
  const setValue = useCallback((fieldName, value) => {
    setValues(prev => {
      const newValues = { ...prev, [fieldName]: value };
      
      // Marcar como dirty si el valor cambió
      if (JSON.stringify(newValues) !== JSON.stringify(initialValuesRef.current)) {
        setIsDirty(true);
      }

      return newValues;
    });

    // Validar campo inmediatamente si ya fue tocado
    if (touched[fieldName]) {
      const fieldError = validateField(fieldName, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldError
      }));
    }

    // Configurar autosave
    if (autosave) {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
      
      autosaveTimeoutRef.current = setTimeout(() => {
        handleAutosave({ ...values, [fieldName]: value });
      }, autosaveDelay);
    }
  }, [touched, validateField, autosave, autosaveDelay, values]);

  // Marcar campo como tocado
  const setFieldTouched = useCallback((fieldName, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: isTouched
    }));

    // Validar cuando se marca como tocado
    if (isTouched) {
      const fieldError = validateField(fieldName, values[fieldName]);
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldError
      }));
    }
  }, [validateField, values]);

  // Manejar blur de campo
  const handleBlur = useCallback((fieldName) => {
    setFieldTouched(fieldName, true);
  }, [setFieldTouched]);

  // Manejar autosave
  const handleAutosave = useCallback(async (formValues) => {
    try {
      // Simular guardado automático
      await new Promise(resolve => setTimeout(resolve, 500));
      
      notifications.showInfo('Borrador guardado automáticamente', {
        duration: 2000
      });
    } catch (error) {
      console.error('Error en autosave:', error);
    }
  }, [notifications]);

  // Enviar formulario
  const handleSubmit = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
    }

    // Marcar todos los campos como tocados
    const allFields = Object.keys(values);
    const touchedState = {};
    allFields.forEach(field => {
      touchedState[field] = true;
    });
    setTouched(touchedState);

    // Validar formulario completo
    const formErrors = validateForm();
    setErrors(formErrors);

    const hasErrors = Object.keys(formErrors).some(key => formErrors[key]);
    setIsValid(!hasErrors);

    if (hasErrors) {
      notifications.showError('Por favor corrige los errores en el formulario');
      return false;
    }

    if (!onSubmit) {
      notifications.showWarning('No hay función de envío configurada');
      return false;
    }

    setIsSubmitting(true);

    try {
      const result = await onSubmit(values);
      
      if (showSuccessNotification) {
        notifications.showSuccess('Formulario enviado exitosamente');
      }

      if (resetOnSubmit) {
        resetForm();
      }

      return result;
    } catch (error) {
      notifications.showError(`Error al enviar formulario: ${error.message}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit, showSuccessNotification, resetOnSubmit, notifications]);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsDirty(false);
    setIsValid(true);
    initialValuesRef.current = initialValues;
    
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }
  }, [initialValues]);

  // Establecer valores múltiples
  const setMultipleValues = useCallback((newValues) => {
    setValues(newValues);
    setIsDirty(JSON.stringify(newValues) !== JSON.stringify(initialValuesRef.current));
  }, []);

  // Verificar si un campo tiene error
  const getFieldError = useCallback((fieldName) => {
    return touched[fieldName] ? errors[fieldName] : null;
  }, [touched, errors]);

  // Verificar si el formulario se puede enviar
  const canSubmit = !isSubmitting && Object.keys(errors).every(key => !errors[key]);

  // Helper para generar props de campo
  const getFieldProps = useCallback((fieldName) => ({
    value: values[fieldName] || '',
    onChange: (e) => {
      const value = e.target ? e.target.value : e;
      setValue(fieldName, value);
    },
    onBlur: () => handleBlur(fieldName),
    error: getFieldError(fieldName)
  }), [values, setValue, handleBlur, getFieldError]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, []);

  return {
    // Estado
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isValid,
    canSubmit,

    // Acciones
    setValue,
    setMultipleValues,
    setFieldTouched,
    handleSubmit,
    resetForm,
    handleBlur,

    // Helpers
    getFieldError,
    getFieldProps,
    validateField,
    validateForm
  };
};
