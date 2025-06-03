import { useState, useEffect } from "react";
import {
  Trash2,
  Edit,
  X,
  Search,
  UserPlus,
  Filter,
  ChevronRight,
  Star,
  Activity,
  Target,
} from "lucide-react";
import { API_BASE_URL } from "@/utils/config";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    fitnessLevel: "",
    fitnessGoals: [] as string[],
    weight: "",
    height: "",
  });
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

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
        `${API_BASE_URL}/api/trainer/clients`,
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
        `${API_BASE_URL}/api/trainer/clients/${clientId}`,
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
        `${API_BASE_URL}/api/trainer/clients/${selectedClient.id}`,
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
            fitnessLevel:
              updatedClient.clientProfile?.fitnessLevel || "Principiante",
            fitnessGoals: updatedClient.clientProfile?.fitnessGoals || [],
          },
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

  const refreshSelectedClient = async (clientId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/trainer/clients/${clientId}`,
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
        `${API_BASE_URL}/api/trainer/clients/${clientId}`,
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

  const filteredClients = clients.filter(
    (client) =>
      `${client.firstName} ${client.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFitnessLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "principiante":
        return "bg-green-100 text-green-800";
      case "intermedio":
        return "bg-yellow-100 text-yellow-800";
      case "avanzato":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          I Miei Clienti
        </h2>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
            <input
              type="text"
              placeholder="Cerca cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nessun cliente trovato
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            {searchTerm
              ? `Nessun risultato per "${searchTerm}"`
              : "Non hai ancora aggiunto clienti"}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
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
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 flex flex-col cursor-pointer"
            >
              <div className="p-5 flex items-start gap-4">
                <div className="flex-shrink-0">
                  {client.firstName && client.lastName ? (
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {getInitials(client.firstName, client.lastName)}
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-white truncate">
                    {client.firstName} {client.lastName}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm truncate mb-2">
                    {client.email}
                  </p>

                  <div className="flex items-center gap-2 mb-2">
                    <Activity size={14} className="text-gray-400" />
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getFitnessLevelColor(
                        client.clientProfile?.fitnessLevel || "Principiante"
                      )}`}
                    >
                      {client.clientProfile?.fitnessLevel || "Principiante"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 mt-auto">
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
                    <Target size={14} /> Obiettivi
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {client.clientProfile?.fitnessGoals?.length ? (
                      client.clientProfile.fitnessGoals
                        .slice(0, 2)
                        .map((goal: string, index: number) => (
                          <span
                            key={index}
                            className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full truncate max-w-[120px]"
                          >
                            {goal}
                          </span>
                        ))
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-2 py-1 rounded-full">
                        Non specificati
                      </span>
                    )}
                    {(client.clientProfile?.fitnessGoals?.length ?? 0) > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-2 py-1 rounded-full">
                        +{(client.clientProfile?.fitnessGoals?.length ?? 0) - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-3 flex justify-end">
                <button className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-1 hover:underline">
                  Dettagli <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal dettagli cliente */}
      {showModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {editMode ? "Modifica Cliente" : "Dettagli Cliente"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedClient(null);
                  setEditMode(false);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-5">
              {editMode ? (
                <form onSubmit={handleUpdateClient} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cognome
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Livello Fitness
                    </label>
                    <select
                      value={formData.fitnessLevel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fitnessLevel: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Principiante">Principiante</option>
                      <option value="Intermedio">Intermedio</option>
                      <option value="Avanzato">Avanzato</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Obiettivi Fitness
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                        className="px-4 py-2 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                      >
                        Aggiungi
                      </button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {formData.fitnessGoals.map((goal, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-lg"
                        >
                          <span className="text-gray-700 dark:text-gray-300">
                            {goal}
                          </span>
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
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Peso (kg)
                      </label>
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) =>
                          setFormData({ ...formData, weight: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Altezza (cm)
                      </label>
                      <input
                        type="number"
                        value={formData.height}
                        onChange={(e) =>
                          setFormData({ ...formData, height: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                      Annulla
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Salva Modifiche
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {getInitials(
                        selectedClient.firstName,
                        selectedClient.lastName
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        {selectedClient.firstName} {selectedClient.lastName}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        {selectedClient.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                        Informazioni Fitness
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Livello
                          </p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            <span
                              className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${getFitnessLevelColor(
                                selectedClient.clientProfile?.fitnessLevel ||
                                  "Principiante"
                              )}`}
                            >
                              {selectedClient.clientProfile?.fitnessLevel ||
                                "Principiante"}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            BMI
                          </p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {selectedClient.clientProfile?.weight &&
                            selectedClient.clientProfile?.height
                              ? (
                                  selectedClient.clientProfile.weight /
                                  Math.pow(
                                    selectedClient.clientProfile.height / 100,
                                    2
                                  )
                                ).toFixed(1)
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Obiettivi Fitness
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedClient.clientProfile?.fitnessGoals?.length ? (
                          selectedClient.clientProfile.fitnessGoals.map(
                            (goal: string, index: number) => (
                              <span
                                key={index}
                                className="text-sm bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full"
                              >
                                {goal}
                              </span>
                            )
                          )
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Non specificati
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Peso
                        </h3>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                          {selectedClient.clientProfile?.weight
                            ? `${selectedClient.clientProfile.weight} kg`
                            : "Non specificato"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Altezza
                        </h3>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                          {selectedClient.clientProfile?.height
                            ? `${selectedClient.clientProfile.height} cm`
                            : "Non specificato"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      onClick={() => handleDeleteClient(selectedClient.id)}
                      className="px-4 py-2 flex items-center gap-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 size={18} /> Elimina
                    </button>
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 flex items-center gap-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      <Edit size={18} /> Modifica
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
