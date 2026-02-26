/**
 * API Configuration and Constants
 */

export const API_BASE_URL = 'https://dummyjson.com';
export const API_ENDPOINTS = {
  USERS: '/users',
};

export const API_TIMEOUT = 30000; // 30 seconds
export const RETRY_ATTEMPTS = 3;

export const API_MESSAGES = {
  LOADING: 'Loading users…',
  ERROR: 'Failed to load users.',
  NO_RESULTS: 'No users found',
};
