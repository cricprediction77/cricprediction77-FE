// ✅ Prediction Backend URL (Render-safe)
export const PREDICTION_BASE_URL =
  process.env.REACT_APP_PREDICTION_BASE_URL || "http://localhost:8000";

// ✅ Generic Prediction API Fetch Wrapper
export const predictionApiFetch = async (endpoint, options = {}) => {
  const response = await fetch(`${PREDICTION_BASE_URL}${endpoint}`, {
    ...options,
    credentials: endpoint.includes("/auth") ? "include" : "omit",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    sessionStorage.clear();
    window.location.href = "/login";
    return;
  }

  if (response.status === 204) return null;

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};
