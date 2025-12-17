// /src/utils/environment.js
// Set up environment variables for the client in Docusaurus
// Docusaurus automatically handles REACT_APP_* environment variables at build time

// Using template replacement approach that works with Docusaurus build process
// The actual replacement happens during the build when process.env.REACT_APP_API_URL
// is converted to its actual value
const API_BASE_URL =
  typeof process !== 'undefined' && process.env
    ? (process.env.REACT_APP_API_URL || 'https://physical-ai-textbook-zeta.vercel.app')
    : 'https://physical-ai-textbook-zeta.vercel.app';

// Set the API configuration on the window object for the app to use
// This will be available to the ChatInterface component and other parts of the application
if (typeof window !== 'undefined') {
  window.API_CONFIG = {
    API_URL: API_BASE_URL
  };
}