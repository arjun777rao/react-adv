import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

/**
 * Fetches users from the dummyjson API.
 * 
 * Returns a promise that resolves to an array of users.
 * Throws if the network response is not ok.
 */
export const fetchUsersFromApi = async () => {
  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.users;
};
