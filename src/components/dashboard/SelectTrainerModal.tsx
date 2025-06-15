/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import { Trainer } from '@/types/types';
import { API_BASE_URL } from "@/utils/config";

interface SelectTrainerModalProps {
  onClose: () => void;
  onSelect: (trainerId: string) => void;
}

export default function SelectTrainerModal({ onClose, onSelect }: SelectTrainerModalProps) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const token = localStorage.getItem('token');
        // Modifica l'URL per utilizzare la nuova route
        const response = await fetch(`${API_BASE_URL}/api/trainer/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Errore nel recupero dei trainer');
        }
        const data = await response.json();
        setTrainers(data);
      } catch (error) {
        console.error('Errore nel caricamento dei trainer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Seleziona il tuo Trainer</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Scegli un trainer per iniziare il tuo percorso fitness
        </p>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => onSelect(trainer.id)}
              >
                <div className="flex items-center space-x-4">
                  {trainer.avatar && (
                    <img
                      src={trainer.avatar}
                      alt={`${trainer.firstName} ${trainer.lastName}`}
                      className="h-12 w-12 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">
                      {trainer.firstName} {trainer.lastName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {trainer.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}