export function getUserId(): string | null {
  try {
    // Cerca il token sia in localStorage che in sessionStorage
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token || token === 'null' || token === 'undefined') {
      console.log("🔍 Token non trovato o non valido");
      return null;
    }

    // Decodifica il token JWT
    const base64Url = token.split('.');
    
    // Verifica che il token abbia il formato corretto (header.payload.signature)
    if (base64Url.length !== 3) {
      console.error("Token JWT malformato");
      return null;
    }
    
    const base64 = base64Url[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);
    return decoded.userId;
  } catch (error) {
    console.error("Errore nel recupero dell'ID utente:", error);
    return null;
  }
}

// Aggiungi questa nuova funzione helper
export function getValidToken(): string | null {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token || token === 'null' || token === 'undefined') {
    return null;
  }
  return token;
}