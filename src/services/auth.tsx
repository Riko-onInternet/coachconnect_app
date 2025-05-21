interface LoginResponse {
  token: string;
  trainer: {
    id: string;
    email: string;
    name: string;
    surname: string;
  }
}

interface RegisterTrainerData {
  email: string;
  password: string;
  name: string;
  surname: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const authService = {
  async loginTrainer(credentials: { email: string; password: string }): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/trainer/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Credenziali non valide');
    }

    return response.json();
  },

  async registerTrainer(data: RegisterTrainerData): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/trainer/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Errore durante la registrazione');
    }

    return response.json();
  }
};