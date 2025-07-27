'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useNotifications } from './useNotifications';

export const useLocalStorage = (key, initialValue = null, options = {}) => {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    syncAcrossTabs = true,
    expiry = null // tiempo en millisegundos
  } = options;

  const notifications = useNotifications();
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') return initialValue;
      
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsedItem = deserialize(item);
      
      // Verificar expiración
      if (expiry && parsedItem.timestamp) {
        const now = Date.now();
        if (now - parsedItem.timestamp > expiry) {
          window.localStorage.removeItem(key);
          return initialValue;
        }
        return parsedItem.value;
      }
      
      return parsedItem;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Actualizar valor
  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      
      if (typeof window !== 'undefined') {
        const valueToStore = expiry 
          ? { value, timestamp: Date.now() }
          : value;
          
        window.localStorage.setItem(key, serialize(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      notifications.showError('Error al guardar datos localmente');
    }
  }, [key, serialize, expiry, notifications]);

  // Remover valor
  const removeValue = useCallback(() => {
    try {
      setStoredValue(null);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  // Sincronizar entre tabs
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') return;

    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = deserialize(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.error('Error syncing localStorage across tabs:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, deserialize, syncAcrossTabs]);

  return [storedValue, setValue, removeValue];
};

export const useCache = (defaultExpiry = 5 * 60 * 1000) => { // 5 minutos por defecto
  const [cache, setCache] = useState(new Map());
  const timeoutsRef = useRef(new Map());

  // Obtener valor del caché
  const get = useCallback((key) => {
    const item = cache.get(key);
    if (!item) return null;

    // Verificar si expiró
    if (Date.now() > item.expiry) {
      cache.delete(key);
      setCache(new Map(cache));
      return null;
    }

    return item.value;
  }, [cache]);

  // Establecer valor en caché
  const set = useCallback((key, value, customExpiry = defaultExpiry) => {
    const expiry = Date.now() + customExpiry;
    
    // Limpiar timeout anterior si existe
    if (timeoutsRef.current.has(key)) {
      clearTimeout(timeoutsRef.current.get(key));
    }

    // Establecer nuevo timeout para limpieza automática
    const timeoutId = setTimeout(() => {
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(key);
        return newCache;
      });
      timeoutsRef.current.delete(key);
    }, customExpiry);

    timeoutsRef.current.set(key, timeoutId);

    // Actualizar caché
    setCache(prev => {
      const newCache = new Map(prev);
      newCache.set(key, { value, expiry });
      return newCache;
    });
  }, [defaultExpiry]);

  // Remover del caché
  const remove = useCallback((key) => {
    if (timeoutsRef.current.has(key)) {
      clearTimeout(timeoutsRef.current.get(key));
      timeoutsRef.current.delete(key);
    }

    setCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(key);
      return newCache;
    });
  }, []);

  // Limpiar todo el caché
  const clear = useCallback(() => {
    // Limpiar todos los timeouts
    timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutsRef.current.clear();
    
    setCache(new Map());
  }, []);

  // Verificar si existe una clave
  const has = useCallback((key) => {
    const item = cache.get(key);
    if (!item) return false;
    
    // Verificar si no expiró
    return Date.now() <= item.expiry;
  }, [cache]);

  // Obtener todas las claves válidas
  const keys = useCallback(() => {
    const now = Date.now();
    return Array.from(cache.keys()).filter(key => {
      const item = cache.get(key);
      return item && now <= item.expiry;
    });
  }, [cache]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    };
  }, []);

  return {
    get,
    set,
    remove,
    clear,
    has,
    keys,
    size: cache.size
  };
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useThrottle = (value, limit) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};
