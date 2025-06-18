function getApiBaseUrl(): string {
  // Decommentare per test locali
  // const serverIp = "localhost";
  // const serverPort = "3001";
  // return `http://${serverIp}:${serverPort}`;
  return `https://coachconnect-server.onrender.com`;
}

// URL base per l'API
export const API_BASE_URL = getApiBaseUrl();

// URL base per Socket.IO
export const SOCKET_URL = getApiBaseUrl();
