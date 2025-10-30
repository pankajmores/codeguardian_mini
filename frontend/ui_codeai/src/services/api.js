// Central API configuration and utilities
const API_BASE = {
  REPO_SERVICE: "http://localhost:5001/api",
  AI_REVIEW_SERVICE: "http://localhost:5002/api",
  METRICS_SERVICE: "http://localhost:5003/api",
  NOTIFICATION_SERVICE: "http://localhost:5004/notify",
  INSIGHT_SERVICE: "http://localhost:5005/api",
};

/**
 * Generic fetch helper for backend services
 */
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    // Handle non-2xx responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`HTTP error! status: ${response.status} — ${errorText}`);
    }

    // Try to parse JSON response
    try {
      return await response.json();
    } catch {
      return {}; // Return empty if no JSON body
    }
  } catch (error) {
    console.error("❌ API call failed:", error);
    throw error;
  }
};

/**
 * Service-aware helper — automatically prefixes the correct base URL
 * @param {string} path - Endpoint path (e.g. "/commits?owner=foo&repo=bar")
 * @param {string} service - One of the API_BASE keys
 * @param {object} options - fetch options
 */
const api = async (path, service = "REPO_SERVICE", options = {}) => {
  const base = API_BASE[service];
  if (!base) throw new Error(`Unknown service: ${service}`);
  const fullUrl = path.startsWith("http") ? path : `${base}${path}`;
  return apiCall(fullUrl, options);
};

export default {
  API_BASE,
  apiCall,
  api,
};
