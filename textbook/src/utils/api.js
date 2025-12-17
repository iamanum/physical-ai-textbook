// textbook/src/utils/api.js
// Default API configuration
const DEFAULT_API_BASE_URL = 'https://physical-ai-textbook-zeta.vercel.app';

// Function to get API base URL with fallback
function getApiBaseUrl() {
  // Check for custom API URL in window object (can be set by Docusaurus config)
  if (typeof window !== 'undefined' && window.API_CONFIG) {
    return window.API_CONFIG.API_URL || DEFAULT_API_BASE_URL;
  }

  // Fallback to default
  return DEFAULT_API_BASE_URL;
}

// Function to send a query to the backend
export const sendQuery = async (query) => {
  try {
    const API_BASE_URL = getApiBaseUrl();
    console.log(API_BASE_URL, "API_BASE_URL")
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Health check function
export const healthCheck = async () => {
  try {
    const API_BASE_URL = getApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};