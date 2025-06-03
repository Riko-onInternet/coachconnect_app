// Configurazione dell'API URL

// Funzione che determina l'URL base dell'API in base all'ambiente
export function getApiBaseUrl(): string {
  // In un ambiente di produzione, potremmo usare un URL diverso
  // Per ora, controlliamo se stiamo accedendo dall'esterno
  
  // Se stai testando da un dispositivo sulla rete locale, sostituisci con il tuo IP
  const serverIp = '192.168.0.3'; // Sostituisci con l'IP del tuo computer sulla rete
  
  // Usa l'IP del server quando accedi da un dispositivo esterno
  return `http://${serverIp}:3000`;
}

// URL base per l'API
export const API_BASE_URL = getApiBaseUrl();

// URL base per Socket.IO
export const SOCKET_URL = getApiBaseUrl();