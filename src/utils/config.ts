function getApiBaseUrl(): string {
  // const serverIp = "localhost";
  // const serverPort = "3000";
  return `https://coachconnect-server.onrender.com`;
}

// URL base per l'API
export const API_BASE_URL = getApiBaseUrl();

// URL base per Socket.IO
export const SOCKET_URL = getApiBaseUrl();
