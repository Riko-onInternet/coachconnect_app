import { useState, useEffect } from "react";

import { Pen, Trash2, Plus } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  description?: string;
  image?: string;
}

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    muscleGroup: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/exercises", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error("Errore nel caricamento degli esercizi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const url = editingExercise
        ? `http://localhost:3000/api/exercises/${editingExercise.id}`
        : "http://localhost:3000/api/exercises";
      const method = editingExercise ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchExercises();
        setShowAddModal(false);
        setEditingExercise(null);
        setFormData({ name: "", muscleGroup: "", description: "", image: "" });
      }
    } catch (error) {
      console.error("Errore nel salvataggio dell'esercizio:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo esercizio?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/exercises/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setExercises(exercises.filter((ex) => ex.id !== id));
      }
    } catch (error) {
      console.error("Errore nell'eliminazione dell'esercizio:", error);
    }
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormData({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      description: exercise.description || "",
      image: exercise.image || "",
    });
    setShowAddModal(true);
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
        <h2 className="text-2xl font-bold">Esercizi</h2>
        <button
          onClick={() => {
            setEditingExercise(null);
            setFormData({ name: "", muscleGroup: "", description: "", image: "" });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white flex justify-center items-center gap-1 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={18} /> Aggiungi Esercizio
        </button>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4 mt-4">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="max-w-[1000px] w-full bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex gap-4 flex-col md:flex-row"
          >
            <div className="sm:max-w-48 w-full sm:max-h-48 h-full object-cover rounded-lg overflow-hidden">
              {exercise.image && (
                <img
                  src={exercise.image}
                  alt={exercise.name}
                  className=""
                />
              )}
            </div>
            <div className="flex flex-col justify-between gap-4 sm:gap-0 sm:py-4 items-start">
              <div>
                <h3 className="text-lg font-semibold">{exercise.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {exercise.muscleGroup}
                </p>
                {exercise.description && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {exercise.description}
                  </p>
                )}
              </div>
              <div className="flex justify-start gap-2">
                <button
                  onClick={() => handleEdit(exercise)}
                  className="px-6 h-10 text-sm flex items-center justify-center gap-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                >
                  <Pen size={18} /> Modifica
                </button>
                <button
                  onClick={() => handleDelete(exercise.id)}
                  className="px-6 h-10 text-sm flex items-center justify-center gap-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  <Trash2 size={18} /> Elimina
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal per aggiungere/modificare esercizio */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              {editingExercise ? "Modifica Esercizio" : "Nuovo Esercizio"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Gruppo Muscolare
                </label>
                <input
                  type="text"
                  value={formData.muscleGroup}
                  onChange={(e) =>
                    setFormData({ ...formData, muscleGroup: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Descrizione
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  URL Immagine
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {editingExercise ? "Salva Modifiche" : "Aggiungi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}