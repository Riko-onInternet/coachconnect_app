import { useState, useEffect } from "react";
import { Trash2, Edit, X } from "lucide-react";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  clientProfile?: {
    fitnessLevel: string;
    fitnessGoals: string[];
    weight: number | null;
    height: number | null;
  };
}

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    fitnessLevel: "",
    fitnessGoals: [] as string[],
    weight: "",
    height: "",
  });
  const [newGoal, setNewGoal] = useState(""); // Aggiungi questo stato

  useEffect(() => {
    fetchClients();
  }, []); // Questo useEffect rimane invariato

  useEffect(() => {
    if (selectedClient) {
      setFormData({
        firstName: selectedClient.firstName,
        lastName: selectedClient.lastName,
        email: selectedClient.email,
        fitnessLevel: selectedClient.clientProfile?.fitnessLevel || "",
        fitnessGoals: selectedClient.clientProfile?.fitnessGoals || [],
        weight: selectedClient.clientProfile?.weight?.toString() || "",
        height: selectedClient.clientProfile?.height?.toString() || "",
      });
    }
  }, [selectedClient]);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/trainer/clients",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Errore nel caricamento dei clienti:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("Sei sicuro di voler rimuovere questo cliente?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/trainer/clients/${clientId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setClients(clients.filter((client) => client.id !== clientId));
        setShowModal(false);
        setSelectedClient(null);
      }
    } catch (error) {
      console.error("Errore nella rimozione del cliente:", error);
    }
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      const token = localStorage.getItem("token");
      const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        fitnessLevel: formData.fitnessLevel || "Principiante",
        fitnessGoals: formData.fitnessGoals,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
      };

      const response = await fetch(
        `http://localhost:3000/api/trainer/clients/${selectedClient.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        const updatedClient = await response.json();
        
        // Aggiorna il client selezionato con i dati corretti
        setSelectedClient({
          ...updatedClient,
          clientProfile: {
            ...updatedClient.clientProfile,
            fitnessLevel: updatedClient.clientProfile?.fitnessLevel || "Principiante",
            fitnessGoals: updatedClient.clientProfile?.fitnessGoals || [],
          }
        });
        
        // Aggiorna la lista dei clienti
        setClients((prevClients) =>
          prevClients.map((client) =>
            client.id === selectedClient.id ? updatedClient : client
          )
        );

        // Aggiorna il form con i dati aggiornati
        setFormData({
          firstName: updatedClient.firstName,
          lastName: updatedClient.lastName,
          email: updatedClient.email,
          fitnessLevel: updatedClient.clientProfile?.fitnessLevel || "",
          fitnessGoals: updatedClient.clientProfile?.fitnessGoals || [],
          weight: updatedClient.clientProfile?.weight?.toString() || "",
          height: updatedClient.clientProfile?.height?.toString() || "",
        });

        setEditMode(false);
      }
    } catch (error) {
      console.error("Errore nell'aggiornamento del cliente:", error);
    }
  };

  // Aggiungiamo una funzione per ricaricare i dati del cliente selezionato
  const refreshSelectedClient = async (clientId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/trainer/clients/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const updatedClient = await response.json();
        setSelectedClient(updatedClient);
        setClients((prevClients) =>
          prevClients.map((client) =>
            client.id === clientId ? updatedClient : client
          )
        );
      }
    } catch (error) {
      console.error("Errore nel recupero dei dati del cliente:", error);
    }
  };

  const fetchClientDetails = async (clientId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/trainer/clients/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const clientData = await response.json();
        return clientData;
      }
    } catch (error) {
      console.error("Errore nel recupero dei dettagli del cliente:", error);
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold leading-none">I Miei Clienti</h2>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {clients.map((client) => (
          <div
            key={client.id}
            onClick={async () => {
              const clientData = await fetchClientDetails(client.id);
              if (clientData) {
                setSelectedClient(clientData);
                setFormData({
                  firstName: clientData.firstName,
                  lastName: clientData.lastName,
                  email: clientData.email,
                  fitnessLevel: clientData.clientProfile?.fitnessLevel || "",
                  fitnessGoals: clientData.clientProfile?.fitnessGoals || [],
                  weight: clientData.clientProfile?.weight?.toString() || "",
                  height: clientData.clientProfile?.height?.toString() || "",
                });
              }
              setShowModal(true);
              setEditMode(false);
            }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <img
              src="https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5"
              alt={`${client.firstName} ${client.lastName}`}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex flex-col items-start">
              <h3 className="font-semibold text-lg">
                {client.firstName} {client.lastName}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{client.email}</p>
              <div>
                <p className="truncate text-wrap flex flex-col items-start mb-2">
                  <span className="font-bold">Livello fitness:</span>{" "}
                  <span className="text-sm bg-neutral-200 px-2 py-1 rounded-full">
                    {client.clientProfile?.fitnessLevel || "Principiante"}
                  </span>
                </p>
                <div className="truncate text-wrap flex flex-col items-start">
                  <span className="font-bold">Obiettivi:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {client.clientProfile?.fitnessGoals?.length ? (
                      client.clientProfile.fitnessGoals.map((goal: string, index: number) => (
                        <span
                          key={index}
                          className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                        >
                          {goal}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        Non specificati
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal dettagli cliente */}
      {showModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full m-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">
                {editMode ? "Modifica Cliente" : "Dettagli Cliente"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedClient(null);
                  setEditMode(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {editMode ? (
              <form onSubmit={handleUpdateClient} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Cognome
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Livello Fitness
                  </label>
                  <input
                    type="text"
                    value={formData.fitnessLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, fitnessLevel: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Obiettivi Fitness
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg"
                      placeholder="Aggiungi un obiettivo"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newGoal.trim()) {
                          setFormData((prev) => ({
                            ...prev,
                            fitnessGoals: [
                              ...prev.fitnessGoals,
                              newGoal.trim(),
                            ],
                          }));
                          setNewGoal("");
                        }
                      }}
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                      Aggiungi
                    </button>
                  </div>
                  {/* Lista degli obiettivi esistenti */}
                  <div className="space-y-2">
                    {formData.fitnessGoals.map((goal, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <span>{goal}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              fitnessGoals: prev.fitnessGoals.filter(
                                (_, i) => i !== index
                              ),
                            }));
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Altezza (cm)
                    </label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Salva Modifiche
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nome</p>
                      <p className="font-medium">{selectedClient.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cognome</p>
                      <p className="font-medium">{selectedClient.lastName}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedClient.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Livello Fitness</p>
                    <p className="font-medium">
                      {selectedClient.clientProfile?.fitnessLevel || "Principiante"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Obiettivi Fitness</p>
                    <p className="font-medium">
                      {selectedClient.clientProfile?.fitnessGoals?.length
                        ? selectedClient.clientProfile.fitnessGoals.join(", ")
                        : "Non specificati"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Peso</p>
                      <p className="font-medium">
                        {selectedClient.clientProfile?.weight
                          ? `${selectedClient.clientProfile.weight} kg`
                          : "Non specificato"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Altezza</p>
                      <p className="font-medium">
                        {selectedClient.clientProfile?.height
                          ? `${selectedClient.clientProfile.height} cm`
                          : "Non specificato"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => handleDeleteClient(selectedClient.id)}
                    className="px-4 py-2 flex items-center gap-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    <Trash2 size={18} /> Elimina
                  </button>
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 flex items-center gap-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  >
                    <Edit size={18} /> Modifica
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
