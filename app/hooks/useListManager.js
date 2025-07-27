'use client';

import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from './useStorage';

export const useListManager = (initialData = [], config = {}) => {
  const {
    searchFields = ['name', 'content'],
    defaultSort = { field: 'createdAt', direction: 'desc' },
    defaultFilters = {},
    pageSize = 10,
    debounceDelay = 300
  } = config;

  const [data, setData] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [sortConfig, setSortConfig] = useState(defaultSort);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchQuery = useDebounce(searchQuery, debounceDelay);

  // Filtrar datos
  const filteredData = useMemo(() => {
    let result = [...data];

    // Aplicar búsqueda
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter(item => 
        searchFields.some(field => {
          const value = getNestedValue(item, field);
          return value && value.toString().toLowerCase().includes(query);
        })
      );
    }

    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          // Filtro de array (ej: múltiples estados)
          if (value.length > 0) {
            result = result.filter(item => value.includes(getNestedValue(item, key)));
          }
        } else if (typeof value === 'object' && value.from && value.to) {
          // Filtro de rango (ej: fechas)
          result = result.filter(item => {
            const itemValue = new Date(getNestedValue(item, key));
            return itemValue >= new Date(value.from) && itemValue <= new Date(value.to);
          });
        } else {
          // Filtro simple
          result = result.filter(item => getNestedValue(item, key) === value);
        }
      }
    });

    return result;
  }, [data, debouncedSearchQuery, filters, searchFields]);

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortConfig.field) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.field);
      const bValue = getNestedValue(b, sortConfig.field);

      let comparison = 0;
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }

      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });
  }, [filteredData, sortConfig]);

  // Paginación
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = data.length;
    const filtered = filteredData.length;
    const totalPages = Math.ceil(filtered / pageSize);

    return {
      total,
      filtered,
      showing: paginatedData.length,
      totalPages,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    };
  }, [data.length, filteredData.length, paginatedData.length, currentPage, pageSize]);

  // Función auxiliar para obtener valores anidados
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Acciones para actualizar datos
  const addItem = useCallback((item) => {
    setData(prev => [...prev, { ...item, id: item.id || Date.now() }]);
  }, []);

  const updateItem = useCallback((id, updates) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const removeItem = useCallback((id) => {
    setData(prev => prev.filter(item => item.id !== id));
  }, []);

  const removeItems = useCallback((ids) => {
    setData(prev => prev.filter(item => !ids.includes(item.id)));
  }, []);

  // Acciones de ordenamiento
  const handleSort = useCallback((field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  // Acciones de filtrado
  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const clearFilter = useCallback((key) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
    setCurrentPage(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  // Acciones de paginación
  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, stats.totalPages)));
  }, [stats.totalPages]);

  const nextPage = useCallback(() => {
    if (stats.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [stats.hasNextPage]);

  const prevPage = useCallback(() => {
    if (stats.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [stats.hasPrevPage]);

  // Resetear lista
  const resetList = useCallback(() => {
    setData(initialData);
    clearAllFilters();
  }, [initialData, clearAllFilters]);

  // Buscar y reemplazar
  const bulkUpdate = useCallback((predicate, updates) => {
    setData(prev => prev.map(item => 
      predicate(item) ? { ...item, ...updates } : item
    ));
  }, []);

  return {
    // Datos
    data: paginatedData,
    allData: sortedData,
    originalData: data,
    
    // Estado de filtros y búsqueda
    searchQuery,
    filters,
    sortConfig,
    
    // Estadísticas
    stats,
    
    // Acciones de datos
    setData,
    addItem,
    updateItem,
    removeItem,
    removeItems,
    bulkUpdate,
    resetList,
    
    // Acciones de búsqueda y filtrado
    setSearchQuery,
    setFilter,
    clearFilter,
    clearAllFilters,
    
    // Acciones de ordenamiento
    handleSort,
    
    // Acciones de paginación
    goToPage,
    nextPage,
    prevPage,
    setCurrentPage
  };
};
