import React, { useState, useEffect } from "react";

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

interface ClientEditFormProps {
  client: Client;
  onSave: (formData: {
    firstName: string;
    lastName: string;
    email: string;
    fitnessLevel: string;
    fitnessGoals: string[];
    weight: string;
    height: string;
  }) => void;
  onCancel: () => void;
}

export default function ClientEditForm({
  client,
  onSave,
  onCancel,
}: ClientEditFormProps) {
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
    setFormData({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      fitnessLevel: client.clientProfile?.fitnessLevel || "",
      fitnessGoals: client.clientProfile?.fitnessGoals || [],
      weight: client.clientProfile?.weight?.toString() || "",
      height: client.clientProfile?.height?.toString() || "",
    });
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData((prev) => ({
        ...prev,
        fitnessGoals: [...prev.fitnessGoals, newGoal.trim()],
      }));
      setNewGoal("");
    }
  };

  const removeGoal = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.filter((_, i) => i !== index),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
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
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            setFormData({ ...formData, fitnessLevel: e.target.value })
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
            onClick={addGoal}
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
              <span className="text-gray-700 dark:text-gray-300">{goal}</span>
              <button
                type="button"
                onClick={() => removeGoal(index)}
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
          onClick={onCancel}
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
  );
}