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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div
            key={client.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {client.firstName} {client.lastName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{client.email}</p>
              </div>
              <button className="text-blue-500 hover:text-blue-600">
                <span className="sr-only">Menu</span>
                ⋮
              </button>
            </div>

            <div className="space-y-2">
              {client.profile.fitnessLevel && (
                <p className="text-sm">
                  <span className="font-medium">Livello:</span>{" "}
                  {client.profile.fitnessLevel}
                </p>
              )}
              {client.profile.fitnessGoals && (
                <div className="flex flex-wrap gap-2">
                  {client.profile.fitnessGoals.map((goal, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium mb-2">Schede Attive</h4>
              {client.workoutPlans
                .filter((plan) => plan.isActive)
                .map((plan) => (
                  <div
                    key={plan.id}
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    • {plan.name}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}