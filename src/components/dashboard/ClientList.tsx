import { useState, useEffect } from "react";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profile: {
    fitnessLevel?: string;
    fitnessGoals?: string[];
    weight?: number;
    height?: number;
  };
  workoutPlans: {
    id: string;
    name: string;
    isActive: boolean;
  }[];
}

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/trainer/clients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Errore nel caricamento dei clienti:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">I Miei Clienti</h2>
        <button
          onClick={() => setShowAddClientModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          + Aggiungi Cliente
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <h3 className="font-semibold text-lg">
              {client.firstName} {client.lastName}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{client.email}</p>
            <div className="mt-2">
              <p>
                Livello fitness:{" "}
                {client.profile?.fitnessLevel || "Non specificato"}
              </p>
              <p>
                Obiettivi:{" "}
                {(client.profile?.fitnessGoals ?? []).length > 0
                  ? client.profile?.fitnessGoals?.join(", ")
                  : "Non specificati"}
              </p>
              {client.profile?.weight && (
                <p>Peso: {client.profile.weight} kg</p>
              )}
              {client.profile?.height && (
                <p>Altezza: {client.profile.height} cm</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}