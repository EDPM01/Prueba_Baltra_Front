import { format, formatDistance, isAfter, isBefore, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

// Formatear fecha para mostrar
export const formatDate = (date) => {
  return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
};

// Formatear fecha relativa
export const formatRelativeDate = (date) => {
  return formatDistance(date, new Date(), { 
    addSuffix: true, 
    locale: es 
  });
};

// Validar si una fecha es futura
export const isFutureDate = (date) => {
  return isAfter(date, new Date());
};

// Validar si una fecha está en el pasado
export const isPastDate = (date) => {
  return isBefore(date, new Date());
};

// Obtener fecha mínima para el selector (ahora + 5 minutos)
export const getMinSelectableDate = () => {
  return addMinutes(new Date(), 5);
};

// Convertir string a Date
export const parseDate = (dateString) => {
  return new Date(dateString);
};

// Formatear fecha para API
export const formatForAPI = (date) => {
  return date.toISOString();
};

export default {
  formatDate,
  formatRelativeDate,
  isFutureDate,
  isPastDate,
  getMinSelectableDate,
  parseDate,
  formatForAPI
};
