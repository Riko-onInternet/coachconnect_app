import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { API_BASE_URL } from "@/utils/config";
import ClientCard from "./ClientCard";
import ClientModal from "./ClientModal";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";

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
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/trainer/clients`, {
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

  const handleClientClick = async (client: Client) => {
    const clientData = await fetchClientDetails(client.id);
    if (clientData) {
      setSelectedClient(clientData);
    }
    setShowModal(true);
  };

  const handleClientUpdate = (updatedClient: Client) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
    setSelectedClient(updatedClient);
  };

  const handleClientDelete = (clientId: string) => {
    setClients(clients.filter((client) => client.id !== clientId));
    setShowModal(false);
    setSelectedClient(null);
  };

  const filteredClients = clients.filter(
    (client) =>
      `${client.firstName} ${client.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
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
        <EmptyState searchTerm={searchTerm} />
      ) : (
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onClick={() => handleClientClick(client)}
            />
          ))}
        </div>
      )}

      {showModal && selectedClient && (
        <ClientModal
          client={selectedClient}
          onClose={() => {
            setShowModal(false);
            setSelectedClient(null);
          }}
          onUpdate={handleClientUpdate}
          onDelete={handleClientDelete}
        />
      )}
    </div>
  );
}
