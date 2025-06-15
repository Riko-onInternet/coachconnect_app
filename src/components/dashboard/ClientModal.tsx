import React, { useState } from "react";
import { X, Trash2, Edit } from "lucide-react";
import { API_BASE_URL } from "@/utils/config";
import ClientDetails from "./ClientDetails";
import ClientEditForm from "./ClientEditForm";

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

interface ClientModalProps {
  client: Client;
  onClose: () => void;
  onUpdate: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

export default function ClientModal({
  client,
  onClose,
  onUpdate,
  onDelete,
}: ClientModalProps) {
  const [editMode, setEditMode] = useState(false);

  const handleDeleteClient = async () => {
    if (!confirm("Sei sicuro di voler rimuovere questo cliente?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/trainer/clients/${client.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        onDelete(client.id);
      }
    } catch (error) {
      console.error("Errore nella rimozione del cliente:", error);
    }
  };

  const handleUpdateClient = async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    fitnessLevel?: string;
    fitnessGoals?: string[];
    weight?: string;
    height?: string;
  }) => {
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
        `${API_BASE_URL}/api/trainer/clients/${client.id}`,
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
        onUpdate(updatedClient);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Errore nell'aggiornamento del cliente:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            {editMode ? "Modifica Cliente" : "Dettagli Cliente"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-5">
          {editMode ? (
            <ClientEditForm
              client={client}
              onSave={handleUpdateClient}
              onCancel={() => setEditMode(false)}
            />
          ) : (
            <>
              <ClientDetails client={client} />
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={handleDeleteClient}
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
  );
}