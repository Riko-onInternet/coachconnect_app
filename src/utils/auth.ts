export function getUserId(): string | null {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    // Decodifica il token JWT
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
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