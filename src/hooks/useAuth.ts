import { useState, useEffect } from 'react';
import { Trainer } from '@/types/trainer';

export function useAuth() {
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const trainerData = localStorage.getItem('trainer');
        
        if (token && trainerData) {
          setTrainer(JSON.parse(trainerData));
        } else {
          setTrainer(null);
        }
      } catch (error) {
        console.error('Errore nel recupero dei dati:', error);
        setTrainer(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('trainer');
    setTrainer(null);
  };

  return { trainer, isLoading, logout };
}