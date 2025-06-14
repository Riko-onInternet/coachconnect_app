/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { Pen, Trash2, Plus, Search, Filter, X, SearchX } from "lucide-react";
import { API_BASE_URL } from "@/utils/config";

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  description?: string;
  image?: string;
}

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("");
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    muscleGroup: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    // Estrai tutti i gruppi muscolari unici dagli esercizi
    const uniqueMuscleGroups = [...new Set(exercises.map(ex => ex.muscleGroup))];
    setMuscleGroups(uniqueMuscleGroups);
    
    // Filtra gli esercizi in base al termine di ricerca e al gruppo muscolare selezionato
    let filtered = [...exercises];
    
    if (searchTerm) {
      filtered = filtered.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedMuscleGroup) {
      filtered = filtered.filter(ex => ex.muscleGroup === selectedMuscleGroup);
    }
    
    setFilteredExercises(filtered);
  }, [exercises, searchTerm, selectedMuscleGroup]);

  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/exercises`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setExercises(data);
      setFilteredExercises(data);
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
        ? `${API_BASE_URL}/api/exercises/${editingExercise.id}`
        : `${API_BASE_URL}/api/exercises`;
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
      const response = await fetch(
        `${API_BASE_URL}/api/exercises/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedMuscleGroup("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header con titolo e pulsante aggiungi */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Esercizi</h2>
        <button
          onClick={() => {
            setEditingExercise(null);
            setFormData({
              name: "",
              muscleGroup: "",
              description: "",
              image: "",
            });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white flex justify-center items-center gap-1 rounded-lg hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus size={18} /> Aggiungi Esercizio
        </button>
      </div>

      {/* Barra di ricerca e filtri */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cerca esercizi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              value={selectedMuscleGroup}
              onChange={(e) => setSelectedMuscleGroup(e.target.value)}
              className="pl-10 w-full md:w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="">Tutti i gruppi</option>
              {muscleGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>
          
          {(searchTerm || selectedMuscleGroup) && (
            <button 
              onClick={resetFilters}
              className="flex items-center justify-center gap-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <X size={16} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Contatore risultati */}
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {filteredExercises.length} {filteredExercises.length === 1 ? 'esercizio trovato' : 'esercizi trovati'}
      </p>

      {/* Griglia degli esercizi */}
      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-gray-100 dark:border-gray-700"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                {exercise.image ? (
                  <img 
                    src={exercise.image} 
                    alt={exercise.name} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <span>Nessuna immagine</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {exercise.muscleGroup}
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{exercise.name}</h3>
                {exercise.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                    {exercise.description.length > 100 
                      ? `${exercise.description.substring(0, 100)}...` 
                      : exercise.description}
                  </p>
                )}
                
                <div className="flex justify-between gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(exercise)}
                    className="flex-1 h-10 text-sm flex items-center justify-center gap-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <Pen size={16} /> Modifica
                  </button>
                  <button
                    onClick={() => handleDelete(exercise.id)}
                    className="flex-1 h-10 text-sm flex items-center justify-center gap-1 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <Trash2 size={16} /> Elimina
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <SearchX size={64} strokeWidth={1} />
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Nessun esercizio trovato</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Prova a modificare i filtri di ricerca</p>
          <button 
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Mostra tutti gli esercizi
          </button>
        </div>
      )}

      {/* Modal per aggiungere/modificare esercizio */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {editingExercise ? "Modifica Esercizio" : "Nuovo Esercizio"}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gruppo Muscolare
                </label>
                <input
                  type="text"
                  value={formData.muscleGroup}
                  onChange={(e) =>
                    setFormData({ ...formData, muscleGroup: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrizione
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL Immagine
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://esempio.com/immagine.jpg"
                />
                {formData.image && (
                  <div className="mt-2 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img 
                      src={formData.image} 
                      alt="Anteprima" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Immagine+non+disponibile';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
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
