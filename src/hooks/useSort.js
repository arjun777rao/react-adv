import { useState, useCallback } from 'react';

/**
 * Provides sorting state and handler for a given key.
 *
 * @returns {[{key: string|null, direction: 'asc'|'desc'}, function]} state and requestSort function
 */
export const useSort = (initialKey = null, initialDirection = 'asc') => {
  const [sortConfig, setSortConfig] = useState({ key: initialKey, direction: initialDirection });

  const requestSort = useCallback((key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  return [sortConfig, requestSort];
};
