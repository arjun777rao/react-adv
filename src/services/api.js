/**
 * API Service - Centralized API calls
 * All API communication goes through this service
 */

import { API_BASE_URL, API_ENDPOINTS } from '../constants';

class APIService {
  /**
   * Fetch users from the API
   * @returns {Promise<Array>} Array of user objects
   * @throws {Error} If the request fails
   */
  async getUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }

  /**
   * Get a single user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object>} User object
   */
  async getUserById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}/${id}`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new user (placeholder for future implementation)
   * @param {Object} userData - User data to create
   * @returns {Promise<Object>} Created user object
   */
  async createUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  /**
   * Update a user (placeholder for future implementation)
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user object
   */
  async updateUser(id, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a user (placeholder for future implementation)
   * @param {number} id - User ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteUser(id) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      throw error;
    }
  }
}

export default new APIService();
