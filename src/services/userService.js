import axios from "axios";

// Base URL for API requests
const API_URL = "https://jsonplaceholder.typicode.com";

/**
 * Fetches the list of users from the API.
 */
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Creates a new user via API (POST request).
 */
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    
    // We adjust the response structure to match the user list format
    return {
        ...response.data, 
        // Ensure company is an object for consistency
        company: { name: userData.company || 'New Company' } 
    };

  } catch (error) {
    console.error("API Error creating user:", error);
    throw error; 
  }
};

/**
 * Updates an existing user via API (PUT request).
 */
export const updateUser = async (id, updatedData) => {
    // API simulates success with a 200 OK response, but data isn't updated on server.
    const response = await axios.put(`${API_URL}/users/${id}`, updatedData);
    
    // The API response might simplify the data, so we reconstruct the company field
    return {
        ...response.data,
        company: updatedData.company || response.data.company
    }
};

/**
 * Deletes a user via API (DELETE request).
 */
export const deleteUser = async (id) => {
    // API simulates success with a 200 OK response.
    await axios.delete(`${API_URL}/users/${id}`);
    return true; 
};