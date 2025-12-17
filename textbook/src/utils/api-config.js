// src/utils/api-config.js - This will be used to set API configuration

// This function sets up the API configuration
export function setupApiConfig() {
  // Set default configuration on window object
  if (typeof window !== 'undefined') {
    // You can customize this based on your environment
    window.API_CONFIG = window.API_CONFIG || {
      API_URL: process.env.REACT_APP_API_URL || process.env.API_URL || 'https://physical-ai-textbook-zeta.vercel.app'
    };
  }
}

// Run this when the module is loaded
setupApiConfig();