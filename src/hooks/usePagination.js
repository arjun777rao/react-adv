import { useState, useEffect } from 'react';

/**
 * Simple pagination hook.
 * @param {Array} items array of data
 * @param {number} initialPageSize
 * @returns {{ currentPage: number, pageSize: number, totalPages: number, pagedData: Array, setPageSize: Function, setCurrentPage: Function }}
 */
export const usePagination = (items = [], initialPageSize = 5) => {
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [items.length, pageSize]);

  useEffect(() => {
    setTotalPages(Math.ceil(items.length / pageSize) || 1);
  }, [items.length, pageSize]);

  const pagedData = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return {
    currentPage,
    pageSize,
    totalPages,
    pagedData,
    setPageSize,
    setCurrentPage,
  };
};
